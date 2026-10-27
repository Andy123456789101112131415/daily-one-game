function init_gdde7cd56_6(container) {
let container = arguments[0];
container.innerHTML = '';
const root = document.createElement('div');
root.className = 'nm-root';
container.appendChild(root);
const card = document.createElement('div');
card.className = 'nm-card';
root.appendChild(card);
const header = document.createElement('div');
header.className = 'nm-header';
header.innerHTML = `<div class='nm-thumb'><svg viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'><rect width='56' height='56' rx='8' fill='#f8f9fc'/><rect x='8' y='8' width='8' height='8' rx='2' fill='#7c3aed'/><rect x='18' y='8' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='28' y='8' width='8' height='8' rx='2' fill='#06b6d4'/><rect x='38' y='8' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='8' y='18' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='18' y='18' width='8' height='8' rx='2' fill='#10b981'/><rect x='28' y='18' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='38' y='18' width='8' height='8' rx='2' fill='#f59e0b'/><rect x='8' y='28' width='8' height='8' rx='2' fill='#06b6d4'/><rect x='18' y='28' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='28' y='28' width='8' height='8' rx='2' fill='#ef4444'/><rect x='38' y='28' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='8' y='38' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='18' y='38' width='8' height='8' rx='2' fill='#f59e0b'/><rect x='28' y='38' width='8' height='8' rx='2' fill='#e2e8f0'/><rect x='38' y='38' width='8' height='8' rx='2' fill='#7c3aed'/></svg></div><div><h1 class='nm-title'>数字迷宫</h1><p class='nm-subtitle'>按顺序点击数字 1 到 9</p></div>`;
card.appendChild(header);
const stats = document.createElement('div');
stats.className = 'nm-stats';
stats.innerHTML = `<span>得分: <span class='nm-score'>0</span></span><span>时间: <span class='nm-timer'>0.0s</span></span>`;
card.appendChild(stats);
const scoreSpan = stats.querySelector('.nm-score');
const timerSpan = stats.querySelector('.nm-timer');
const grid = document.createElement('div');
grid.className = 'nm-grid';
card.appendChild(grid);
const message = document.createElement('div');
message.className = 'nm-message nm-info';
message.textContent = '点击开始游戏';
card.appendChild(message);
const progress = document.createElement('div');
progress.className = 'nm-progress';
progress.innerHTML = '<div class="nm-progress-bar"></div>';
card.appendChild(progress);
const progressBar = progress.querySelector('.nm-progress-bar');
const controls = document.createElement('div');
controls.className = 'nm-controls';
const startBtn = document.createElement('button');
startBtn.className = 'nm-btn nm-btn-primary';
startBtn.textContent = '开始游戏';
controls.appendChild(startBtn);
const resetBtn = document.createElement('button');
resetBtn.className = 'nm-btn';
resetBtn.textContent = '🔄 重来';
controls.appendChild(resetBtn);
card.appendChild(controls);
const footer = document.createElement('div');
footer.className = 'nm-footer';
footer.textContent = '键盘: 数字键 1-9 或方向键移动+回车';
card.appendChild(footer);

let cells = [];
let numbers = [];
let currentIndex = 0;
let score = 0;
let startTime = null;
let timerInterval = null;
let gameActive = false;
let selectedIndex = 0;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  gameActive = false;
  currentIndex = 0;
  score = 0;
  selectedIndex = 0;
  scoreSpan.textContent = '0';
  timerSpan.textContent = '0.0s';
  progressBar.style.width = '0%';
  message.textContent = '点击开始游戏';
  message.className = 'nm-message nm-info';
  grid.innerHTML = '';
  cells = [];
  numbers = shuffleArray([1,2,3,4,5,6,7,8,9]);
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'nm-cell';
    cell.textContent = numbers[i];
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i));
    grid.appendChild(cell);
    cells.push(cell);
  }
  updateActiveCell();
}

function updateActiveCell() {
  cells.forEach((cell, idx) => {
    cell.classList.toggle('nm-active', idx === selectedIndex && gameActive);
  });
}

function handleCellClick(index) {
  if (!gameActive) return;
  if (index === selectedIndex) {
    checkNumber(index);
  } else {
    selectedIndex = index;
    updateActiveCell();
  }
}

function checkNumber(index) {
  const num = numbers[index];
  if (num === currentIndex + 1) {
    cells[index].classList.add('nm-correct');
    cells[index].classList.remove('nm-active');
    currentIndex++;
    score += 10;
    scoreSpan.textContent = score;
    progressBar.style.width = (currentIndex / 9 * 100) + '%';
    if (currentIndex === 9) {
      winGame();
    } else {
      selectedIndex = findNextNumber(currentIndex + 1);
      updateActiveCell();
    }
  } else {
    cells[index].classList.add('nm-wrong');
    setTimeout(() => {
      cells[index].classList.remove('nm-wrong');
    }, 300);
    score = Math.max(0, score - 5);
    scoreSpan.textContent = score;
  }
}

function findNextNumber(num) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === num) return i;
  }
  return 0;
}

function winGame() {
  gameActive = false;
  clearInterval(timerInterval);
  timerInterval = null;
  message.textContent = '🎉 恭喜你完成迷宫！';
  message.className = 'nm-message nm-success';
  startBtn.textContent = '再玩一次';
}

function startGame() {
  if (gameActive) return;
  initGame();
  gameActive = true;
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timerSpan.textContent = elapsed.toFixed(1) + 's';
  }, 100);
  message.textContent = '游戏进行中...';
  message.className = 'nm-message nm-info';
  startBtn.textContent = '游戏中';
  selectedIndex = findNextNumber(1);
  updateActiveCell();
}

function resetGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  initGame();
  startBtn.textContent = '开始游戏';
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  if (e.key >= '1' && e.key <= '9') {
    const num = parseInt(e.key);
    const idx = numbers.indexOf(num);
    if (idx !== -1) {
      selectedIndex = idx;
      updateActiveCell();
      checkNumber(idx);
    }
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    const row = Math.floor(selectedIndex / 3);
    const col = selectedIndex % 3;
    let newRow = row, newCol = col;
    if (e.key === 'ArrowUp') newRow = Math.max(0, row - 1);
    if (e.key === 'ArrowDown') newRow = Math.min(2, row + 1);
    if (e.key === 'ArrowLeft') newCol = Math.max(0, col - 1);
    if (e.key === 'ArrowRight') newCol = Math.min(2, col + 1);
    selectedIndex = newRow * 3 + newCol;
    updateActiveCell();
  } else if (e.key === 'Enter') {
    checkNumber(selectedIndex);
  }
});

initGame();
}