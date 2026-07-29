#!/usr/bin/env python3
"""
🏗 平台构建器 - 扫描 games/ 目录，拼出 platform.html
每个游戏文件夹包含: card.html, style.css(可选), script.js
"""

import re
from pathlib import Path

BASE = Path(__file__).parent
GAMES_DIR = BASE / "games"
OUTPUT = BASE / "platform.html"

# 内置游戏的函数名映射（因为它们的init函数名不规范）
FUNC_MAP = {
    "maze": "initMaze",
    "sudoku": "initSudoku",
    "wordsearch": "initWordSearch",
    "puzzle": "initPuzzle",
    "ascii": "initAscii",
    "memory": "initMemory",
}

BASE_HTML = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>每日趣味小游戏</title>
<style>
/* ========== 全局样式 ========== */
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg: #f8f9fc; --card-bg: #ffffff; --card-hover: #f0f2ff;
  --accent: #7c3aed; --accent2: #06b6d4; --text: #1e293b;
  --text-dim: #64748b; --gold: #f59e0b; --green: #10b981;
  --red: #ef4444; --border: #e2e8f0;
  --shadow: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-hover: 0 8px 30px rgba(124,58,237,0.12);
}
body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
.header { text-align: center; padding: 36px 20px 16px; }
.header h1 { font-size: 2rem; color: var(--text); margin-bottom: 6px; }
.header .subtitle { color: var(--text-dim); font-size: 0.95rem; }
.games-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; padding: 16px 32px 48px; max-width: 1050px; margin: 0 auto; }
.game-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow); display: flex; align-items: center; gap: 14px; }
.game-card:hover { transform: translateY(-2px); border-color: var(--accent); box-shadow: var(--shadow-hover); }
.game-card .thumb { width: 56px; height: 56px; border-radius: 6px; flex-shrink: 0; border: 1px solid #e2e8f0; overflow: hidden; position: relative; background: #f8fafc; }
.thumb svg { width: 100%; height: 100%; display: block; }
.game-card .info { flex: 1; min-width: 0; }
.game-card .name { font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; color: var(--text); }
.game-card .tags { font-size: 0.72rem; color: var(--text-dim); line-height: 1.4; }
.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 100; backdrop-filter: blur(3px); }
.overlay.active { display: flex; align-items: center; justify-content: center; }
.game-panel { background: #fff; border: 1px solid var(--border); border-radius: 18px; width: 92vw; max-width: 680px; max-height: 88vh; overflow-y: auto; padding: 28px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.15); animation: slideUp 0.3s ease; }
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.panel-header h2 { font-size: 1.4rem; display: flex; align-items: center; gap: 8px; color: var(--text); }
.close-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: #fff; color: var(--text-dim); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.close-btn:hover { background: var(--red); border-color: var(--red); color: #fff; }
.maze-win { text-align: center; padding: 16px; color: var(--accent); font-size: 1.2rem; font-weight: 700; animation: bounceIn 0.5s ease; }
@keyframes bounceIn { 0%{transform:scale(0)} 60%{transform:scale(1.12)} 100%{transform:scale(1)} }
.btn { padding: 8px 18px; border-radius: 8px; border: 1px solid var(--border); background: #fff; color: var(--text); cursor: pointer; font-size: 0.88rem; transition: all 0.15s; font-weight: 500; }
.btn:hover { border-color: var(--accent); background: #f3eeff; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn.primary:hover { background: #6d28d9; }
@media (max-width: 600px) { .games-grid { padding: 12px; gap: 10px; grid-template-columns: 1fr 1fr; } .game-card { padding: 12px; gap: 10px; } .game-panel { padding: 18px; width: 96vw; } }

/* ========== 游戏CSS ========== */
<!-- GAME_CSS -->
</style>
</head>
<body>
<div class="header"><h1>每日趣味小游戏</h1><p class="subtitle">选择一个游戏开始玩吧！每天都有新挑战~</p></div>
<div class="games-grid">
<!-- GAME_CARDS -->
</div>
<div class="overlay" id="overlay" onclick="closeGame(event)">
<div class="game-panel" id="gamePanel" onclick="event.stopPropagation()">
<div class="panel-header"><h2 id="panelTitle"></h2><button class="close-btn" onclick="closeGame()">✕</button></div>
<div id="panelContent"></div>
</div>
</div>
<script>
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
function openGame(type) {
  $('#overlay').classList.add('active');
  var titles = {/* GAME_TITLES */};
  $('#panelTitle').textContent = titles[type] || type;
  var content = $('#panelContent');
  content.innerHTML = '';
  /* GAME_DISPATCH */
}
function closeGame(e) { if (e && e.target !== $('#overlay')) return; $('#overlay').classList.remove('active'); }
/* GAME_SCRIPTS */
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGame(); });
</script>
</body>
</html>"""


def build():
    if not GAMES_DIR.exists():
        print("❌ games/ 目录不存在")
        return

    game_dirs = sorted([d for d in GAMES_DIR.iterdir() if d.is_dir()])
    css_all, cards_all, titles, dispatch, scripts = [], [], [], [], []

    for gd in game_dirs:
        name = gd.name
        card_file = gd / "card.html"
        css_file = gd / "style.css"
        js_file = gd / "script.js"

        if not card_file.exists() or not js_file.exists():
            print(f"⚠️ 跳过 {name}: 缺少文件")
            continue

        # CSS
        if css_file.exists():
            css_all.append(f"/* === {name} === */\n{css_file.read_text(encoding='utf-8')}")

        # Card HTML
        cards_all.append(card_file.read_text(encoding='utf-8').strip())

        # JS
        js_code = js_file.read_text(encoding='utf-8')
        scripts.append(f"// === {name} ===\n{js_code}")

        # 提取标题
        card_html = card_file.read_text(encoding='utf-8')
        title_match = re.search(r'class="name">([^<]+)<', card_html)
        game_title = title_match.group(1) if title_match else name

        titles.append(f"{name}: '{game_title}'")

        # 调度：内置游戏用映射的函数名，AI游戏用 init_{name}
        func = FUNC_MAP.get(name, f"init_{name}")
        dispatch.append(f"else if (type === '{name}') {func}(content);")

    html = BASE_HTML
    html = html.replace("<!-- GAME_CSS -->", "\n".join(css_all))
    html = html.replace("<!-- GAME_CARDS -->", "\n".join(cards_all))
    html = html.replace("/* GAME_TITLES */", ",\n    ".join(titles))
    html = html.replace("/* GAME_DISPATCH */", "if (false) {}\n  " + "\n  ".join(dispatch))
    html = html.replace("/* GAME_SCRIPTS */", "\n".join(scripts))

    OUTPUT.write_text(html, encoding='utf-8')
    print(f"✅ 构建完成: {len(game_dirs)} 个游戏 → {OUTPUT}")


if __name__ == "__main__":
    build()
