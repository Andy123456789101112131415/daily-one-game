function init_gd07d6fd5_9(container) {
function initGame(container) {
  let size = 4;
  let board = [];
  let emptyPos = { r: 0, c: 0 };
  let moves = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameWon = false;

  const gameDiv = document.createElement('div');
  gameDiv.className = 'ns-game';

  const header = document.createElement('div');
  header.className = 'ns-header';
  header.innerHTML = '<h2 class="ns-title">数字华容道</h2><div class="ns-stats"><div>步数 <span id="ns-moves">0</span></div><div>时间 <span id="ns-timer">00:00</span></div></div>';
  gameDiv.appendChild(header);

  const boardDiv = document.createElement('div');
  boardDiv.className = 'ns-board';
  gameDiv.appendChild(boardDiv);

  const controls = document.createElement('div');
  controls.className = 'ns-controls';
  const restartBtn = document.createElement('button');
  restartBtn.className = 'ns-btn ns-primary';
  restartBtn.textContent = '🔄 重来';
  controls.appendChild(restartBtn);
  gameDiv.appendChild(controls);

  const winOverlay = document.createElement('div');
  winOverlay.className = 'ns-win';
  winOverlay.innerHTML = '<div class="ns-win-content"><h2>🎉 胜利！</h2><p>你完成了拼图！</p><button class="ns-btn ns-primary" id="ns-play-again">再来一局</button></div>';
  gameDiv.appendChild(winOverlay);

  container.appendChild(gameDiv);

  const movesSpan = gameDiv.querySelector('#ns-moves');
  const timerSpan = gameDiv.querySelector('#ns-timer');
  const playAgainBtn = gameDiv.querySelector('#ns-play-again');

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return m + ':' + s;
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    seconds = 0;
    timerSpan.textContent = formatTime(seconds);
    timerInterval = setInterval(() => {
      seconds++;
      timerSpan.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function shuffleBoard() {
    const total = size * size;
    board = [];
    for (let i = 0; i < total - 1; i++) {
      board.push(i + 1);
    }
    board.push(0);
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
    emptyPos.r = Math.floor((total - 1) / size);
    emptyPos.c = (total - 1) % size;
    if (isSolved()) {
      shuffleBoard();
    }
  }

  function isSolved() {
    for (let i = 0; i < board.length - 1; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[board.length - 1] === 0;
  }

  function renderBoard() {
    boardDiv.innerHTML = '';
    for (let i = 0; i < board.length; i++) {
      const val = board[i];
      const cell = document.createElement('div');
      cell.className = 'ns-cell';
      if (val === 0) {
        cell.classList.add('ns-empty');
        cell.textContent = '';
      } else {
        cell.textContent = val;
        const r = Math.floor(i / size);
        const c = i % size;
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.addEventListener('click', () => tryMove(r, c));
      }
      boardDiv.appendChild(cell);
    }
  }

  function tryMove(r, c) {
    if (gameWon) return;
    const dr = Math.abs(r - emptyPos.r);
    const dc = Math.abs(c - emptyPos.c);
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      const emptyIndex = emptyPos.r * size + emptyPos.c;
      const tileIndex = r * size + c;
      board[emptyIndex] = board[tileIndex];
      board[tileIndex] = 0;
      emptyPos.r = r;
      emptyPos.c = c;
      moves++;
      movesSpan.textContent = moves;
      renderBoard();
      if (isSolved()) {
        gameWon = true;
        stopTimer();
        winOverlay.classList.add('ns-show');
      }
    }
  }

  function handleKey(e) {
    if (gameWon) return;
    let dr = 0, dc = 0;
    if (e.key === 'ArrowUp') dr = 1;
    else if (e.key === 'ArrowDown') dr = -1;
    else if (e.key === 'ArrowLeft') dc = 1;
    else if (e.key === 'ArrowRight') dc = -1;
    else return;
    e.preventDefault();
    const nr = emptyPos.r + dr;
    const nc = emptyPos.c + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      tryMove(nr, nc);
    }
  }

  function resetGame() {
    gameWon = false;
    moves = 0;
    movesSpan.textContent = '0';
    winOverlay.classList.remove('ns-show');
    shuffleBoard();
    renderBoard();
    stopTimer();
    startTimer();
  }

  restartBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);
  document.addEventListener('keydown', handleKey);

  resetGame();
}
}