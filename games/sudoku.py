"""数独生成器 - 生成可解的数独谜题"""

import random
from datetime import date


def generate_full_board():
    """生成完整的数独解答"""
    board = [[0] * 9 for _ in range(9)]

    def is_valid(board, row, col, num):
        # 检查行
        for x in range(9):
            if board[row][x] == num:
                return False
        # 检查列
        for x in range(9):
            if board[x][col] == num:
                return False
        # 检查 3x3 宫
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(3):
            for j in range(3):
                if board[start_row + i][start_col + j] == num:
                    return False
        return True

    def solve():
        for row in range(9):
            for col in range(9):
                if board[row][col] == 0:
                    nums = list(range(1, 10))
                    random.shuffle(nums)
                    for num in nums:
                        if is_valid(board, row, col, num):
                            board[row][col] = num
                            if solve():
                                return True
                            board[row][col] = 0
                    return False
        return True

    solve()
    return board


def generate_puzzle(difficulty=40):
    """从完整解答中挖空生成谜题"""
    full = generate_full_board()
    puzzle = [row[:] for row in full]

    positions = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(positions)

    # 挖空指定数量的格子
    for i in range(difficulty):
        r, c = positions[i]
        puzzle[r][c] = 0

    return puzzle, full


def format_sudoku(board, solution=None):
    """格式化数独输出"""
    lines = []
    for i, row in enumerate(board):
        if i % 3 == 0 and i > 0:
            lines.append("───┼───┼───┼───┼───┼───┼───┼───┼───")

        line_chars = []
        for j, val in enumerate(row):
            if j % 3 == 0 and j > 0:
                line_chars.append("│")

            if val == 0:
                line_chars.append(" · ")
            else:
                line_chars.append(f" {val} ")
        lines.append("".join(line_chars))

    return "\n".join(lines)


def generate():
    """生成今日数独"""
    today = date.today()
    random.seed(today.toordinal())

    puzzle, solution = generate_puzzle(difficulty=random.randint(35, 50))

    header = f"""
╔══════════════════════════════════╗
║        🧩  每 日 数 独  🧩       ║
║     {today.strftime('%Y年%m月%d日')}              ║
║   把 · 替换成 1-9 的数字，       ║
║   每行每列每宫都不能重复！       ║
╚══════════════════════════════════╝
"""

    return header + "\n" + format_sudoku(puzzle)


if __name__ == "__main__":
    print(generate())
