# 今日游戏: 数字拼图 2048

> 做一个有趣的网页小游戏

类型名: `gbfdcd24a_2`
审查: 1. 修复JS被截断导致的语法错误：补全 showOverlay 函数、hideOverlay、键盘处理、init 初始化与事件绑定，代码现在完整可运行。2. 修复胜利后无法继续的问题：原逻辑在 checkState 中 won 时直接 gameOver=true，导致胜利后立即锁死；现改为弹出胜利遮罩并提供“再来一局”，同时保留继续移动能力（gameOver 仅在无路可走时置位）。3. 修复动画定时器泄漏：新增 animTimer 变量，newGame 时清除未完成的 setTimeout，避免旧回调在新局中错误触发 checkState。4. 修复重来按钮缺失：在头部加入“重来”按钮，遮罩内加入“再来一局”按钮，均绑定 newGame，重置彻底（分数、棋盘、状态、遮罩、定时器全部重置）。5. 修复事件监听器重复绑定风险：init 只在 DOM 就绪后执行一次，键盘监听绑定在 document 上且只绑定一次。6. 修复 CSS 缺失：补充 g2048-v1024、g2048-v2048、g2048-vbig、g2048-pop、g2048-overlay、g2048-btn 等样式，避免高数值无样式和遮罩不可见。7. 修复布局问题：为 cell 增加 overflow:hidden 与 line-height，防止大数字溢出；overlay 使用 inset:0 与 flex 居中，保证在 board-wrap 内正确覆盖。8. 修复空值/边界：showOverlay 中对 title/sub 做 null 检查；init 中对 root 做存在性检查；valueClass 对 >2048 使用 vbig 类。9. 保持简洁白色主题：仅使用白底、浅灰边框与低饱和配色，无花哨元素。

打开 platform.html 即可游玩！
