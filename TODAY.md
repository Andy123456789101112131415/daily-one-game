# 今日游戏: 数字华容道 2048 Slide

> 做一个有趣的网页小游戏

类型名: `g80c06596`
审查: 1. 修复CSS被截断问题：补全 .g2048-over 的 z-index 与显示逻辑，新增 .g2048-over.g2048-show{display:flex}，默认 display:none，避免遮罩层常驻；补全 .g2048-over h2/p 与 .g2048-hint 样式，保证白色简洁主题。2. 修复JS被截断问题：补全 onTouchEnd 剩余逻辑（滑动阈值判断、方向判定、调用 move），补全 reset/addRandom/layout/render/move/canMove 等核心函数。3. 修复游戏逻辑：move 中实现正确的滑动+合并（每格每回合仅合并一次，用 mergedFlags 防止重复合并），分数累加合并值并更新 SCORE；合并后移除被合并方块 DOM 与 tiles 数组项，避免残留。4. 修复胜利/失败判定：达到 2048 设置 won，无可行移动时显示遮罩并区分 You Win / Game Over。5. 修复重置不彻底：reset 清空 board/tiles/score/over/won/tileId，清空 tilesEl.innerHTML，隐藏遮罩，重新生成两个初始方块。6. 修复布局：layout 基于 boardEl.clientWidth 计算 cellSize，处理宽度为 0 的边界情况，resize 时重新布局，避免溢出/重叠。7. 修复事件绑定：键盘、触摸、按钮均正确绑定；触摸使用 passive 监听并做阈值判断，防止误触。8. 修复边界条件：addRandom 空数组保护、layout 宽度<=0 保护、render 中 el 空引用保护、move 中坐标越界检查。

打开 platform.html 即可游玩！
