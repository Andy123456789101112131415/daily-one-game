# 今日游戏: 数字华容道 Number Slide

> 做一个有趣的网页小游戏

类型名: `gd07d6fd5_11`
审查: 1) 修复 initBoard 中 emptyPos 未初始化导致 getNeighbors 读取 undefined 的崩溃，并在洗牌后检测已解状态递归重洗；2) isSolved 增加空格位置校验；3) 补全被截断的 setupUI 函数，正确获取 DOM 元素并绑定重来按钮与键盘方向键；4) 键盘事件按方向映射到空格相邻方块，避免无效点击；5) 修复 CSS 中 ns-btn 的 cursor:point 拼写错误为 pointer，补全被截断的样式；6) 添加 ns-shake 动画定义，使无效点击反馈生效；7) 添加 ns-win 遮罩样式与 ns-show 显示类，确保胜利界面可见；8) 网格增加 width:100% 与 box-sizing 防止溢出，header 支持换行，tile 加 min-width/min-height 防止布局断裂；9) 重置时先停止计时器再启动，避免重复 interval 泄漏；10) 保持白色简洁主题，无花哨元素。

打开 platform.html 即可游玩！
