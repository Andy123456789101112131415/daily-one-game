# 今日游戏: 圈地大作战 / Territory

> 做一个有趣的网页小游戏

类型名: `g20999852`
审查: 1. 修复JS被截断：补全 tcPlaceStone 的回合切换、tcUpdateScores、tcCheckWin、tcShowResult 及事件绑定与初始化。2. 修复变量/作用域：所有函数与常量完整定义，tcContainer 使用传入的 container。3. 事件绑定：在 tcBoardEl 上使用事件委托绑定一次点击，重来按钮绑定 tcInit，避免重复绑定与内存泄漏。4. 游戏逻辑：实现四子连线判胜、棋盘填满判和、实时分数统计与显示、回合指示更新。5. 边界条件：点击解析加 isNaN 与越界检查，落子前再次校验坐标与占用，防止数组越界和重复落子。6. CSS：补全被截断的 .primary:hover，新增 .tc-turn-indicator/.tc-turn-dot/.tc-message 样式与移动端媒体查询，board-wrap 加 overflow:auto 防溢出，cell 加 box-sizing 防边框撑破。7. UI：保持简洁白色主题，仅保留必要配色与重来按钮。

打开 platform.html 即可游玩！
