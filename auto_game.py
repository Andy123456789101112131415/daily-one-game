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
import requests
from datetime import date
from pathlib import Path

BASE_DIR = Path(__file__).parent
PLATFORM_FILE = BASE_DIR / "platform.html"
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
MODEL = "deepseek-chat"

# 已有的游戏类型
EXISTING_TYPES = {"maze", "sudoku", "wordsearch", "puzzle", "ascii", "memory"}

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


def get_today_idea():
    """根据日期生成今日创意方向"""
    today = date.today()
    import random
    random.seed(today.toordinal())
    category = random.choice(IDEA_POOL)
    # 加一点随机变化
    twists = [
        "要有计分系统",
        "难度逐渐递增",
        "加入道具或技能",
        "限时挑战模式",
        "加入排行榜风格显示",
        "有combo连击奖励",
        "支持键盘和鼠标两种操作",
        "画面简洁但有趣",
    ]
    twist = random.choice(twists)
    return f"做一个{category}的游戏，{twist}"


def build_prompt(idea):
    """构建提示词"""
    return f"""你是一个游戏开发专家。请根据下面的创意生成一个完整的网页小游戏。

【游戏创意】{idea}

【输出要求】
请返回严格的JSON格式，包含以下字段：

{{"title":"中英文游戏名","css":"CSS代码","js_init":"JS函数体"}}

【CSS规范】
- 白色/浅色主题
- 配色参考：#7c3aed(紫)#06b6d4(青)#10b981(绿)#f59e0b(金)#ef4444(红)
- 字体：'Segoe UI',system-ui
- 类名加前缀避免冲突

【JS规范】
- 游戏完全可玩，有输赢判定
- 有分数/状态显示和🔄新游戏按钮
- container是传入的DOM元素，渲染到container.innerHTML
- 事件绑定在container内
- 不依赖外部库

只返回JSON，不要额外解释。"""


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

    idea = get_today_idea()
    print(f"💡 今日创意: {idea}")

    result = call_api(api_key, idea)
    title = result["title"]
    css = result["css"]
    js_init = result["js_init"]

    print(f"✅ 生成成功: {title}")

    type_name = "g" + hashlib.md5(idea.encode()).hexdigest()[:8]

    html = PLATFORM_FILE.read_text(encoding="utf-8")
    html = insert_game(html, type_name, title, css, js_init)
    PLATFORM_FILE.write_text(html, encoding="utf-8")

    print(f"✅ 已插入 platform.html")

    # 写 TODAY.md
    today = date.today()
    (BASE_DIR / "TODAY.md").write_text(
        f"# 今日游戏: {title}\n\n> {idea}\n\n"
        f"打开 platform.html 即可游玩！\n", encoding="utf-8")

    print("✅ 完成！准备提交...")


if __name__ == "__main__":
    main()
