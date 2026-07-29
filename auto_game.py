#!/usr/bin/env python3
"""
🤖 每日自动游戏生成器 - GitHub Actions 每天7:00运行
从 ideas.txt 读取创意 → 调用 DeepSeek → 插入 platform.html → 自动推送
"""

import os
import re
import sys
import json
import hashlib
import requests
from datetime import date
from pathlib import Path

BASE_DIR = Path(__file__).parent
PLATFORM_FILE = BASE_DIR / "platform.html"
IDEAS_FILE = BASE_DIR / "ideas.txt"
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
MODEL = "deepseek-chat"

# 固化的内置游戏类型（永远保留）
BUILTIN_TYPES = {"maze", "sudoku", "wordsearch", "puzzle", "ascii", "memory"}


def get_existing_types():
    """扫描 platform.html，返回所有已存在的游戏类型名"""
    html = PLATFORM_FILE.read_text(encoding="utf-8")
    types = set(BUILTIN_TYPES)
    for m in re.finditer(r"\n\s{4}(\w+):\s*'[^']*',", html):
        name = m.group(1)
        if name not in ("if","else","var","let","const","function","return",
                        "new","this","true","false","null","typeof","for","while"):
            types.add(name)
    return types


def make_unique_type(idea, existing):
    """生成不与已有类型冲突的唯一类型名"""
    base = "g" + hashlib.md5(idea.encode()).hexdigest()[:8]
    if base not in existing:
        return base
    for i in range(2, 100):
        candidate = f"{base}_{i}"
        if candidate not in existing:
            return candidate
    import time
    return f"g{int(time.time())}"


def read_idea():
    """读取 ideas.txt 第一行创意"""
    if not IDEAS_FILE.exists():
        print("⚠️ ideas.txt 不存在，使用默认创意")
        return "做一个有趣的网页小游戏", None

    lines = [l.strip() for l in IDEAS_FILE.read_text(encoding="utf-8").splitlines() if l.strip()]
    if not lines:
        print("⚠️ ideas.txt 已空，使用默认创意")
        return "做一个有趣的网页小游戏", None
    return lines[0], lines


def remove_first_idea(lines):
    """移除第一行创意并写回"""
    if lines is None:
        return
    remaining = lines[1:]
    IDEAS_FILE.write_text("\n".join(remaining) + "\n" if remaining else "", encoding="utf-8")
    print(f"📝 已消耗创意，剩余 {len(remaining)} 个")


def build_prompt(idea):
    """构建提示词（包含用户的游戏设计偏好）"""
    return f"""你是一个游戏开发专家。请根据下面的创意生成一个完整的网页小游戏。

【游戏创意】{idea}

【输出要求】
返回JSON：{{"title":"中英文游戏名","icon":"2字缩写","tags":"8字内描述","thumb":"56x56的SVG迷你截图（像游戏画面缩小版，纯SVG标签如<svg viewBox='0 0 56 56'>...</svg>）","css":"CSS代码","js_init":"JS函数体"}}

【用户的游戏设计偏好——必须遵守】
1. 🎨 UI风格：纯白/极浅灰背景(#f8f9fc)，简洁现代，拒绝花哨。卡片白底+轻阴影+细边框(#e2e8f0)
2. 🔤 字体：'Segoe UI', system-ui, -apple-system，不用花哨字体
3. 🎯 游戏卡片：左侧56x56px圆角小缩略图，右侧游戏名+标签。用SVG做迷你预览图
4. 🚫 禁止：不要emoji图标、不要渐变背景、不要大图案装饰
5. 📐 布局：游戏在680px弹窗内运行，响应式适配手机
6. 🕹️ 交互：支持键盘操作优先，其次鼠标。要有🔄重来按钮
7. 🏆 反馈：胜利/失败有庆祝或提示动画，分数实时更新
8. 🐛 健壮：变量声明完整、事件绑定在container内、边界条件处理。container是函数参数直接用，不要document.getElementById重新获取！
9. 🔁 可重玩：每次🔄都是全新随机对局
10. 🧹 代码干净：CSS类名加前缀防冲突，JS不用eval/外部依赖。函数体末尾只一个右花括号，不要多余括号。

【配色方案】
主色：#7c3aed(紫) #06b6d4(青) #10b981(绿) #f59e0b(金) #ef4444(红)
文字：#1e293b(深) #64748b(浅)  边框：#e2e8f0  背景：#f8f9fc / #ffffff

只返回JSON，不要任何额外解释。CSS和JS必须完整可用。"""


