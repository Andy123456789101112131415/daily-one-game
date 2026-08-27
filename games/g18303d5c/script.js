function init_g18303d5c(container) {
function(container){
  // 卡片符号集，共8对
  const symbols = ['🍎','🍊','🍋','🍇','🍓','🍒','🥝','🍑'];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let lock = false;
  let attempts = 0;
  let score = 0;
  let message = '';

  // 创建卡片数组（每个符号出现两次）
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function initGame(){
    cards = [];
    flipped = [];
    matched = 0;
    lock = false;
    attempts = 0;
    score = 0;
    message = '';

    // 构建双倍符号并洗牌
    let deck = symbols.concat(symbols);
    deck = shuffle(deck);

    // 构建卡片对象
    cards = deck.map((sym, idx) => ({
      id: idx,
      symbol: sym,
      isFlipped: false,
      isMatched: false
    }));

    render();
  }

  function render(){
    // 构建头部
    container.innerHTML = `
      <div class="mfp-header">
        <div class="mfp-title">记忆翻牌</div>
        <div class="mfp-score">得分: <span id="mfp-score-val">${score}</span> | 翻牌: <span id="mfp-attempts">${attempts}</span></div>
      </div>
      <div class="mfp-grid" id="mfp-grid"></div>
      <div style="text-align:center;">
        <button class="mfp-btn" id="mfp-restart">🔄 重来</button>
      </div>
      <div class="mfp-message" id="mfp-message">${message}</div>
    `;

    const grid = container.querySelector('#mfp-grid');
    const restartBtn = container.querySelector('#mfp-restart');
    const scoreEl = container.querySelector('#mfp-score-val');
    const attemptsEl = container.querySelector('#mfp-attempts');
    const messageEl = container.querySelector('#mfp-message');

    // 生成卡片DOM
    cards.forEach((card, idx) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'mfp-card';
      cardDiv.dataset.index = idx;
      cardDiv.innerHTML = `<span class="symbol">${card.symbol}</span>`;
      if(card.isFlipped || card.isMatched) cardDiv.classList.add('flipped');
      if(card.isMatched) cardDiv.classList.add('matched');
      cardDiv.addEventListener('click', () => handleCardClick(idx));
      grid.appendChild(cardDiv);
    });

    // 更新分数显示
    scoreEl.textContent = score;
    attemptsEl.textContent = attempts;
    messageEl.textContent = message;

    // 绑定重来按钮
    restartBtn.addEventListener('click', initGame);

    // 键盘支持：按R重来，数字键1-8? 但这里简单点，只支持R和空格
    function keyHandler(e){
      if(e.key === 'r' || e.key === 'R'){
        initGame();
      }
    }
    container.addEventListener('keydown', keyHandler);
    // 注意：container需要tabindex才能接收键盘事件，但为了简单，我们只绑定到document？但要求事件绑定在container内，所以给container加tabindex
    container.setAttribute('tabindex', '0');
    container.focus();

    // 保存清理函数（可选）
    container._cleanup = () => {
      container.removeEventListener('keydown', keyHandler);
    };
  }

  function handleCardClick(idx){
    if(lock) return;
    const card = cards[idx];
    if(card.isMatched || card.isFlipped) return;

    // 翻转卡片
    card.isFlipped = true;
    flipped.push(idx);
    attempts++;

    // 更新UI：找到对应DOM并添加flipped类
    const cardDivs = container.querySelectorAll('.mfp-card');
    const targetDiv = cardDivs[idx];
    targetDiv.classList.add('flipped');

    // 更新分数和翻牌数
    updateStats();

    // 如果翻了两张
    if(flipped.length === 2){
      lock = true;
      const [i1, i2] = flipped;
      const card1 = cards[i1];
      const card2 = cards[i2];

      if(card1.symbol === card2.symbol){
        // 匹配成功
        card1.isMatched = true;
        card2.isMatched = true;
        card1.isFlipped = false;
        card2.isFlipped = false;
        matched++;
        score += 10;

        // 更新DOM：移除flipped，添加matched
        const div1 = cardDivs[i1];
        const div2 = cardDivs[i2];
        div1.classList.remove('flipped');
        div2.classList.remove('flipped');
        div1.classList.add('matched');
        div2.classList.add('matched');

        // 更新统计和消息
        updateStats();
        if(matched === 8){
          message = '🎉 恭喜你赢了！';
          messageEl.classList.add('win');
          messageEl.textContent = message;
        } else {
          message = '配对成功！';
          messageEl.textContent = message;
        }
        // 解锁
        lock = false;
        flipped = [];
      } else {
        // 不匹配
        message = '再试一次';
        messageEl.textContent = message;
        // 延迟翻转回去
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          const div1 = cardDivs[i1];
          const div2 = cardDivs[i2];
          div1.classList.remove('flipped');
          div2.classList.remove('flipped');
          flipped = [];
          lock = false;
        }, 800);
      }
    }
  }

  function updateStats(){
    const scoreEl = container.querySelector('#mfp-score-val');
    const attemptsEl = container.querySelector('#mfp-attempts');
    if(scoreEl) scoreEl.textContent = score;
    if(attemptsEl) attemptsEl.textContent = attempts;
  }

  // 初始化
  initGame();

  // 返回清理函数（可选）
  return function cleanup(){
    if(container._cleanup) container._cleanup();
  };
}
}