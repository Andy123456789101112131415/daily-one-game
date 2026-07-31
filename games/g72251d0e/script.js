function init_g72251d0e(container) {
function(container) {
  const BOARD_SIZE = 10;
  const MINE_COUNT = 15;
  let board = [];
  let revealed = [];
  let flagged = [];
  let gameOver = false;
  let firstClick = true;

  function init() {
    container.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'ms-header';
    const title = document.createElement('div');
    title.className = 'ms-title';
    title.textContent = '扫雷';
    const controls = document.createElement('div');
    controls.className = 'ms-controls';
    const restartBtn = document.createElement('button');
    restartBtn.className = 'ms-btn';
    restartBtn.textContent = '🔄 重来';
    restartBtn.addEventListener('click', init);
    controls.appendChild(restartBtn);
    header.appendChild(title);
    header.appendChild(controls);
    container.appendChild(header);

    const boardEl = document.createElement('div');
    boardEl.className = 'ms-board';
    boardEl.style.gridTemplateColumns = 'repeat(' + BOARD_SIZE + ', 32px)';
    container.appendChild(boardEl);

    const status = document.createElement('div');
    status.className = 'ms-status';
    status.innerHTML = '<span id="ms-mines-left">' + MINE_COUNT + '</span> 颗雷 | <span id="ms-flagged-count">0</span> 标记 | <span id="ms-state">进行中</span>';
    container.appendChild(status);

    board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    revealed = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
    flagged = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
    gameOver = false;
    firstClick = true;

    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = document.createElement('div');
        cell.className = 'ms-cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.addEventListener('click', function(e) { handleClick(parseInt(this.dataset.x), parseInt(this.dataset.y)); });
        cell.addEventListener('contextmenu', function(e) { e.preventDefault(); handleRightClick(parseInt(this.dataset.x), parseInt(this.dataset.y)); });
        boardEl.appendChild(cell);
      }
    }
    updateStatus();
  }

  function placeMines(cx, cy) {
    let placed = 0;
    while (placed < MINE_COUNT) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      if (board[y][x] === -1) continue;
      if (Math.abs(x - cx) <= 1 && Math.abs(y - cy) <= 1) continue;
      board[y][x] = -1;
      placed++;
    }
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[y][x] === -1) continue;
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === -1) count++;
          }
        }
        board[y][x] = count;
      }
    }
  }

  function getCell(x, y) {
    return container.querySelector('.ms-board').children[y * BOARD_SIZE + x];
  }

  function handleClick(x, y) {
    if (gameOver) return;
    if (flagged[y][x]) return;
    if (revealed[y][x]) return;

    if (firstClick) {
      placeMines(x, y);
      firstClick = false;
    }

    if (board[y][x] === -1) {
      gameOver = true;
      revealAll();
      getCell(x, y).classList.add('mine-hit');
      document.getElementById('ms-state').textContent = '失败';
      return;
    }

    reveal(x, y);
    checkWin();
  }

  function handleRightClick(x, y) {
    if (gameOver) return;
    if (revealed[y][x]) return;
    flagged[y][x] = !flagged[y][x];
    const cell = getCell(x, y);
    if (flagged[y][x]) {
      cell.textContent = '🚩';
      cell.classList.add('flagged');
    } else {
      cell.textContent = '';
      cell.classList.remove('flagged');
    }
    updateStatus();
  }

  function reveal(x, y) {
    if (revealed[y][x]) return;
    revealed[y][x] = true;
    const cell = getCell(x, y);
    if (flagged[y][x]) {
      flagged[y][x] = false;
      cell.textContent = '';
      cell.classList.remove('flagged');
    }
    cell.classList.add('revealed');
    if (board[y][x] > 0) {
      cell.textContent = board[y][x];
      cell.classList.add('n' + board[y][x]);
    } else if (board[y][x] === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && !revealed[ny][nx]) {
            reveal(nx, ny);
          }
        }
      }
    }
    updateStatus();
  }

  function revealAll() {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[y][x] === -1) {
          const cell = getCell(x, y);
          cell.textContent = '💣';
          cell.classList.add('mine');
          cell.classList.add('revealed');
        } else if (!revealed[y][x]) {
          revealed[y][x] = true;
          const cell = getCell(x, y);
          cell.classList.add('revealed');
          if (board[y][x] > 0) {
            cell.textContent = board[y][x];
            cell.classList.add('n' + board[y][x]);
          }
        }
      }
    }
  }

  function checkWin() {
    let countRevealed = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (revealed[y][x]) countRevealed++;
      }
    }
    if (countRevealed === BOARD_SIZE * BOARD_SIZE - MINE_COUNT) {
      gameOver = true;
      document.getElementById('ms-state').textContent = '胜利';
      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
          if (board[y][x] === -1 && !flagged[y][x]) {
            flagged[y][x] = true;
            const cell = getCell(x, y);
            cell.textContent = '🚩';
            cell.classList.add('flagged');
          }
        }
      }
    }
  }

  function updateStatus() {
    let flaggedCount = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (flagged[y][x]) flaggedCount++;
      }
    }
    document.getElementById('ms-mines-left').textContent = MINE_COUNT - flaggedCount;
    document.getElementById('ms-flagged-count').textContent = flaggedCount;
  }

  init();
}
}