function init_g63afbaba(container) {
const size = 5;
let grid = [];
let currentNumber = 1;
let score = 0;
let time = 0;
let timerInterval = null;
let gameOver = false;

const gridEl = container.querySelector('.nc-grid');
const scoreEl = container.querySelector('.nc-score');
const timeEl = container.querySelector('.nc-time');
const restartBtn = container.querySelector('.nc-btn');
const messageEl = container.querySelector('.nc-message');

function initGame() {
  clearInterval(timerInterval);
  gameOver = false;
  currentNumber = 1;
  score = 0;
  time = 0;
  updateScore();
  updateTime();
  messageEl.classList.remove('show');
  messageEl.textContent = '';
  gridEl.innerHTML = '';
  grid = [];
  const numbers = [];
  for (let i = 1; i <= size * size; i++) {
    numbers.push(i);
  }
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  let index = 0;
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'nc-cell';
      cell.textContent = numbers[index];
      cell.dataset.number = numbers[index];
      cell.addEventListener('click', () => handleClick(cell));
      gridEl.appendChild(cell);
      row.push(cell);
      index++;
    }
    grid.push(row);
  }
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    updateTime();
  }, 1000);
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateTime() {
  timeEl.textContent = time;
}

function handleClick(cell) {
  if (gameOver) return;
  const num = parseInt(cell.dataset.number, 10);
  if (num === currentNumber) {
    cell.classList.add('nc-correct');
    cell.classList.add('nc-disabled');
    currentNumber++;
    score += 10;
    updateScore();
    if (currentNumber > size * size) {
      winGame();
    }
  } else {
    cell.classList.add('nc-wrong');
    setTimeout(() => {
      cell.classList.remove('nc-wrong');
    }, 300);
    score = Math.max(0, score - 5);
    updateScore();
  }
}

function winGame() {
  gameOver = true;
  clearInterval(timerInterval);
  messageEl.textContent = '🎉 恭喜！你完成了！';
  messageEl.classList.add('show');
  setTimeout(() => {
    messageEl.classList.remove('show');
  }, 3000);
}

restartBtn.addEventListener('click', () => {
  initGame();
});

initGame();
}