# 今日游戏: 数字迷宫 Number Maze

> 做一个有趣的网页小游戏

类型名: `gdde7cd56_2`
审查: 1. 修复CSS中 .nm-msg 的拼写错误 'align-item' -> 'align-items'，并补全 justify-content 与各状态配色类（nm-info/nm-win/nm-lose），避免消息样式缺失。
2. 补全被截断的CSS，新增 .nm-overlay 覆盖层样式，保证胜利/失败弹层正常显示且不溢出。
3. 修复 genLevel 中 targetVal 逻辑混乱：原代码先取随机格值再覆盖为1/2，导致 targetVal 可能为1、出现无法胜利或起始值错误；现统一将起点设为2、targetVal=2，并保证相邻格为1，逻辑自洽。
4. 修复胜利判定：原 targetVal===size*size 在起点被强制改为2后仍可达成，但原逻辑存在 targetVal 被错误重置的问题，现已修正。
5. 修复失败判定漏洞：原代码仅在“错误移动”分支检查步数，正确移动和回退移动不会触发失败；现所有移动分支均检查 steps>=maxSteps 并调用 lose()。
6. 修复事件监听器内存泄漏：render 每次重建 DOM 并绑定新监听器，旧节点被 innerHTML 清空后监听器随节点回收，但为避免重复绑定，改为在创建时绑定并随节点销毁；同时 overlay 按钮使用独立监听器并在重建前移除旧 overlay。
7. 新增缺失的 🔄 重来按钮：在 overlay 中提供重来按钮，并在 header 预留 nm-reset 按钮绑定 resetGame，重置分数、关卡与状态。
8. 新增 showOverlay 函数（原代码调用但未定义，导致胜利/失败时抛错），并确保重复调用时先移除旧 overlay。
9. 新增 init 初始化函数并处理 DOMContentLoaded，正确获取 DOM 引用，避免 gridEl 为 null 时 render 直接返回导致空白。
10. 增加边界检查：tryMove 中校验 r/c 范围，防止数组越界；getNeighbors 在 size=1 时返回空数组，rnd(0) 会返回 0 导致 undefined，现由 size 最小为4保证安全。
11. 修复 updateMsg 的 className 拼接，cls 为空时不会产生多余空格类名。
12. 统一白色简洁主题，移除花哨元素，仅保留必要状态色。

打开 platform.html 即可游玩！
