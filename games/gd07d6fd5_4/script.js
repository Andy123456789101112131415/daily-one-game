function init_gd07d6fd5_4(container) {
function initGame(container) {
  const SIZE = 3;
  let tiles = [];
  let emptyIndex = 8;
  let moves = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameActive = false;

  container.innerHTML = '';
  container.classList.add('ns-container');

  const header = document.createElement('div');
  header.className = 'ns-header';
  const title = document.createElement('h1');
  title.className = 'ns-title';
  title.textContent = '数字华容道';
  const stats = document.createElement('div');
  stats.className = 'ns-stats';
  stats.innerHTML = '<div>步数: <span id="ns-moves">0</span></div><div>时间: <span id="ns-time">0s</span></div>';
  header.appendChild(title);
  header.appendChild(stats);

  const board = document.createElement('div');
  board.className = 'ns-board';
  board.id = 'ns-board';

  const controls = document.createElement('div');
  controls.className = 'ns-controls';
  const restartBtn = document.createElement('button');
  restartBtn.className = 'ns-btn';
  restartBtn.textContent = '🔄 重来';
  restartBtn.addEventListener('click', startNewGame);
  controls.appendChild(restartBtn);

  container.appendChild(header);
  container.appendChild(board);
  container.appendChild(controls);

  const winMessage = document.createElement('div');
  winMessage.className = 'ns-win-message';
  winMessage.style.display = 'none';
  winMessage.innerHTML = '<h2>🎉 恭喜！</h2><p>你完成了拼图！</p><button class="ns-btn ns-secondary" id="ns-play-again">再玩一次</button>';
  container.appendChild(winMessage);

  const movesSpan = container.querySelector('#ns-moves');
  const timeSpan = container.querySelector('#ns-time');
  const playAgainBtn = winMessage.querySelector('#ns-play-again');

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function isSolvable(arr) {
    let inversions = 0;
    const flat = arr.filter(n => n !== 0);
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        if (flat[i] > flat[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  }

  function generatePuzzle() {
    let arr;
    do {
      arr = shuffleArray([1,2,3,4,5,6,7,8,0]);
    } while (!isSolvable(arr) || arr[8] === 0);
    return arr;
  }

  function renderBoard() {
    board.innerHTML = '';
    tiles.forEach((value, index) => {
      const tile = document.createElement('div');
      tile.className = 'ns-tile';
      if (value === 0) {
        tile.classList.add('ns-empty');
      } else {
        tile.textContent = value;
        if (value === index + 1) {
          tile.classList.add('ns-correct');
        }
        tile.addEventListener('click', () => handleTileClick(index));
      }
      board.appendChild(tile);
    });
  }

  function handleTileClick(index) {
    if (!gameActive) return;
    if (tiles[index] === 0) return;
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;
    if ((row === emptyRow && Math.abs(col - emptyCol) === 1) || (col === emptyCol && Math.abs(row - emptyRow) === 1)) {
      swapTiles(index, emptyIndex);
      moves++;
      movesSpan.textContent = moves;
      renderBoard();
      checkWin();
    }
  }

  function swapTiles(i, j) {
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    emptyIndex = i;
  }

  function checkWin() {
    for (let i = 0; i < SIZE * SIZE - 1; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    if (tiles[SIZE * SIZE - 1] === 0) {
      gameActive = false;
      clearInterval(timerInterval);
      winMessage.style.display = 'block';
      return true;
    }
    return false;
  }

  function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timeSpan.textContent = '0s';
    timerInterval = setInterval(() => {
      seconds++;
      timeSpan.textContent = seconds + 's';
    }, 1000);
  }

  function startNewGame() {
    tiles = generatePuzzle();
    emptyIndex = tiles.indexOf(0);
    moves = 0;
    movesSpan.textContent = '0';
    gameActive = true;
    winMessage.style.display = 'none';
    renderBoard();
    startTimer();
  }

  playAgainBtn.addEventListener('click', () => {
    winMessage.style.display = 'none';
    startNewGame();
  });

  document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    const key = e.key;
    let targetIndex = -1;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;
    if (key === 'ArrowUp' && emptyRow < SIZE - 1) targetIndex = emptyIndex + SIZE;
    else if (key === 'ArrowDown' && emptyRow > 0) targetIndex = emptyIndex - SIZE;
    else if (key === 'ArrowLeft' && emptyCol < SIZE - 1) targetIndex = emptyIndex + 1;
    else if (key === 'ArrowRight' && emptyCol > 0) targetIndex = emptyIndex - 1;
    if (targetIndex !== -1) {
      e.preventDefault();
      handleTileClick(targetIndex);
    }
  });

  startNewGame();
}
}