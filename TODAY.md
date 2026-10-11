# 今日游戏: 数字华容道 Number Slide

> 做一个有趣的网页小游戏

类型名: `gd07d6fd5_3`
审查: 1) shuffle() 初始化错误：原代码 board 填 0..total-1 且 empty=total-1，导致 isSolved 判断与 tile 值错位、空格值不统一；改为填入 1..total，空格值为 total。2) shuffle 死循环风险：cand 为空时 do-while 会无限循环，增加 cand.length===0 的 break 保护。3) 事件绑定缺失：原代码 wrap=do 截断，未绑定点击/键盘/重置按钮；新增 init() 完成 DOM 查询、点击委托、键盘监听与 reset 调用，并处理 DOMContentLoaded。4) 重置不彻底：reset 未清除旧计时器与完成遮罩，已加入 clearInterval 与 .ns-done 移除。5) 键盘方向逻辑：保持与空格相对方向一致（上键把下方块上移），并 preventDefault 防止页面滚动。6) CSS 补全被截断的 .ns-hint 规则，保持简洁白色主题，无花哨元素。7) 边界条件：点击解析 dataset.pos 校验 NaN，closest 判空，避免 null 引用与数组越界。

打开 platform.html 即可游玩！
