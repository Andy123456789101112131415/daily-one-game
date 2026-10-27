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
let timer = null;
let startTime = 0;
let isPlaying = false;
let selectedIndex = 0;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function initGrid() {
  grid.innerHTML = '';
  cells = [];
  numbers = shuffle([1,2,3,4,5,6,7,8,9]);
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'nm-cell';
    cell.textContent = numbers[i];
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i));
    grid.appendChild(cell);
    cells.push(cell);
  }
  selectedIndex = 0;
  updateSelection();
}
function updateSelection() {
  cells.forEach((c, i) => {
    if (i === selectedIndex && isPlaying) {
      c.classList.add('nm-active');
    } else {
      c.classList.remove('nm-active');
    }
  });
}
function handleCellClick(index) {
  if (!isPlaying) return;
  selectedIndex = index;
  updateSelection();
  checkNumber(index);
}
function checkNumber(index) {
  if (!isPlaying) return;
  const expected = currentIndex + 1;
  const cell = cells[index];
  if (numbers[index] === expected) {
    cell.classList.add('nm-correct');
    cell.classList.remove('nm-active');
    cell.style.pointerEvents = 'none';
    currentIndex++;
    score += 10;
    scoreSpan.textContent = score;
    progressBar.style.width = (currentIndex / 9 * 100) + '%';
    if (currentIndex === 9) {
      endGame(true);
    }
  } else {
    cell.classList.add('nm-wrong');
    setTimeout(() => {
      cell.classList.remove('nm-wrong');
    }, 300);
    score = Math.max(0, score - 5);
    scoreSpan.textContent = score;
  }
}
function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  currentIndex = 0;
  score = 0;
  scoreSpan.textContent = score;
  progressBar.style.width = '0%';
  message.textContent = '找到数字 1';
  message.className = 'nm-message nm-info';
  initGrid();
  startTime = Date.now();
  timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timerSpan.textContent = elapsed.toFixed(1) + 's';
  }, 100);
  startBtn.textContent = '游戏中...';
  startBtn.disabled = true;
  resetBtn.disabled = false;
}
function endGame(win) {
  isPlaying = false;
  clearInterval(timer);
  startBtn.textContent = '开始游戏';
  startBtn.disabled = false;
  if (win) {
    const elapsed = (Date.now() - startTime) / 1000;
    message.textContent = `🎉 胜利! 用时 ${elapsed.toFixed(1)}s 得分 ${score}`;
    message.className = 'nm-message nm-win';
    cells.forEach(c => c.style.pointerEvents = 'none');
  } else {
    message.textContent = '游戏结束';
    message.className = 'nm-message nm-lose';
  }
}
function resetGame() {
  isPlaying = false;
  clearInterval(timer);
  currentIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;
  timerSpan.textContent = '0.0s';
  progressBar.style.width = '0%';
  message.textContent = '点击开始游戏';
  message.className = 'nm-message nm-info';
  startBtn.textContent = '开始游戏';
  startBtn.disabled = false;
  initGrid();
  cells.forEach(c => c.style.pointerEvents = 'auto');
}
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
container.addEventListener('keydown', (e) => {
  if (!isPlaying) return;
  const key = e.key;
  if (key >= '1' && key <= '9') {
    e.preventDefault();
    const num = parseInt(key);
    const idx = numbers.indexOf(num);
    if (idx !== -1) {
      selectedIndex = idx;
      updateSelection();
      checkNumber(idx);
    }
  } else if (key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = (selectedIndex - 3 + 9) % 9;
    updateSelection();
  } else if (key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = (selectedIndex + 3) % 9;
    updateSelection();
  } else if (key === 'ArrowLeft') {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + 9) % 9;
    updateSelection();
  } else if (key === 'ArrowRight') {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % 9;
    updateSelection();
  } else if (key === 'Enter') {
    e.preventDefault();
    checkNumber(selectedIndex);
  }
});
container.tabIndex = 0;
initGrid();
resetGame();
}