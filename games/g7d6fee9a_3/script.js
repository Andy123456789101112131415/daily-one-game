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

  function move(direction) {
    if (gameOver || (won && !keepPlaying)) return;
    let moved = false;
    const vectors = {
      up: { dr: -1, dc: 0 },
      down: { dr: 1, dc: 0 },
      left: { dr: 0, dc: -1 },
      right: { dr: 0, dc: 1 }
    };
    const { dr, dc } = vectors[direction];
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
      if (won && !keepPlaying) {
        showOverlay('You Win!', 'win');
        messageEl.textContent = '恭喜达到2048！';
        messageEl.className = 'g2048-message win';
      } else if (isGameOver()) {
        gameOver = true;
        showOverlay('Game Over', 'lose');
        messageEl.textContent = '游戏结束，再来一局吧！';
        messageEl.className = 'g2048-message lose';
      }
    }
  }

  function buildTraversals(dr, dc) {
    const r = [], c = [];
    for (let i = 0; i < size; i++) {
      r.push(i);
      c.push(i);
    }
    if (dr > 0) r.reverse();
    if (dc > 0) c.reverse();
    return { r, c };
  }

  function isGameOver() {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0) return false;
        if (r < size - 1 && board[r][c] === board[r + 1][c]) return false;
        if (c < size - 1 && board[r][c] === board[r][c + 1]) return false;
      }
    }
    return true;
  }

  function showOverlay(text, type) {
    overlayText.textContent = text;
    overlayText.className = 'g2048-overlay-text ' + type;
    overlayEl.classList.add('active');
  }

  function handleKey(e) {
    const key = e.key;
    let dir = null;
    if (key === 'ArrowUp' || key === 'w' || key === 'W') dir = 'up';
    else if (key === 'ArrowDown' || key === 's' || key === 'S') dir = 'down';
    else if (key === 'ArrowLeft' || key === 'a' || key === 'A') dir = 'left';
    else if (key === 'ArrowRight' || key === 'd' || key === 'D') dir = 'right';
    if (dir) {
      e.preventDefault();
      move(dir);
    }
  }

  function handleRestart() {
    initBoard();
    overlayEl.classList.remove('active');
  }

  function handleOverlayClick() {
    if (won && !keepPlaying) {
      keepPlaying = true;
      overlayEl.classList.remove('active');
      messageEl.textContent = '';
      messageEl.className = 'g2048-message';
    }
  }

  function handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    if (absDx > absDy) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  container.addEventListener('keydown', handleKey);
  restartBtn.addEventListener('click', handleRestart);
  overlayEl.addEventListener('click', handleOverlayClick);
  gridEl.addEventListener('touchstart', handleTouchStart, { passive: true });
  gridEl.addEventListener('touchend', handleTouchEnd, { passive: true });

  container.tabIndex = 0;
  container.focus();

  createGrid();
  initBoard();

  return () => {
    container.removeEventListener('keydown', handleKey);
    restartBtn.removeEventListener('click', handleRestart);
    overlayEl.removeEventListener('click', handleOverlayClick);
    gridEl.removeEventListener('touchstart', handleTouchStart);
    gridEl.removeEventListener('touchend', handleTouchEnd);
  };
}
}