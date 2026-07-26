"""单词搜索生成器 - 生成中文词语搜索谜题"""

import random
from datetime import date

# 有趣的词语库
WORDS = [
    "程序员", "算法", "代码", "开源", "黑客",
    "人工智能", "机器学习", "深度学习", "神经网络",
    "数据", "结构", "编译", "调试", "部署",
    "Python", "Java", "前端", "后端", "全栈",
    "快乐", "自由", "梦想", "坚持", "努力",
    "每天进步", "学无止境", "天道酬勤",
]


def generate_grid(size=12):
    """生成单词搜索网格"""
    today = date.today()
    random.seed(today.toordinal())

    # 随机选 5-8 个词
    num_words = random.randint(5, 8)
    selected = random.sample(WORDS, min(num_words, len(WORDS)))

    # 初始化网格
    grid = [["　"] * size for _ in range(size)]

    # 放置单词
    directions = [(1, 0), (0, 1), (1, 1), (-1, 1), (1, -1), (-1, 0), (0, -1), (-1, -1)]

    placed_words = []
    for word in selected:
        placed = False
        for _ in range(50):  # 尝试50次
            direction = random.choice(directions)
            if len(word) > size:
                continue
            max_x = size - 1 - (len(word) - 1) * max(0, direction[0])
            min_x = (len(word) - 1) * max(0, -direction[0])
            max_y = size - 1 - (len(word) - 1) * max(0, direction[1])
            min_y = (len(word) - 1) * max(0, -direction[1])

            if min_x > max_x or min_y > max_y:
                continue

            x = random.randint(min_x, max_x)
            y = random.randint(min_y, max_y)

            # 检查是否重叠冲突
            conflict = False
            for i, ch in enumerate(word):
                cx, cy = x + i * direction[0], y + i * direction[1]
                if grid[cy][cx] != "　" and grid[cy][cx] != ch:
                    conflict = True
                    break

            if not conflict:
                for i, ch in enumerate(word):
                    cx, cy = x + i * direction[0], y + i * direction[1]
                    grid[cy][cx] = ch
                placed_words.append(word)
                placed = True
                break

    # 填充随机汉字
    random_chars = "日月星天地山水风云龙虎雀鹿鹤鸿鹏程万里心想事成吉如意安康乐美善真"
    for y in range(size):
        for x in range(size):
            if grid[y][x] == "　":
                grid[y][x] = random.choice(random_chars)

    header = f"""
╔══════════════════════════════════╗
║     🔍  每 日 单 词 搜 索  🔍    ║
║     {today.strftime('%Y年%m月%d日')}              ║
║   在网格中找到以下词语：         ║
╚══════════════════════════════════╝
"""

    word_list = "  ▪  ".join(placed_words)
    grid_str = "\n".join(["".join(row) for row in grid])

    return header + f"\n🔎 需要找到: {word_list}\n\n" + grid_str + "\n"


if __name__ == "__main__":
    print(generate_grid())
