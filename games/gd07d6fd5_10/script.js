function init_gd07d6fd5_10(container) {
function initGame(container) {
  const size = 4;
  const total = size * size;
  let tiles = [];
  let emptyIndex = total - 1;
  let moves = 0;
  let startTime = null;
  let timerInterval = null;
  let gameWon = false;

  const gameDiv = document.createElement('div');
  gameDiv.className = 'ns-game';

  const header = document.createElement('div');
  header.className = 'ns-header';

  const info = document.createElement('div');
  info.className = 'ns-info';
  info.innerHTML = '<div>步数: <span id="ns-moves">0</span></div><div>时间: <span id="ns-time">00:00</span></div>';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'ns-btn';
  restartBtn.textContent = '🔄 重来';

  header.appendChild(info);
  header.appendChild(restartBtn);

  const board = document.createElement('div');
  board.className = 'ns-board';
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  const message = document.createElement('div');
  message.className = 'ns-message';

  gameDiv.appendChild(header);
  gameDiv.appendChild(board);
  gameDiv.appendChild(message);
  container.appendChild(gameDiv);

  const movesSpan = info.querySelector('#ns-moves');
  const timeSpan = info.querySelector('#ns-time');

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  function updateTimer() {
    if (startTime) {
      timeSpan.textContent = formatTime(Date.now() - startTime);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 200);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function shuffle() {
    tiles = Array.from({ length: total }, (_, i) => i + 1);
    tiles[emptyIndex] = 0;
    for (let i = 0; i < 1000; i++) {
      const neighbors = getNeighbors(emptyIndex);
      const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
      swap(emptyIndex, rand);
    }
    if (isSolved()) {
      shuffle();
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

  function swap(i, j) {
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    if (tiles[i] === 0) emptyIndex = i;
    if (tiles[j] === 0) emptyIndex = j;
  }

  function isSolved() {
    for (let i = 0; i < total - 1; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    return tiles[total - 1] === 0;
  }

  function render() {
    board.innerHTML = '';
    tiles.forEach((value, index) => {
      const tile = document.createElement('div');
      tile.className = 'ns-tile' + (value === 0 ? ' ns-empty' : '');
      tile.textContent = value === 0 ? '' : value;
      tile.dataset.index = index;
      if (value !== 0) {
        tile.addEventListener('click', () => handleTileClick(index));
      }
      board.appendChild(tile);
    });
  }

  function handleTileClick(index) {
    if (gameWon) return;
    if (getNeighbors(emptyIndex).includes(index)) {
      swap(emptyIndex, index);
      moves++;
      movesSpan.textContent = moves;
      render();
      if (isSolved()) {
        win();
      }
    }
  }

  function win() {
    gameWon = true;
    stopTimer();
    message.textContent = '🎉 恭喜完成！';
    message.className = 'ns-message ns-win';
    setTimeout(() => {
      message.textContent = '';
      message.className = 'ns-message';
    }, 3000);
  }

  function reset() {
    gameWon = false;
    moves = 0;
    movesSpan.textContent = '0';
    stopTimer();
    timeSpan.textContent = '00:00';
    message.textContent = '';
    message.className = 'ns-message';
    shuffle();
    render();
    startTimer();
  }

  restartBtn.addEventListener('click', reset);

  container.addEventListener('keydown', (e) => {
    if (gameWon) return;
    const key = e.key;
    let targetIndex = -1;
    const row = Math.floor(emptyIndex / size);
    const col = emptyIndex % size;
    if (key === 'ArrowUp' && row < size - 1) targetIndex = emptyIndex + size;
    else if (key === 'ArrowDown' && row > 0) targetIndex = emptyIndex - size;
    else if (key === 'ArrowLeft' && col < size - 1) targetIndex = emptyIndex + 1;
    else if (key === 'ArrowRight' && col > 0) targetIndex = emptyIndex - 1;
    if (targetIndex !== -1) {
      e.preventDefault();
      swap(emptyIndex, targetIndex);
      moves++;
      movesSpan.textContent = moves;
      render();
      if (isSolved()) win();
    }
  });

  container.tabIndex = 0;
  container.style.outline = 'none';

  reset();
}
}