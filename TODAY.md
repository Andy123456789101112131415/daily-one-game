# 今日游戏: 数字迷宫 Number Maze

> 做一个有趣的网页小游戏

类型名: `gdde7cd56_3`
审查: 1. 修复变量/作用域：原代码在 render 中使用了未定义的 nextNum 逻辑且截断，补齐完整 render；新增 posOf 辅助函数。2. 事件绑定：为重新开始与提示按钮绑定监听；键盘监听改为在 document 上并做边界判断，避免越界。3. 游戏逻辑：修正 cur 初始值为 -1，正确判断起点 1、相邻性、重复点击、错误数字；到达 25 时停止计时并显示胜利；步数在每次成功连接时更新。4. 边界条件：adjacent 增加越界检查；posOf 返回 -1 时安全处理；flashBad 检查元素存在。5. 重置彻底：newGame 清除旧计时器、重置 path/steps/cur/playing 并重新渲染。6. CSS 补全被截断的 .nm-msg.nm-win 等样式，新增 .nm-msg.nm-bad、.nm-foot、.nm-btn、.nm-help，保持白色简洁主题，无花哨元素。7. 键盘交互：方向键移动光标并仅在目标为正确下一数字时确认，空格/回车确认下一步。

打开 platform.html 即可游玩！
