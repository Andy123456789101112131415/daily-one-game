# 今日游戏: 数字迷宫 Number Maze

> 做一个有趣的网页小游戏

类型名: `gdde7cd56_4`
审查: 1. 修复了 render() 中大量无意义/未定义变量的死代码（原代码有数十行 for 循环声明 null 变量，且存在 cells[path[i]?'':''] 这种语法错误与越界访问），重写为安全的渲染逻辑。2. 修复 onClick 未定义的问题：原代码绑定了 onClick 但从未定义该函数，导致点击无响应；现补全点击处理逻辑（顺序校验、步数/分数更新、胜利判定、错误抖动反馈）。3. 修复胜利逻辑：原代码 done 分支被截断且未更新分数/最佳分，现补全并计算得分。4. 修复 newGame 中未重置 bestEl 显示及未清理状态的问题，render 中统一刷新最佳分。5. 修复事件监听器：build 每次重建 board 会重复绑定 click（内存泄漏），改为在 build 中只绑定一次；重置按钮通过 .nm-reset/.nm-new 绑定，并支持键盘 R 键重开。6. 增加空值防护（board/msg/toast/cells 越界、parseInt NaN、path 越界）避免 null 引用与数组越界。7. 补全被截断的 CSS（.nm-cell 的 transition 未闭合），并补充 .nm-start/.nm-goal/.nm-path/.nm-cur/.nm-done/.nm-wrong、.nm-msg、.nm-toast 等缺失样式，保持简洁白色主题。8. 增加移动端响应式（420px 下头部换行）与 toast 提示，避免布局溢出。9. 修复 genPath 的 guard 死循环保护与长度边界，确保 size≥1、TARGET 合法。

打开 platform.html 即可游玩！
