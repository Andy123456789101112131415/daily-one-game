#!/usr/bin/env python3
"""
🎮 每日趣味小游戏生成器
每天自动生成一个随机小游戏，让你的GitHub活跃度爆表！

使用方法:
    python daily_game.py           # 生成今日游戏
    python daily_game.py --all     # 生成所有类型游戏
    python daily_game.py --type maze  # 生成指定类型
"""

import random
import os
import sys
from datetime import date, datetime

from games.maze import generate as gen_maze
from games.word_search import generate_grid as gen_word_search
from games.sudoku import generate as gen_sudoku
from games.number_puzzle import generate as gen_number_puzzle
from games.ascii_art import generate as gen_ascii_art


# 所有可用的游戏生成器
GAME_GENERATORS = {
    "maze": ("🌀 迷宫探险", gen_maze),
    "word_search": ("🔍 单词搜索", gen_word_search),
    "sudoku": ("🧩 趣味数独", gen_sudoku),
    "number_puzzle": ("🎯 数字谜题", gen_number_puzzle),
    "ascii_art": ("🎨 ASCII艺术", gen_ascii_art),
}


def get_today_game_type():
    """根据日期确定性随机选择今天的游戏类型"""
    today = date.today()
    random.seed(today.toordinal())
    return random.choice(list(GAME_GENERATORS.keys()))


def generate_game(game_type=None):
    """生成游戏并返回内容"""
    if game_type is None:
        game_type = get_today_game_type()

    if game_type not in GAME_GENERATORS:
        print(f"❌ 未知的游戏类型: {game_type}")
        print(f"可用类型: {', '.join(GAME_GENERATORS.keys())}")
        sys.exit(1)

    name, generator = GAME_GENERATORS[game_type]
    today = date.today()

    print(f"🎲 今日游戏类型: {name}")
    print(f"📅 日期: {today.strftime('%Y年%m月%d日')}")
    print()

    content = generator()

    # 保存到文件
    filename = f"output/{today.strftime('%Y%m%d')}_{game_type}.txt"
    os.makedirs("output", exist_ok=True)
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

    # 同时保存到 README.md（作为当日展示）
    with open("TODAY.md", "w", encoding="utf-8") as f:
        f.write(content)

    print(content)
    print(f"\n✅ 游戏已保存到: {filename}")
    print(f"✅ 今日游戏已更新到: TODAY.md")

    return content


def generate_all():
    """生成所有类型的游戏"""
    today = date.today()
    os.makedirs("output", exist_ok=True)

    for game_type, (name, generator) in GAME_GENERATORS.items():
        print(f"🎲 正在生成: {name}...")
        content = generator()
        filename = f"output/{today.strftime('%Y%m%d')}_{game_type}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✅ 已保存: {filename}")

    print("\n🎉 所有游戏生成完毕！")


def main():
    today = date.today()

    if "--all" in sys.argv:
        generate_all()
    elif "--type" in sys.argv:
        idx = sys.argv.index("--type")
        if idx + 1 < len(sys.argv):
            generate_game(sys.argv[idx + 1])
        else:
            print("❌ 请指定游戏类型，例如: python daily_game.py --type maze")
            sys.exit(1)
    else:
        generate_game()


if __name__ == "__main__":
    main()
