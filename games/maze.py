"""迷宫生成器 - 使用递归回溯算法生成随机迷宫"""

import random
from datetime import date


def generate_maze(width=21, height=21):
    """生成一个随机迷宫，返回字符串列表"""
    # 确保宽高为奇数
    if width % 2 == 0:
        width += 1
    if height % 2 == 0:
        height += 1

    # 初始化全是墙
    maze = [["█"] * width for _ in range(height)]

    # 递归回溯生成迷宫
    def carve(x, y):
        maze[y][x] = " "
        directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]
        random.shuffle(directions)

        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 < nx < width - 1 and 0 < ny < height - 1 and maze[ny][nx] == "█":
                maze[y + dy // 2][x + dx // 2] = " "
                carve(nx, ny)

    # 从 (1,1) 开始挖掘
    carve(1, 1)

    # 设置入口和出口
    maze[1][0] = "入"
    maze[height - 2][width - 1] = "出"

    return ["".join(row) for row in maze]


def generate():
    """生成今日迷宫"""
    today = date.today()
    random.seed(today.toordinal())

    w = random.choice([21, 25, 31, 35])
    h = random.choice([15, 17, 21, 23])

    maze = generate_maze(w, h)

    header = f"""
╔══════════════════════════════════╗
║       🌀  每 日 迷 宫  🌀        ║
║     {today.strftime('%Y年%m月%d日')}              ║
║   从 "入" 走到 "出" 试试看！     ║
╚══════════════════════════════════╝
"""
    return header + "\n" + "\n".join(maze)


if __name__ == "__main__":
    print(generate())
