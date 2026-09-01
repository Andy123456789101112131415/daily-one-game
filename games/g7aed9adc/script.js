function init_g7aed9adc(container) {
function(container){
  // 游戏配置
  const symbols = ['🍎','🍊','🍋','🍇','🍓','🍒','🍑','🥝'];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let lock = false;

  // 创建DOM结构
  container.innerHTML = `
    <div class='mflip-wrap'>
      <div class='mflip-header'>
        <span class='mflip-title'>记忆翻转</span>
        <span class='mflip-score'>步数: <span id='mflip-moves'>0</span></span>
      </div>
      <div class='mflip-grid' id='mflip-grid'></div>
      <button class='mflip-restart' id='mflip-restart'>🔄 重来</button>
      <div class='mflip-message' id='mflip-msg'></div>
    </div>
  `;

  const grid = container.querySelector('#mflip-grid');
  const movesSpan = container.querySelector('#mflip-moves');
  const msg = container.querySelector('#mflip-msg');
  const restartBtn = container.querySelector('#mflip-restart');

  // 初始化游戏
  function initGame() {
    // 生成卡片对：每种符号两张
    cards = [...symbols, ...symbols];
    // 打乱
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    // 渲染
    grid.innerHTML = cards.map((symbol, index) => 
      `<div class='mflip-card' data-index='${index}' data-symbol='${symbol}'>?</div>`
    ).join('');
    // 重置状态
    flipped = [];
    matched = 0;
    moves = 0;
    lock = false;
    updateMoves();
    msg.textContent = '';
  }

  // 更新步数
  function updateMoves() {
    movesSpan.textContent = moves;
  }

  // 检查胜利
  function checkWin() {
    if (matched === symbols.length) {
      msg.textContent = '🎉 恭喜！你赢了！';
      msg.classList.add('mflip-win');
    }
  }

  // 处理卡片点击
  function handleCardClick(e) {
    const card = e.target.closest('.mflip-card');
    if (!card || lock) return;
    const index = card.dataset.index;
    // 忽略已匹配或已翻转的卡片
    if (card.classList.contains('matched') || card.classList.contains('flipped')) return;

    // 翻转卡片
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flipped.push(card);

    // 如果翻了两张
    if (flipped.length === 2) {
      moves++;
      updateMoves();
      const [card1, card2] = flipped;
      const sym1 = card1.dataset.symbol;
      const sym2 = card2.dataset.symbol;

      if (sym1 === sym2) {
        // 匹配成功
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        matched++;
        flipped = [];
        checkWin();
      } else {
        // 不匹配，延迟翻回
        lock = true;
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          card1.textContent = '?';
          card2.textContent = '?';
          flipped = [];
          lock = false;
        }, 800);
      }
    }
  }

  // 事件绑定
  grid.addEventListener('click', handleCardClick);
  restartBtn.addEventListener('click', initGame);

  // 启动游戏
  initGame();
}
}