#!/usr/bin/env python3
"""
🤖 每日自动游戏生成器 - GitHub Actions 每天7:00运行
自己生成创意 → 调用 DeepSeek → 插入 platform.html → 自动推送
"""

import os
import re
import sys
import json
import hashlib
import random
import requests
from datetime import date
from pathlib import Path

BASE_DIR = Path(__file__).parent
PLATFORM_FILE = BASE_DIR / "platform.html"
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
MODEL = "deepseek-chat"

# 固化的内置游戏类型（永远保留）
BUILTIN_TYPES = {"maze", "sudoku", "wordsearch", "puzzle", "ascii", "memory"}

# 创意种子池
IDEA_POOL = [
    "经典街机游戏（如打砖块、弹球、太空射击）",
    "益智解谜游戏（如滑块拼图、华容道、数独变体）",
    "反应速度类游戏（点击测试、颜色判断、节奏游戏）",
    "记忆类游戏（翻牌配对、序列记忆、图案回忆）",
    "文字游戏（拼字、填词、猜单词）",
    "数学逻辑游戏（算术挑战、数字推理、方程式）",
    "休闲小游戏（钓鱼、种菜、养宠物模拟）",
    "策略对战（井字棋、四子棋、简易卡牌对战）",
    "物理模拟（弹射、碰撞、重力感应）",
    "音乐节奏类（按键节拍、简易音游）",
]


def get_existing_types():
    """扫描 platform.html，返回所有已存在的游戏类型名"""
    html = PLATFORM_FILE.read_text(encoding="utf-8")
    types = set(BUILTIN_TYPES)
    # 只匹配标题映射中的缩进格式: "    typename: 'Title',"
    for m in re.finditer(r"\n\s{4}(\w+):\s*'[^']*',", html):
        name = m.group(1)
        # 过滤 JS 关键字
        if name not in ("if","else","var","let","const","function","return",
                        "new","this","true","false","null","typeof","for","while"):
            types.add(name)
    return types


def make_unique_type(idea, existing):
    """生成不与已有类型冲突的唯一类型名"""
    base = "g" + hashlib.md5(idea.encode()).hexdigest()[:8]
    if base not in existing:
        return base
    # 冲突则加后缀
    for i in range(2, 100):
        candidate = f"{base}_{i}"
        if candidate not in existing:
            return candidate
    # 极端情况下用时间戳
    import time
    return f"g{int(time.time())}"

# 创意种子池——每天随机选一个方向
IDEA_POOL = [
    "经典街机游戏（如打砖块、弹球、太空射击）",
    "益智解谜游戏（如滑块拼图、华容道、数独变体）",
    "反应速度类游戏（点击测试、颜色判断、节奏游戏）",
    "记忆类游戏（翻牌配对、序列记忆、图案回忆）",
    "文字游戏（拼字、填词、猜单词）",
    "数学逻辑游戏（算术挑战、数字推理、方程式）",
    "休闲小游戏（钓鱼、种菜、养宠物模拟）",
    "策略对战（井字棋、四子棋、简易卡牌对战）",
    "物理模拟（弹射、碰撞、重力感应）",
    "音乐节奏类（按键节拍、简易音游）",
]


def get_today_idea(existing_types):
    """根据日期生成今日创意方向，并告知AI已有游戏避免重复"""
    today = date.today()
    random.seed(today.toordinal())
    category = random.choice(IDEA_POOL)
    twists = [
        "要有计分系统", "难度逐渐递增", "加入道具或技能",
        "限时挑战模式", "加入排行榜风格显示", "有combo连击奖励",
        "支持键盘和鼠标两种操作", "画面简洁但有趣",
    ]
    twist = random.choice(twists)

    # 列出已有游戏类型，让AI避免重复
    existing_list = sorted(existing_types)
    avoid_hint = f"注意：平台已有这些游戏类型名（{', '.join(existing_list)}），请确保新游戏的类型名不重复，游戏玩法也不要和已有游戏雷同。"

    return f"做一个{category}的游戏，{twist}。{avoid_hint}"


