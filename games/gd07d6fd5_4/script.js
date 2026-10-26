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
    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
      [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
      emptyIndex = index;
      moves++;
      movesSpan.textContent = moves;
      renderBoard();
      checkWin();
    }
  }

  function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] !== i + 1) return;
    }
    if (tiles[tiles.length - 1] !== 0) return;
    gameActive = false;
    clearInterval(timerInterval);
    winMessage.style.display = 'block';
  }

  function startNewGame() {
    clearInterval(timerInterval);
    seconds = 0;
    moves = 0;
    movesSpan.textContent = '0';
    timeSpan.textContent = '0s';
    winMessage.style.display = 'none';
    tiles = generatePuzzle();
    emptyIndex = tiles.indexOf(0);
    gameActive = true;
    renderBoard();
    timerInterval = setInterval(() => {
      seconds++;
      timeSpan.textContent = seconds + 's';
    }, 1000);
  }

  playAgainBtn.addEventListener('click', startNewGame);

  startNewGame();
}
}