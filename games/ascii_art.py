"""ASCII艺术生成器 - 生成有趣的ASCII图案"""

import random
from datetime import date

# ASCII 艺术模板库
ART_TEMPLATES = {
    "cat": r"""
      /\_/\
     ( o.o )
      > ^ <
    喵 ~ 今天也要加油哦！
    """,
    "dog": r"""
      / \__
     (    @\___
     /         O
    /   (_____/
   /_____/   U
    汪 ~ 又是美好的一天！
    """,
    "rabbit": r"""
      (\_/)
      ( •_•)
      / > 🥕
    小兔子爱吃胡萝卜~
    """,
    "owl": r"""
      ,___,
      [O.o]
      /)__)
      -"--"-
    夜猫子也要早睡早起！
    """,
    "heart": r"""
       ♥♥♥♥♥♥♥♥
      ♥         ♥
     ♥   LOVE   ♥
      ♥         ♥
       ♥♥♥♥♥♥♥♥
    用心写代码，用爱发电！
    """,
    "star": r"""
          *
         ***
        *****
       *******
        *****
         ***
          *
    你就是最亮的那颗星！
    """,
    "coffee": r"""
         ( (
          ) )
       ........
       |      |]
       \      /
        `----'
    喝完这杯咖啡，继续coding！
    """,
    "rocket": r"""
         /\
        /  \
       /    \
      /______\
      |      |
      |  🚀  |
      |      |
     /|  GO  |\
    /_|______|_\
    冲向星辰大海！
    """,
    "tree": r"""
        ^^^
       ^^^^^
      ^^^^^^^
     ^^^^^^^^^
        |||
        |||
    愿你的代码像树一样茁壮！
    """,
    "fish": r"""
     ><(((('>
     ><(((('>
     ><(((('>
    如鱼得水，代码流畅！
    """,
}


def generate_motivational_quote():
    """生成一句励志语录"""
    quotes = [
        "代码改变世界，你今天的一行代码也许就是明天的奇迹。",
        "每一个Bug都是成长的机会，不要害怕犯错。",
        "坚持每天进步1%，一年后你就是37.8倍的自己！",
        "优秀的程序员不是不犯错，而是懂得如何快速修复。",
        "写代码就像写诗，优雅的代码让人赏心悦目。",
        "今天比昨天多一点努力，明天就比今天多一点幸运。",
        "人生就像Git，每一步都算数，每一个commit都值得。",
        "与其仰望星空，不如自己成为那颗最亮的星。",
        "编程不是写代码，而是解决问题的一种思维方式。",
        "今天的汗水是明天成功的基石，加油！",
    ]
    return random.choice(quotes)


def generate():
    """生成今日ASCII艺术"""
    today = date.today()
    random.seed(today.toordinal())

    art_name = random.choice(list(ART_TEMPLATES.keys()))
    art = ART_TEMPLATES[art_name]
    quote = generate_motivational_quote()

    header = f"""
╔══════════════════════════════════╗
║    🎨  每 日 ASCII 艺 术  🎨    ║
║     {today.strftime('%Y年%m月%d日')}              ║
╚══════════════════════════════════╝
"""

    footer = f"""
{'─' * 36}
💪 今日寄语:
{quote}
{'─' * 36}
"""

    return header + art + footer


if __name__ == "__main__":
    print(generate())
