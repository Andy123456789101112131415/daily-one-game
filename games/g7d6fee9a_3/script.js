function init_g7d6fee9a_3(container) {
function initGame(container) {
  let board = [];
  let score = 0;
  let gameOver = false;
  let won = false;
  let keepPlaying = false;
  const size = 4;
  const gridEl = container.querySelector('.g2048-grid');
  const scoreEl = container.querySelector('.g2048-score-value');
  const messageEl = container.querySelector('.g2048-message');
  const overlayEl = container.querySelector('.g2048-overlay');
  const overlayText = container.querySelector('.g2048-overlay-text');
  const restartBtn = container.querySelector('.g2048-btn');
  const overlayBtn = container.querySelector('.g2048-overlay .g2048-btn');
  let cells = [];

  function createGrid() {
    gridEl.innerHTML = '';
    cells = [];
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('div');
      cell.className = 'g2048-cell';
      gridEl.appendChild(cell);
      cells.push(cell);
    }
  }

  function updateGrid() {
    for (let i = 0; i < size * size; i++) {
      const val = board[Math.floor(i / size)][i % size];
      const cell = cells[i];
      if (val) {
        cell.textContent = val;
        cell.dataset.val = val;
      } else {
        cell.textContent = '';
        delete cell.dataset.val;
      }
    }
    scoreEl.textContent = score;
  }

  function addRandomTile() {
    const empty = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function initBoard() {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    gameOver = false;
    won = false;
    keepPlaying = false;
    messageEl.textContent = '';
    messageEl.className = 'g2048-message';
    overlayEl.classList.remove('active');
    addRandomTile();
    addRandomTile();
    updateGrid();
  }

  function buildTraversals(dr, dc) {
    const rows = [];
    const cols = [];
    for (let i = 0; i < size; i++) { rows.push(i); cols.push(i); }
    if (dr > 0) rows.reverse();
    if (dc > 0) cols.reverse();
    return { r: rows, c: cols };
  }

  function canMove() {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0) return true;
        if (c + 1 < size && board[r][c] === board[r][c + 1]) return true;
        if (r + 1 < size && board[r][c] === board[r + 1][c]) return true;
      }
    }
    return false;
  }

  function move(direction) {
    if (gameOver || (won && !keepPlaying)) return;
    let moved = false;
    const vectors = {
      up: { dr: -1, dc: 0 },
      down: { dr: 1, dc: 0 },
      left: { dr: 0, dc: -1 },
      right: { dr: 0, dc: 1 }
    };
    const vec = vectors[direction];
    if (!vec) return;
    const { dr, dc } = vec;
    const traversals = buildTraversals(dr, dc);
    const merged = Array.from({ length: size }, () => Array(size).fill(false));

    traversals.r.forEach(r => {
      traversals.c.forEach(c => {
        const val = board[r][c];
        if (val === 0) return;
        let nr = r, nc = c;
        while (true) {
          const tr = nr + dr, tc = nc + dc;
          if (tr < 0 || tr >= size || tc < 0 || tc >= size) break;
          if (board[tr][tc] === 0) {
            board[tr][tc] = val;
            board[nr][nc] = 0;
            nr = tr; nc = tc;
            moved = true;
          } else if (board[tr][tc] === val && !merged[tr][tc]) {
            board[tr][tc] = val * 2;
            board[nr][nc] = 0;
            merged[tr][tc] = true;
            score += val * 2;
            moved = true;
            if (val * 2 === 2048 && !won) {
              won = true;
              messageEl.textContent = '你赢了！';
              overlayText.textContent = '你赢了！';
              overlayEl.classList.add('active');
            }
            break;
          } else {
            break;
          }
        }
      });
    });

    if (moved) {
      addRandomTile();
      updateGrid();
      if (!canMove()) {
        gameOver = true;
        messageEl.textContent = '游戏结束';
        overlayText.textContent = '游戏结束';
        overlayEl.classList.add('active');
      }
    }
  }

  function handleKey(e) {
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
    const dir = map[e.key];
    if (dir) {
      e.preventDefault();
      move(dir);
    }
  }

  function handleOverlayClick() {
    if (won && !keepPlaying) {
      keepPlaying = true;
      overlayEl.classList.remove('active');
      messageEl.textContent = '';
    } else {
      initBoard();
    }
  }

  createGrid();
  initBoard();
  document.addEventListener('keydown', handleKey);
  restartBtn.addEventListener('click', initBoard);
  if (overlayBtn) overlayBtn.addEventListener('click', handleOverlayClick);

  return function destroy() {
    document.removeEventListener('keydown', handleKey);
    restartBtn.removeEventListener('click', initBoard);
    if (overlayBtn) overlayBtn.removeEventListener('click', handleOverlayClick);
  };
}
}