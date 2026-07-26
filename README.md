# 🎮 每日趣味小游戏 - GitHub活跃度神器

每天北京时间 **早上7:00** 自动生成一个趣味小游戏，并推送到GitHub仓库，让你的贡献图保持活跃！

## 🎲 游戏类型

每天随机从以下5种游戏中选一种：

| 游戏 | 说明 |
|------|------|
| 🌀 迷宫探险 | 随机生成的迷宫，从"入"走到"出" |
| 🔍 单词搜索 | 在汉字网格中找出隐藏的词语 |
| 🧩 趣味数独 | 经典数独谜题，带解答 |
| 🎯 数字谜题 | 数学规律题、24点、数字谜语 |
| 🎨 ASCII艺术 | 可爱的ASCII图案 + 每日励志语录 |

## 🚀 快速开始

### 1. 本地运行

```bash
# 生成今日游戏
python daily_game.py

# 生成所有类型游戏
python daily_game.py --all

# 生成指定类型
python daily_game.py --type maze
```

### 2. 推送到GitHub

```bash
git init
git add .
git commit -m "🎮 初始化每日小游戏项目"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 3. 启用GitHub Actions

推送后，GitHub Actions 会自动在每天北京时间7:00运行。你也可以在 Actions 页面手动触发。

## 📁 项目结构

```
日常/
├── .github/workflows/
│   └── daily.yml          # GitHub Actions 自动调度
├── games/
│   ├── __init__.py
│   ├── maze.py            # 迷宫生成器
│   ├── word_search.py     # 单词搜索生成器
│   ├── sudoku.py          # 数独生成器
│   ├── number_puzzle.py   # 数字谜题生成器
│   └── ascii_art.py       # ASCII艺术生成器
├── daily_game.py          # 主调度脚本
├── TODAY.md               # 今日游戏展示
├── output/                # 历史游戏存档
└── README.md
```

## ⚙️ 自定义

- 修改 `.github/workflows/daily.yml` 中的 `cron` 来调整运行时间
- 在 `games/` 目录下添加新的游戏生成器
- 在 `daily_game.py` 的 `GAME_GENERATORS` 中注册新游戏

## 🎯 为什么这样做？

- ✅ 每天都有commit，GitHub贡献图绿油油
- ✅ 每天动动脑，防止老年痴呆
- ✅ 学习编程的好方式
- ✅ 完全自动化，零维护成本

---

> 💪 **坚持每天进步1%，一年后你就是37.8倍的自己！**
