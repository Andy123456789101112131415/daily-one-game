function init_gd07d6fd5_5(container) {
const size = 4;
const totalTiles = size * size;
let board = [];
let emptyIndex = totalTiles - 1;
let moves = 0;
let startTime = null;
let timerInterval = null;
let gameWon = false;

const container = document.querySelector('.ns-container');
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

function shuffleBoard() {
  board = Array.from({ length: totalTiles }, (_, i) => i);
  emptyIndex = totalTiles - 1;
  let prevEmpty = emptyIndex;
  for (let i = 0; i < 200; i++) {
    const neighbors = getNeighbors(emptyIndex);
    const valid = neighbors.filter(n => n !== prevEmpty);
    if (valid.length === 0) continue;
    const pick = valid[Math.floor(Math.random() * valid.length)];
    board[emptyIndex] = board[pick];
    board[pick] = totalTiles - 1;
    prevEmpty = emptyIndex;
    emptyIndex = pick;
  }
  if (isSolved()) {
    shuffleBoard();
  }
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
  if (isNaN(index)) return;
  const neighbors = getNeighbors(index);
  if (!neighbors.includes(emptyIndex)) return;
  board[emptyIndex] = board[index];
  board[index] = totalTiles - 1;
  emptyIndex = index;
  moves++;
  movesEl.textContent = moves;
  renderBoard();
  if (isSolved()) {
    gameWon = true;
    stopTimer();
    messageEl.textContent = '🎉 恭喜！你完成了！';
  }
}

function resetGame() {
  stopTimer();
  gameWon = false;
  moves = 0;
  movesEl.textContent = '0';
  timeEl.textContent = '0:00';
  messageEl.textContent = '';
  shuffleBoard();
  renderBoard();
  startTimer();
}

boardEl.addEventListener('click', handleTileClick);
restartBtn.addEventListener('click', resetGame);

resetGame();
}