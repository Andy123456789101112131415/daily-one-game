# 今日游戏: 色彩记忆挑战 Color Memory

> 做一个有趣的网页小游戏

类型名: `g982619e3`
审查: 修复了JS代码中score变量未定义的问题（原代码在错误匹配分支中score = Math...被截断），补充了score扣分逻辑；修复了resetGame中未移除cm-celebrate类的问题；修复了header可能重复创建的问题；确保scoreDisplay正确添加到header中；添加了score扣分时的Math.max防止负分；修复了错误匹配时未更新score和message的问题；确保resetGame时清除message的庆祝动画类。

打开 platform.html 即可游玩！
