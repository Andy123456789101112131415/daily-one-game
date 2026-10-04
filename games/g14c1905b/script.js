function init_g14c1905b(container) {
let board = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let score = 0;
let lock = false;
let timerInterval = null;
let seconds = 0;
let gameStarted = false;

const totalPairs = 8;
const gridSize = 4;

const wrapper = document.createElement('div');
wrapper.className = 'mf-wrapper';
wrapper.innerHTML = `
  <div class="mf-header">
    <div class="mf-icon">
      <svg viewBox="0 0 56 56"><rect width="56" height="56" rx="8" fill="#f8f9fc"/><rect x="8" y="12" width="18" height="24" rx="3" fill="#7c3aed"/><rect x="30" y="12" width="18" height="24" rx="3" fill="#06b6d4"/><text x="17" y="28" font-family="system-ui" font-size="12" fill="white" text-anchor="middle">?</text><text x="39" y="28" font-family="system-ui" font-size="12" fill="white" text-anchor="middle">?</text><rect x="8" y="40" width="40" height="4" rx="2" fill="#e2e8f0"/></svg>
    </div>
    <div class="mf-title-wrap">
      <h1 class="mf-title">数字记忆翻牌</h1>
      <span class="mf-tag">Memory Flip</span>
    </div>
  </div>
  <div class="mf-stats">
    <div class="mf-stat"><span class="mf-stat-label">步数</span><span class="mf-stat-value" id="mf-moves">0</span></div>
    <div class="mf-stat"><span class="mf-stat-label">配对</span><span class="mf-stat-value" id="mf-pairs">0/8</span></div>
    <div class="mf-stat"><span class="mf-stat-label">时间</span><span class="mf-stat-value" id="mf-time">0s</span></div>
    <div class="mf-stat"><span class="mf-stat-label">得分</span><span class="mf-stat-value" id="mf-score">0</span></div>
  </div>
  <div class="mf-message" id="mf-message">点击卡片开始游戏</div>
  <div class="mf-board" id="mf-board"></div>
  <div class="mf-controls">
    <button class="mf-btn mf-btn-primary" id="mf-restart">🔄 重新开始</button>
  </div>
`;
container.appendChild(wrapper);

const boardEl = wrapper.querySelector('#mf-board');
const movesEl = wrapper.querySelector('#mf-moves');
const pairsEl = wrapper.querySelector('#mf-pairs');
const timeEl = wrapper.querySelector('#mf-time');
const scoreEl = wrapper.querySelector('#mf-score');
const messageEl = wrapper.querySelector('#mf-message');
const restartBtn = wrapper.querySelector('#mf-restart');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    seconds++;
    timeEl.textContent = seconds + 's';
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateStats() {
  movesEl.textContent = moves;
  pairsEl.textContent = matchedPairs + '/' + totalPairs;
  scoreEl.textContent = score;
}

function initGame() {
  board = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  score = 0;
  lock = false;
  seconds = 0;
  gameStarted = false;
  stopTimer();
  timeEl.textContent = '0s';
  updateStats();
  messageEl.textContent = '点击卡片开始游戏';

  const numbers = [];
  for (let i = 1; i <= totalPairs; i++) {
    numbers.push(i, i);
  }
  shuffle(numbers);

  boardEl.innerHTML = '';
  numbers.forEach((num, index) => {
    const card = document.createElement('div');
    card.className = 'mf-card';
    card.dataset.value = num;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="mf-card-inner">
        <div class="mf-card-front">?</div>
        <div class="mf-card-back">${num}</div>
      </div>
    `;
    card.addEventListener('click', () => handleCardClick(card));
    boardEl.appendChild(card);
    board.push({ value: num, matched: false, el: card });
  });
}

function handleCardClick(card) {
  if (lock) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
    messageEl.textContent = '加油！找出所有配对';
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  const v1 = c1.dataset.value;
  const v2 = c2.dataset.value;

  if (v1 === v2) {
    c1.classList.add('matched');
    c2.classList.add('matched');
    c1.classList.remove('flipped');
    c2.classList.remove('flipped');
    matchedPairs++;
    score += 10;
    flippedCards = [];
    updateStats();

    if (matchedPairs === totalPairs) {
      stopTimer();
      const bonus = Math.max(0, 100 - seconds * 2);
      score += bonus;
      updateStats();
      messageEl.textContent = '🎉 恭喜完成！用时 ' + seconds + 's，得分 ' + score;
    }
  } else {
    lock = true;
    score = Math.max(0, score - 1);
    updateStats();
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      flippedCards = [];
      lock = false;
    }, 800);
  }
}

restartBtn.addEventListener('click', initGame);

initGame();
}