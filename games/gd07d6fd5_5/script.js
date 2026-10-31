function init_gd07d6fd5_5(container) {
const size = 4;
const totalTiles = size * size;
let board = [];
let emptyIndex = totalTiles - 1;
let moves = 0;
let startTime = null;
let timerInterval = null;
let gameWon = false;

const boardEl = container.querySelector('.ns-board');
const movesEl = container.querySelector('.ns-moves');
const timeEl = container.querySelector('.ns-time');
const messageEl = container.querySelector('.ns-message');
const restartBtn = container.querySelector('.ns-restart');

function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return min + ':' + (s < 10 ? '0' : '') + s;
}

function updateTimer() {
  if (!startTime) return;
  const elapsed = Date.now() - startTime;
  timeEl.textContent = formatTime(elapsed);
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 200);
  updateTimer();
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function shuffleBoard() {
  board = Array.from({ length: totalTiles }, (_, i) => i);
  // 随机移动合法步数来打乱
  let prevEmpty = emptyIndex;
  for (let i = 0; i < 200; i++) {
    const neighbors = getNeighbors(emptyIndex);
    const valid = neighbors.filter(n => n !== prevEmpty);
    const pick = valid[Math.floor(Math.random() * valid.length)];
    board[emptyIndex] = board[pick];
    board[pick] = totalTiles - 1;
    prevEmpty = emptyIndex;
    emptyIndex = pick;
  }
  // 确保不是已解决状态
  if (isSolved()) {
    shuffleBoard();
  }
}

function getNeighbors(index) {
  const row = Math.floor(index / size);
  const col = index % size;
  const neighbors = [];
  if (row > 0) neighbors.push(index - size);
  if (row < size - 1) neighbors.push(index + size);
  if (col > 0) neighbors.push(index - 1);
  if (col < size - 1) neighbors.push(index + 1);
  return neighbors;
}

function isSolved() {
  for (let i = 0; i < totalTiles - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[totalTiles - 1] === totalTiles - 1;
}

function renderBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'ns-tile';
    const val = board[i];
    if (val === totalTiles - 1) {
      tile.classList.add('ns-empty');
    } else {
      tile.textContent = val + 1;
      const neighbors = getNeighbors(i);
      if (neighbors.includes(emptyIndex)) {
        tile.classList.add('ns-movable');
      }
      tile.dataset.index = i;
    }
    boardEl.appendChild(tile);
  }
}

function handleTileClick(e) {
  if (gameWon) return;
  const tile = e.target.closest('.ns-tile');
  if (!tile || tile.classList.contains('ns-empty')) return;
  const index = parseInt(tile.dataset.index, 10);
  const neighbors = getNeighbors(index);
  if (!neighbors.includes(emptyIndex)) return;
  // 交换
  board[emptyIndex] = board[index];
  board[index] = totalTiles - 1;
  emptyIndex = index;
  moves++;
  movesEl.textContent = moves;
  renderBoard();
  if (isSolved()) {
    gameWon = true;
    stopTimer();
    const elapsed = startTime ? Date.now() - startTime : 0;
    messageEl.textContent = '🎉 恭喜完成！用时 ' + formatTime(elapsed) + '，步数 ' + moves;
    messageEl.className = 'ns-message ns-win';
    messageEl.style.display = 'block';
  }
}

function handleKeyDown(e) {
  if (gameWon) return;
  const key = e.key;
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;
  let targetIndex = -1;
  if (key === 'ArrowUp' && row < size - 1) targetIndex = emptyIndex + size;
  else if (key === 'ArrowDown' && row > 0) targetIndex = emptyIndex - size;
  else if (key === 'ArrowLeft' && col < size - 1) targetIndex = emptyIndex + 1;
  else if (key === 'ArrowRight' && col > 0) targetIndex = emptyIndex - 1;
  if (targetIndex === -1) return;
  e.preventDefault();
  board[emptyIndex] = board[targetIndex];
  board[targetIndex] = totalTiles - 1;
  emptyIndex = targetIndex;
  moves++;
  movesEl.textContent = moves;
  renderBoard();
  if (isSolved()) {
    gameWon = true;
    stopTimer();
    const elapsed = startTime ? Date.now() - startTime : 0;
    messageEl.textContent = '🎉 恭喜完成！用时 ' + formatTime(elapsed) + '，步数 ' + moves;
    messageEl.className = 'ns-message ns-win';
    messageEl.style.display = 'block';
  }
}

function restartGame() {
  gameWon = false;
  moves = 0;
  movesEl.textContent = '0';
  messageEl.style.display = 'none';
  messageEl.className = 'ns-message';
  stopTimer();
  startTime = null;
  timeEl.textContent = '0:00';
  shuffleBoard();
  renderBoard();
  startTimer();
}

// 初始化
shuffleBoard();
renderBoard();
startTimer();

// 事件绑定
boardEl.addEventListener('click', handleTileClick);
restartBtn.addEventListener('click', restartGame);
container.addEventListener('keydown', handleKeyDown);

// 清理定时器（可选，但为了健壮性）
container.addEventListener('ns-cleanup', () => stopTimer());
}