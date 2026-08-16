function init_g6a027f85_3(container) {
function(container){
  // 颜色库
  const COLORS = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444'];
  let currentColors = [];  // 当前显示的颜色
  let currentIndex = 0;    // 当前要匹配的索引
  let score = 0;
  let gameOver = false;

  // 创建UI结构
  const card = document.createElement('div');
  card.className = 'cm-card';
  card.innerHTML = `
    <div class='cm-header'>
      <div class='cm-title'>Color Match</div>
      <div class='cm-score'>Score: <span id='cm-score'>0</span></div>
    </div>
    <div class='cm-grid'></div>
    <div class='cm-options'></div>
    <div class='cm-msg'></div>
    <button class='cm-restart'>New Game</button>
  `;
  container.appendChild(card);

  const grid = card.querySelector('.cm-grid');
  const optionsDiv = card.querySelector('.cm-options');
  const msg = card.querySelector('.cm-msg');
  const scoreSpan = card.querySelector('#cm-score');
  const restartBtn = card.querySelector('.cm-restart');

  // 生成新对局
  function newGame() {
    // 随机选择4个颜色
    currentColors = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4);
    currentIndex = 0;
    score = 0;
    gameOver = false;
    scoreSpan.textContent = score;
    msg.textContent = '';
    renderGrid();
    renderOptions();
  }

  // 渲染颜色块
  function renderGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < currentColors.length; i++) {
      const div = document.createElement('div');
      div.className = 'cm-color';
      div.dataset.index = i;
      div.style.backgroundColor = currentColors[i];
      if (i === currentIndex) {
        div.classList.add('selected');
      } else if (i < currentIndex) {
        div.classList.add('wrong'); // 已匹配过的标为wrong（置灰）
      }
      grid.appendChild(div);
    }
  }

  // 渲染选项（所有颜色）
  function renderOptions() {
    optionsDiv.innerHTML = '';
    COLORS.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'cm-opt';
      btn.textContent = color;
      btn.style.borderLeft = `4px solid ${color}`;
      btn.style.borderRight = `4px solid ${color}`;
      btn.addEventListener('click', () => handlePick(color));
      optionsDiv.appendChild(btn);
    });
  }

  // 处理选择
  function handlePick(color) {
    if (gameOver) return;
    const target = currentColors[currentIndex];
    if (color === target) {
      // 正确
      score++;
      scoreSpan.textContent = score;
      currentIndex++;
      renderGrid();
      if (currentIndex === currentColors.length) {
        // 完成
        gameOver = true;
        msg.textContent = '🎉 Well done!';
        msg.style.color = '#10b981';
        optionsDiv.querySelectorAll('.cm-opt').forEach(btn => btn.disabled = true);
      } else {
        msg.textContent = '';
      }
    } else {
      // 错误
      gameOver = true;
      msg.textContent = '❌ Game Over';
      msg.style.color = '#ef4444';
      optionsDiv.querySelectorAll('.cm-opt').forEach(btn => btn.disabled = true);
    }
  }

  // 重来按钮
  restartBtn.addEventListener('click', newGame);

  // 键盘支持：数字1-5对应选项索引
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    const num = parseInt(e.key);
    if (num >= 1 && num <= COLORS.length) {
      const btns = optionsDiv.children;
      if (btns[num-1]) {
        btns[num-1].click();
      }
    }
  });

  // 启动
  newGame();
}
}