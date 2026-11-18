# 今日游戏: 数字华容道 Number Slide

> 做一个有趣的网页小游戏

类型名: `gd07d6fd5_9`
审查: 1. 修复 shuffleBoard 可能生成无解局面：新增 isSolvable 逆序数校验，循环直到生成可解且非已完成的盘面。2. 修复 emptyPos 计算错误：原代码假设空格在最后位置，现改为按 board.indexOf(0) 计算。3. 补全被截断的 renderBoard/handleCellClick 等逻辑，点击相邻格交换并更新步数。4. 计时器改为首次移动后启动，重置时彻底清零并停止。5. 胜利判定后停止计时并显示遮罩，重来/再来一局均调用 resetGame 完整重置。6. 新增键盘方向键支持（方向表示空格移动方向），并做边界检查防止越界。7. 使用 MutationObserver 在组件被移除时清理定时器与键盘监听，避免内存泄漏。8. CSS 补全被截断的 .ns-win-content 样式，给 .ns-board 和 .ns-cell 加 box-sizing 防止溢出，保持简洁白色主题。

打开 platform.html 即可游玩！
