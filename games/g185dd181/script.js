function init_g185dd181(container) {
function(container) {
  const symbols = ['🍎','🍌','🍇','🍒','🍓','🍑','🍍','🥝'];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let attempts = 0;
  let lock = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function init() {
    // 重置状态
    cards = shuffle([...symbols, ...symbols]);
    flipped = [];
    matched = 0;
    attempts = 0;
    lock = false;

    // 构建DOM
    container.innerHTML = `
      <div class="mm-card">
        <div class="mm-head">
          <span class="mm-title">记忆配对</span>
          <span class="mm-score">尝试: <span id="mm-attempts">0</span></span>
        </div>
        <div class="mm-grid" id="mm-grid">
          ${cards.map((sym, i) => `<button class="mm-card-btn" data-index="${i}" data-symbol="${sym}">?</button>`).join('')}
        </div>
        <div style="text-align:center;">
          <button class="mm-button" id="mm-restart">重新开始</button>
        </div>
        <div class="mm-message" id="mm-message"></div>
      </div>
    `;

    // 事件绑定
    const grid = container.querySelector('#mm-grid');
    const restartBtn = container.querySelector('#mm-restart');
    const attemptsSpan = container.querySelector('#mm-attempts');
    const messageDiv = container.querySelector('#mm-message');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.mm-card-btn');
      if (!btn || lock || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;

      const idx = parseInt(btn.dataset.index);
      btn.classList.add('flipped');
      btn.textContent = cards[idx];
      flipped.push(btn);

      if (flipped.length === 2) {
        attempts++;
        attemptsSpan.textContent = attempts;
        lock = true;
        const [first, second] = flipped;
        if (first.dataset.symbol === second.dataset.symbol) {
          first.classList.add('matched');
          second.classList.add('matched');
          matched++;
          flipped = [];
          lock = false;
          if (matched === symbols.length) {
            messageDiv.textContent = '🎉 恭喜你赢了！';
            messageDiv.classList.add('mm-win');
          }
        } else {
          setTimeout(() => {
            first.classList.remove('flipped');
            second.classList.remove('flipped');
            first.textContent = '?';
            second.textContent = '?';
            flipped = [];
            lock = false;
          }, 800);
        }
      }
    });

    restartBtn.addEventListener('click', () => {
      init();
    });
  }

  init();
}
}