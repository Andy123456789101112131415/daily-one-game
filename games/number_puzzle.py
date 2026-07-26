"""数字谜题生成器 - 生成各种数字趣味题"""

import random
from datetime import date


def generate_math_riddle():
    """生成趣味数学谜题"""
    today = date.today()
    random.seed(today.toordinal())

    riddles = []

    # 类型1: 找规律
    seq_types = [
        # (前几项, 描述, 答案)
        ([1, 1, 2, 3, 5], "斐波那契数列", 8),
        ([2, 4, 8, 16], "每次乘以2", 32),
        ([1, 4, 9, 16], "平方数", 25),
        ([2, 3, 5, 7, 11], "质数", 13),
        ([3, 6, 12, 24], "每次乘以2", 48),
        ([1, 2, 6, 24, 120], "阶乘", 720),
    ]

    seq = random.choice(seq_types)
    riddles.append({
        "title": "🔢 找规律填空",
        "question": f"数列: {', '.join(map(str, seq[0]))}, ?\n下一个数字是什么？",
        "hint": f"提示: {seq[1]}",
        "answer": str(seq[2]),
    })

    # 类型2: 24点
    def make_24():
        cards = random.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4)
        return {
            "title": "🃏 24点游戏",
            "question": f"用 {', '.join(map(str, cards))} 这四个数字，\n通过加减乘除运算得到 24。\n每个数字必须用且只能用一次。",
            "hint": "试试不同的组合吧！",
            "answer": "有多种解法，试试看！",
        }

    if random.random() > 0.5:
        riddles.append(make_24())

    # 类型3: 数字谜语
    number_riddles = [
        {
            "title": "💡 数字谜语",
            "question": "什么东西越洗越脏？\n（猜一个数字相关的事物）",
            "hint": "每天都用到的东西...",
            "answer": "水（水越洗越脏，而水=H₂O=水分子）",
        },
        {
            "title": "💡 数字谜语",
            "question": "1=5, 2=10, 3=15, 4=20, 5=?",
            "hint": "注意看第一个等式...",
            "answer": "1（因为1=5，所以5=1）",
        },
        {
            "title": "💡 数字谜语",
            "question": "我有城市却没有房屋，\n我有森林却没有树木，\n我有河流却没有水。\n我是什么？",
            "hint": "你每天都在看我...",
            "answer": "地图",
        },
    ]
    riddles.append(random.choice(number_riddles))

    return riddles


def generate():
    """生成今日数字谜题"""
    today = date.today()

    header = f"""
╔══════════════════════════════════╗
║     🎯  每 日 数 字 谜 题  🎯    ║
║     {today.strftime('%Y年%m月%d日')}              ║
║   动动脑筋，看看你能答对几题？   ║
╚══════════════════════════════════╝
"""

    riddles = generate_math_riddle()
    result = header + "\n"
    for i, r in enumerate(riddles, 1):
        result += f"""
{'─' * 36}
题目 {i}: {r['title']}
{'─' * 36}
{r['question']}

💬 提示: {r['hint']}

✅ 答案: {r['answer']}
"""
    return result


if __name__ == "__main__":
    print(generate())