def call_api(api_key, idea):
    """调用 DeepSeek"""
    resp = requests.post(DEEPSEEK_API_URL, headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }, json={
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "你是网页游戏开发专家。只返回JSON，CSS和JS完整可用。"},
            {"role": "user", "content": build_prompt(idea)}
        ],
        "temperature": 0.8,
        "max_tokens": 4096,
        "response_format": {"type": "json_object"},
    }, timeout=120)

    if resp.status_code != 200:
        print(f"API错误: {resp.status_code} {resp.text[:200]}")
        sys.exit(1)

    content = resp.json()["choices"][0]["message"]["content"]
    content = re.sub(r'^```json\s*', '', content.strip())
    content = re.sub(r'\s*```$', '', content.strip())
    return json.loads(content)


def review_and_fix(api_key, title, css, js_init):
    """第二步：AI自检——审查代码找bug并修复"""
    review_prompt = f"""你是代码审查专家。下面是网页游戏代码，请检查并修复所有bug。

游戏名: {title}

【CSS代码】
{css[:2000]}

【JS代码】
{js_init[:3000]}

请找出并修复：
1. 变量未定义/拼写错误/作用域问题
2. 事件监听器未正确绑定或内存泄漏
3. 游戏逻辑漏洞（分数不更新、无法胜利/失败、死循环等）
4. CSS布局问题（溢出、重叠、响应式断裂）
5. 缺少🔄重来按钮或重置不彻底
6. UI是否简洁白色主题，无花哨元素
7. 键盘/鼠标交互是否正常
8. 边界条件（数组越界、除零、null引用）

返回JSON: {{"css":"修复后CSS","js_init":"修复后JS","changes":"修改说明"}}
如果代码没问题，changes填"无需修改"。"""

    print("🔍 第二步：AI 审查代码找bug...")
    resp = requests.post(DEEPSEEK_API_URL, headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }, json={
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "你是代码审查专家。只返回JSON。"},
            {"role": "user", "content": review_prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 4096,
        "response_format": {"type": "json_object"},
    }, timeout=120)

    if resp.status_code != 200:
        print(f"⚠️ 审查API失败，使用原始代码: {resp.status_code}")
        return css, js_init, "审查跳过"

    content = resp.json()["choices"][0]["message"]["content"]
    content = re.sub(r'^```json\s*', '', content.strip())
    content = re.sub(r'\s*```$', '', content.strip())
    try:
        result = json.loads(content)
        changes = result.get("changes", "")
        print(f"   📝 {changes}")
        return result.get("css", css), result.get("js_init", js_init), changes
    except json.JSONDecodeError:
        print("⚠️ 审查结果解析失败，使用原始代码")
        return css, js_init, "解析失败"


def create_game_folder(type_name, title, icon, tags, thumb, css, js_init):
    """创建游戏独立文件夹（game/{type_name}/）"""
    gd = BASE_DIR / "games" / type_name
    gd.mkdir(parents=True, exist_ok=True)

    # card.html
    colors = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#6366f1']
    color = colors[hash(type_name) % len(colors)]
    if thumb and '<svg' in thumb:
        thumb_html = f'<div class="thumb">{thumb}</div>'
    else:
        thumb_html = f'<div class="thumb" style="background:{color};display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff;">{icon}</div>'

    card = f"""  <div class="game-card" onclick="openGame('{type_name}')">
    {thumb_html}
    <div class="info">
      <div class="name">{title}</div>
      <div class="tags">{tags}</div>
    </div>
  </div>"""
    (gd / "card.html").write_text(card, encoding='utf-8')

    # style.css
    (gd / "style.css").write_text(css, encoding='utf-8')

    # script.js
    js_code = f"function init_{type_name}(container) {{\n{js_init}\n}}"
    (gd / "script.js").write_text(js_code, encoding='utf-8')

    print(f"📁 已创建 games/{type_name}/")


def build_platform():
    """调用 build.py 重新生成 platform.html"""
    import subprocess
    result = subprocess.run([sys.executable, str(BASE_DIR / "build.py")],
                          capture_output=True, text=True)
    print(result.stdout.strip())
    if result.returncode != 0:
        print(result.stderr)