def build_prompt(idea):
    """构建提示词（包含用户的游戏设计偏好）"""
    return f"""你是一个游戏开发专家。请根据下面的创意生成一个完整的网页小游戏。

【游戏创意】{idea}

【输出要求】
返回严格的JSON格式：{{"title":"中英文游戏名","css":"CSS代码","js_init":"JS函数体"}}

【用户的游戏设计偏好——必须遵守】
1. 🎨 UI风格：纯白/极浅灰背景(#f8f9fc)，简洁现代，拒绝花哨。卡片白底+轻阴影+细边框(#e2e8f0)
2. 🔤 字体：'Segoe UI', system-ui, -apple-system，不用花哨字体
3. 🎯 游戏卡片：左侧56x56px圆角小缩略图，右侧游戏名+标签。用SVG做迷你预览图
4. 🚫 禁止：不要emoji图标、不要渐变背景、不要大图案装饰
5. 📐 布局：游戏在680px弹窗内运行，响应式适配手机
6. 🕹️ 交互：支持键盘操作优先，其次鼠标。要有🔄重来按钮
7. 🏆 反馈：胜利/失败有庆祝或提示动画，分数实时更新
8. 🐛 健壮：变量声明完整、事件正确绑定在container内、边界条件处理
9. 🔁 可重玩：每次点🔄都是全新随机对局
10. 🧹 代码干净：CSS类名加前缀防冲突，JS不用eval/外部依赖

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


def insert_game(html, type_name, title, css, js_init):
    """插入游戏到 platform.html"""
    # CSS
    html = html.replace("<!-- ANCHOR:CSS -->",
        f"\n/* ======== {title} ======== */\n{css}\n<!-- ANCHOR:CSS -->")

    # 卡片
    html = html.replace("<!-- ANCHOR:CARD -->",
        f"""  <div class="game-card" onclick="openGame('{type_name}')">
    <div class="thumb" style="background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;font-size:1.3rem;">🎲</div>
    <div class="info">
      <div class="name">{title}</div>
      <div class="tags">今日新游戏 &middot; AI生成</div>
    </div>
  </div>
<!-- ANCHOR:CARD -->""")

    # 标题
    html = html.replace("<!-- ANCHOR:TITLE -->",
        f"    {type_name}: '{title}',\n    <!-- ANCHOR:TITLE -->")

    # 调度
    html = html.replace("<!-- ANCHOR:DISPATCH -->",
        f"  else if (type === '{type_name}') init_{type_name}(content);\n  <!-- ANCHOR:DISPATCH -->")

    # JS
    html = html.replace("<!-- ANCHOR:JS -->",
        f"\n// ======== {title} ========\nfunction init_{type_name}(container) {{\n{js_init}\n}}\n\n<!-- ANCHOR:JS -->")

    return html


def main():
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        print("❌ 未设置 DEEPSEEK_API_KEY 环境变量")
        sys.exit(1)

    # 扫描已有游戏
    existing = get_existing_types()
    print(f"📋 已有 {len(existing)} 个游戏")

    # ========== 第一步：AI 制作游戏 ==========
    idea = get_today_idea(existing)
    print(f"\n🎨 第一步：AI 制作游戏")
    print(f"💡 创意: {idea}")

    result = call_api(api_key, idea)
    title = result["title"]
    css = result["css"]
    js_init = result["js_init"]

    type_name = make_unique_type(title + idea, existing)
    existing.add(type_name)
    print(f"✅ 生成: {title}（{type_name}）")

    # 插入并第一次提交
    html = PLATFORM_FILE.read_text(encoding="utf-8")
    html = insert_game(html, type_name, title, css, js_init)
    PLATFORM_FILE.write_text(html, encoding="utf-8")

    os.system(f'git add platform.html && git commit -m "🎨 新游戏: {title}" && git push')
    print("📦 第一次提交: 游戏创建完成")

    # ========== 第二步：AI 审查修复 ==========
    print(f"\n🔍 第二步：AI 审查并修复 bug")
    fixed_css, fixed_js, changes = review_and_fix(api_key, title, css, js_init)

    # 如果代码有变化，更新并第二次提交
    if changes and "无需修改" not in changes and "解析失败" not in changes and "跳过" not in changes:
        html = PLATFORM_FILE.read_text(encoding="utf-8")
        # 替换旧CSS和JS
        html = html.replace(css, fixed_css)
        html = html.replace(js_init, fixed_js)
        PLATFORM_FILE.write_text(html, encoding="utf-8")

        os.system(f'git add platform.html && git commit -m "🔧 审查修复: {changes[:50]}" && git push')
        print(f"📦 第二次提交: 修复完成 - {changes}")
    else:
        print("✅ 代码无需修复，跳过第二次提交")

    # 更新 TODAY.md
    today = date.today()
    (BASE_DIR / "TODAY.md").write_text(
        f"# 今日游戏: {title}\n\n> {idea}\n\n"
        f"类型名: `{type_name}`\n"
        f"审查结果: {changes}\n\n"
        f"打开 platform.html 即可游玩！\n", encoding="utf-8")

    os.system(f'git add TODAY.md && git commit -m "📋 更新今日记录" && git push')
    print(f"\n🎉 完成！今日游戏「{title}」已上线（含自检修复）")


if __name__ == "__main__":
    main()
