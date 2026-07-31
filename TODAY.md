# 今日游戏: 扫雷 / Minesweeper

> 做一个扫雷游戏，点击格子揭示数字，标记地雷

类型名: `g72251d0e`
审查: 1. 修复了placeMines函数中board[y][x] = -1后缺少闭合大括号的问题。
2. 补全了缺失的handleClick、handleRightClick、revealCell、revealAll、checkWin、getCell、updateStatus函数定义。
3. 修复了revealCell中递归调用时未跳过自身导致无限递归的问题。
4. 修复了checkWin中胜利后标记所有地雷的逻辑。
5. 添加了getCell辅助函数以正确获取单元格元素。
6. 修复了updateStatus中更新剩余雷数的计算。
7. 确保init函数在最后调用以启动游戏。

打开 platform.html 即可游玩！