def syntax_check(platform_html):
    """第三步：纯Python语法检查——修复AI常见bug，无需API调用"""
    fixes = []

    # 1. 双重 function(container) {
    p1 = r'(function init_\w+\(container\)\s*\{)\s*\n\s*function\s*\(container\)\s*\{'
    if re.search(p1, platform_html):
        platform_html = re.sub(p1, r'\1', platform_html)
        fixes.append("移除双重 function(container){")

    # 2. 函数末尾多余 }
    p2 = r'(startGame\(\);\s*\n\s*\})\s*\n\s*\}\s*\n\s*\n\s*<!-- ANCHOR:JS'
    if re.search(p2, platform_html):
        platform_html = re.sub(p2, r'\1\n\n<!-- ANCHOR:JS', platform_html)
        fixes.append("移除 startGame 后多余 }")

    # 3. endGame 后多余 }
    p3 = r'(endGame\(\);\s*\n\s*\})\s*\n\s*\}\s*\n\s*\n\s*<!-- ANCHOR:JS'
    if re.search(p3, platform_html):
        platform_html = re.sub(p3, r'\1\n\n<!-- ANCHOR:JS', platform_html)
        fixes.append("移除 endGame 后多余 }")

    # 4. cleanup 后多余 }（只有连续两个 } 才删）
    p4 = r'(\};\s*\n)\}\s*\n\s*\}\s*\n\s*<!-- ANCHOR:JS'
    if re.search(p4, platform_html):
        platform_html = re.sub(p4, r'\1}\n\n<!-- ANCHOR:JS', platform_html)
        fixes.append("移除 cleanup 后多余 }")

    # 5. titles 对象缺少逗号
    p5 = r"('[^']*')\s*\n\s{8}(\w+):"
    for m in re.findall(p5, platform_html):
        old = f"{m[0]}\n        {m[1]}:"
        new = f"{m[0]},\n        {m[1]}:"
        if old in platform_html:
            platform_html = platform_html.replace(old, new)
            fixes.append(f"补全逗号: {m[0]}")

    if fixes:
        print(f"🛠  语法检查修复 {len(fixes)} 处: {'; '.join(fixes)}")
    else:
        print("✅ 语法检查通过，无需修复")

    return platform_html, fixes


def main():
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        print("❌ 未设置 DEEPSEEK_API_KEY 环境变量")
        sys.exit(1)

    # 扫描已有游戏
    existing = get_existing_types()
    print(f"📋 已有 {len(existing)} 个游戏")

    # 从 ideas.txt 读取创意
    idea, lines = read_idea()
    print(f"\n🎨 第一步：AI 制作游戏")
    print(f"💡 创意: {idea}")

    result = call_api(api_key, idea)
    title = result["title"]
    icon = result.get("icon", title[:2])
    tags = result.get("tags", "AI生成")
    thumb = result.get("thumb", "")
    css = result["css"]
    js_init = result["js_init"]

    type_name = make_unique_type(title + idea, existing)
    existing.add(type_name)
    print(f"✅ 生成: {title} [{icon}] {tags}（{type_name}）")

    # 创建游戏文件夹
    create_game_folder(type_name, title, icon, tags, thumb, css, js_init)

    # 构建平台
    build_platform()

    # 语法检查
    platform_html = PLATFORM_FILE.read_text(encoding="utf-8")
    platform_html, fixes1 = syntax_check(platform_html)
    if fixes1:
        PLATFORM_FILE.write_text(platform_html, encoding="utf-8")

    os.system(f'git add games/{type_name}/ platform.html && git commit -m "🎨 新游戏: {title}" && git push')
    print("📦 第一次提交: 游戏创建完成")

    # 第二步：AI 审查修复
    print(f"\n🔍 第二步：AI 审查并修复 bug")
    fixed_css, fixed_js, changes = review_and_fix(api_key, title, css, js_init)

    if changes and "无需修改" not in changes and "解析失败" not in changes and "跳过" not in changes:
        html = PLATFORM_FILE.read_text(encoding="utf-8")
        html = html.replace(css, fixed_css)
        html = html.replace(js_init, fixed_js)

        # 🔍 审查后再次语法检查
        html, fixes2 = syntax_check(html)
        if fixes2:
            changes += " + 语法自动修复"

        PLATFORM_FILE.write_text(html, encoding="utf-8")
        os.system(f'git add games/{type_name}/ platform.html && git commit -m "🔧 审查修复: {changes[:50]}" && git push')
        print(f"📦 第二次提交: 修复完成 - {changes}")
    else:
        print("✅ 代码无需修复，跳过第二次提交")

    # 消耗创意
    if lines is not None:
        remove_first_idea(lines)
        os.system(f'git add ideas.txt')

    # 更新 TODAY.md
    today = date.today()
    (BASE_DIR / "TODAY.md").write_text(
        f"# 今日游戏: {title}\n\n> {idea}\n\n"
        f"类型名: `{type_name}`\n审查: {changes}\n\n"
        f"打开 platform.html 即可游玩！\n", encoding="utf-8")

    os.system(f'git add TODAY.md && git commit -m "📋 更新今日记录" && git push')
    print(f"\n🎉 完成！今日游戏「{title}」已上线（含自检修复）")


if __name__ == "__main__":
    main()
