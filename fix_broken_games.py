import glob
import re

def fix_content(c):
    """修复损坏的 script.js 内容，返回 (fixed, ok)"""
    lines = c.split('\n')
    if len(lines) < 2:
        return c, False
    if not lines[1].lstrip().startswith('function('):
        return c, False  # 不是这个bug

    # 移除第一行 wrapper 和最后一行 wrapper close，得到原始 js_init
    raw = '\n'.join(lines[1:-1])
    # 去掉开头 function(container){ 
    raw = re.sub(r'^\s*function\s*\(container\)\s*\{', '', raw, count=1)
    # 去掉末尾一个 }
    raw = raw.rstrip()
    if raw.endswith('}'):
        raw = raw[:-1]
    body = raw.strip()

    name = re.match(r'function\s+(init_\w+)', lines[0]).group(1)
    fixed = f'function {name}(container) {{\n{body}\n}}'
    # 校验括号平衡
    o = fixed.count('{')
    cl = fixed.count('}')
    return fixed, (o == cl)

if __name__ == '__main__':
    import sys
    apply = '--apply' in sys.argv
    broken = []
    for f in sorted(glob.glob('games/*/script.js')):
        c = open(f, encoding='utf-8').read().strip()
        lines = c.split('\n')
        if len(lines) >= 2 and lines[1].lstrip().startswith('function('):
            broken.append(f)
            fixed, ok = fix_content(c)
            status = 'OK' if ok else 'STILL-BROKEN'
            print(f'{status:13s} {f}')
            if apply and ok:
                open(f, 'w', encoding='utf-8').write(fixed)
            elif apply and not ok:
                print(f'   !! 跳过（修复后括号仍不平衡）')
    print(f'\n共 {len(broken)} 个损坏文件', '(已修复)' if apply else '(干跑，未修改)')
