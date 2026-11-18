function init_gd07d6fd5_9(container) {
function initGame(container) {
  const size = 4;
  let board = [];
  let emptyPos = { r: 0, c: 0 };
  let moves = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameWon = false;
  let started = false;

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
    stopTimer();
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

  function isSolvable(arr) {
    let inversions = 0;
    const flat = arr.filter(v => v !== 0);
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        if (flat[i] > flat[j]) inversions++;
      }
    }
    const emptyRowFromBottom = size - Math.floor(arr.indexOf(0) / size);
    if (size % 2 === 1) {
      return inversions % 2 === 0;
    }
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }

  function shuffleBoard() {
    const total = size * size;
    do {
      board = [];
      for (let i = 0; i < total - 1; i++) board.push(i + 1);
      board.push(0);
      for (let i = board.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [board[i], board[j]] = [board[j], board[i]];
      }
    } while (isSolved() || !isSolvable(board));
    const idx = board.indexOf(0);
    emptyPos.r = Math.floor(idx / size);
    emptyPos.c = idx % size;
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
        cell.textContent = String(val);
        cell.dataset.index = String(i);
        cell.addEventListener('click', () => handleCellClick(i));
      }
      boardDiv.appendChild(cell);
    }
  }

  function handleCellClick(index) {
    if (gameWon) return;
    const r = Math.floor(index / size);
    const c = index % size;
    const dr = Math.abs(r - emptyPos.r);
    const dc = Math.abs(c - emptyPos.c);
    if (dr + dc !== 1) return;
    if (!started) {
      started = true;
      startTimer();
    }
    board[emptyPos.r * size + emptyPos.c] = board[index];
    board[index] = 0;
    emptyPos.r = r;
    emptyPos.c = c;
    moves++;
    movesSpan.textContent = String(moves);
    renderBoard();
    if (isSolved()) {
      gameWon = true;
      stopTimer();
      winOverlay.classList.add('ns-show');
    }
  }

  function resetGame() {
    stopTimer();
    gameWon = false;
    started = false;
    moves = 0;
    seconds = 0;
    movesSpan.textContent = '0';
    timerSpan.textContent = formatTime(0);
    winOverlay.classList.remove('ns-show');
    shuffleBoard();
    renderBoard();
  }

  function handleKey(e) {
    if (gameWon) return;
    const key = e.key;
    let target = null;
    if (key === 'ArrowUp') target = { r: emptyPos.r + 1, c: emptyPos.c };
    else if (key === 'ArrowDown') target = { r: emptyPos.r - 1, c: emptyPos.c };
    else if (key === 'ArrowLeft') target = { r: emptyPos.r, c: emptyPos.c + 1 };
    else if (key === 'ArrowRight') target = { r: emptyPos.r, c: emptyPos.c - 1 };
    else return;
    if (target.r < 0 || target.r >= size || target.c < 0 || target.c >= size) return;
    e.preventDefault();
    handleCellClick(target.r * size + target.c);
  }

  restartBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);
  document.addEventListener('keydown', handleKey);

  const observer = new MutationObserver(() => {
    if (!document.body.contains(gameDiv)) {
      stopTimer();
      document.removeEventListener('keydown', handleKey);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  resetGame();
}
}