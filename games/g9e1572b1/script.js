function init_g9e1572b1(container) {
function(container){
  // state
  let tiles = []; // 1-8 and 0 for empty
  let emptyIndex = 8;
  let moves = 0;
  let gameOver = false;

  // create DOM
  container.classList.add('hdr-container');
  container.innerHTML = `
    <div class="hdr-header">
      <div class="hdr-thumb"><svg viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'><rect width='56' height='56' fill='#f8f9fc'/><rect x='4' y='4' width='48' height='48' rx='4' fill='#fff' stroke='#e2e8f0'/><rect x='4' y='4' width='16' height='16' fill='#7c3aed'/><rect x='20' y='4' width='16' height='16' fill='#06b6d4'/><rect x='36' y='4' width='16' height='16' fill='#10b981'/><rect x='4' y='20' width='16' height='16' fill='#f59e0b'/><rect x='20' y='20' width='16' height='16' fill='#ef4444'/><rect x='36' y='20' width='16' height='16' fill='#8b5cf6'/><rect x='4' y='36' width='16' height='16' fill='#ec4899'/><rect x='20' y='36' width='16' height='16' fill='#14b8a6'/><rect x='36' y='36' width='16' height='16' fill='#f97316'/></svg></div>
      <div>
        <div class="hdr-title">华容道拼图</div>
        <div class="hdr-tag">滑块拼图</div>
      </div>
    </div>
    <div class="hdr-controls">
      <span class="hdr-moves">步数: <span id="hdr-moves-count">0</span></span>
      <button class="hdr-btn" id="hdr-restart-btn">重新开始</button>
    </div>
    <div class="hdr-board" id="hdr-board"></div>
    <div class="hdr-win-overlay" id="hdr-win-overlay">
      <div class="hdr-win-card">
        <h2>🎉 恭喜完成！</h2>
        <p>你用了 <span id="hdr-final-moves">0</span> 步</p>
        <button class="hdr-btn" id="hdr-play-again-btn">再玩一次</button>
      </div>
    </div>
  `;

  const board = container.querySelector('#hdr-board');
  const movesSpan = container.querySelector('#hdr-moves-count');
  const restartBtn = container.querySelector('#hdr-restart-btn');
  const winOverlay = container.querySelector('#hdr-win-overlay');
  const finalMoves = container.querySelector('#hdr-final-moves');
  const playAgainBtn = container.querySelector('#hdr-play-again-btn');

  // functions
  function shuffle() {
    // start from sorted, do 100 random valid moves to ensure solvable
    tiles = [1,2,3,4,5,6,7,8,0];
    emptyIndex = 8;
    for (let i=0; i<100; i++) {
      const neighbors = getNeighbors(emptyIndex);
      const rand = Math.floor(Math.random() * neighbors.length);
      swap(emptyIndex, neighbors[rand]);
      moves = 0;
      updateMovesDisplay();
    }
  }

  function getNeighbors(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const neighbors = [];
    if (row > 0) neighbors.push(index - 3);
    if (row < 2) neighbors.push(index + 3);
    if (col > 0) neighbors.push(index - 1);
    if (col < 2) neighbors.push(index + 1);
    return neighbors;
  }

  function swap(i, j) {
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    emptyIndex = j;
    moves++;
    updateMovesDisplay();
    renderBoard();
    checkWin();
  }

  function renderBoard() {
    board.innerHTML = '';
    for (let i=0; i<9; i++) {
      const value = tiles[i];
      const tile = document.createElement('button');
      tile.className = 'hdr-tile' + (value === 0 ? ' hdr-empty' : '');
      tile.textContent = value === 0 ? '' : value;
      tile.addEventListener('click', () => {
        if (gameOver) return;
        if (value === 0) return;
        const idx = tiles.indexOf(value);
        const neighbors = getNeighbors(emptyIndex);
        if (neighbors.includes(idx)) {
          swap(idx, emptyIndex);
        }
      });
      board.appendChild(tile);
    }
  }

  function checkWin() {
    if (tiles.every((v, i) => v === i+1 || (i===8 && v===0))) {
      gameOver = true;
      finalMoves.textContent = moves;
      winOverlay.classList.add('hdr-show');
    }
  }

  function resetGame() {
    gameOver = false;
    winOverlay.classList.remove('hdr-show');
    shuffle();
    moves = 0;
    updateMovesDisplay();
    renderBoard();
  }

  function updateMovesDisplay() {
    movesSpan.textContent = moves;
  }

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    let delta = 0;
    if (e.key === 'ArrowUp') delta = -3;
    else if (e.key === 'ArrowDown') delta = 3;
    else if (e.key === 'ArrowLeft') delta = -1;
    else if (e.key === 'ArrowRight') delta = 1;
    else return;

    const newIndex = emptyIndex + delta;
    // check boundaries
    if (newIndex < 0 || newIndex > 8) return;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    const newRow = Math.floor(newIndex / 3);
    const newCol = newIndex % 3;
    if (Math.abs(emptyRow - newRow) + Math.abs(emptyCol - newCol) !== 1) return;
    swap(newIndex, emptyIndex);
  });

  // event listeners
  restartBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);

  // init
  resetGame();
}
}