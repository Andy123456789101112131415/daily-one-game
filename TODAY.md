# 今日游戏: 数字连线连线 Number Connect

> 做一个有趣的网页小游戏

类型名: `ga523daca`
审查: 1. CSS被截断（.nc-btn:active 后缺失），补全并移除未使用的 .nc-path/.nc-start/.nc-next/.nc-hint 类；补充 .nc-message 样式、nc-shake 关键帧、nc-primary 按钮样式及移动端媒体查询。2. JS 中 winGame 先读取 score 再更新导致显示分数不含奖励，改为先累加 bonus 再显示。3. startTimer 未先清除旧定时器，重置时可能产生多个计时器，已加 clearInterval。4. timeLeft 可能变为负数，增加下限 0 保护。5. 多处 querySelector 结果未判空（board、cell、msg、stats），增加 null 检查防止引用错误。6. 重置时 timer 置 null，避免残留句柄。7. 事件监听器随 renderBoard 重建 DOM 自动释放，无泄漏；重来按钮仅绑定一次。8. 保持简洁白色主题，仅保留紫色主色按钮。

打开 platform.html 即可游玩！
