function init_g6a027f85_9(container) {
// 状态变量
  let score = 0;
  let targetColor = '';
  let colors = [];
  let isProcessing = false;

  // 生成随机颜色（RGB）
  function randomColor() {
    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 计算颜色差异（简单欧氏距离）
  function colorDistance(c1, c2) {
    const parse = c => c.match(/\d+/g).map(Number);
    const [r1,g1,b1] = parse(c1);
    const [r2,g2,b2] = parse(c2);
    return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
  }

  // 生成新回合
  function newRound() {
    // 生成目标颜色和三个干扰颜色
    targetColor = randomColor();
    colors = [targetColor];
    while(colors.length < 4) {
      const c = randomColor();
      if (colorDistance(c, targetColor) > 50) { // 确保差异明显
        colors.push(c);
      }
    }
    // 打乱顺序
    colors.sort(() => Math.random() - 0.5);

    // 更新UI
    const targetDiv = container.querySelector('.cm-target-color');
    targetDiv.style.backgroundColor = targetColor;

    const optionBtns = container.querySelectorAll('.cm-option');
    optionBtns.forEach((btn, i) => {
      btn.style.backgroundColor = colors[i];
      btn.disabled = false;
    });

    container.querySelector('.cm-message').textContent = '';
  }

  // 处理选择
  function handleSelect(e) {
    if (isProcessing) return;
    const selectedColor = e.target.style.backgroundColor;
    const selectedBtn = e.target;

    if (selectedColor === targetColor) {
      // 正确
      score++;
      container.querySelector('.cm-score').textContent = '得分: ' + score;
      container.querySelector('.cm-message').textContent = '✅ 正确！';
      selectedBtn.classList.add('cm-celebrate');
      setTimeout(() => selectedBtn.classList.remove('cm-celebrate'), 500);
      // 禁用所有选项短暂延迟后新回合
      container.querySelectorAll('.cm-option').forEach(btn => btn.disabled = true);
      isProcessing = true;
      setTimeout(() => {
        isProcessing = false;
        newRound();
      }, 800);
    } else {
      // 错误
      container.querySelector('.cm-message').textContent = '❌ 错了，再试！';
      selectedBtn.classList.add('cm-wrong');
      setTimeout(() => selectedBtn.classList.remove('cm-wrong'), 300);
      score = Math.max(0, score-1);
      container.querySelector('.cm-score').textContent = '得分: ' + score;
    }
  }

  // 构建UI
  container.innerHTML = `
    <div class="cm-game">
      <div class="cm-header">
        <div class="cm-title">色彩匹配</div>
        <div class="cm-score">得分: 0</div>
      </div>
      <div class="cm-target">
        <div class="cm-target-label">找到颜色完全相同的方块</div>
        <div class="cm-target-color"></div>
      </div>
      <div class="cm-options">
        <button class="cm-option"></button>
        <button class="cm-option"></button>
        <button class="cm-option"></button>
        <button class="cm-option"></button>
      </div>
      <div class="cm-message"></div>
      <button class="cm-restart">🔄 重新开始</button>
    </div>
  `;

  // 事件绑定
  container.querySelectorAll('.cm-option').forEach(btn => {
    btn.addEventListener('click', handleSelect);
  });

  container.querySelector('.cm-restart').addEventListener('click', () => {
    score = 0;
    container.querySelector('.cm-score').textContent = '得分: 0';
    newRound();
  });

  // 启动新回合
  newRound();
}