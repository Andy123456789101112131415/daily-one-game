function init_g024c11de(container) {
function(container) {
  var grid = [];
  var score = 0;
  var gameOver = false;
  var gridEl, scoreEl, messageEl;

  function init() {
    container.innerHTML = '<div class="game2048-modal"><div class="game2048-header"><div class="game2048-thumb"><svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="2" fill="#7c3aed"/><text x="8" y="10" font-size="6" fill="white" text-anchor="middle">2</text><rect x="18" y="2" width="12" height="12" rx="2" fill="#06b6d4"/><text x="24" y="10" font-size="6" fill="white" text-anchor="middle">4</text><rect x="34" y="2" width="12" height="12" rx="2" fill="#10b981"/><text x="40" y="10" font-size="6" fill="white" text-anchor="middle">8</text><rect x="34" y="18" width="12" height="12" rx="2" fill="#f59e0b"/><text x="40" y="26" font-size="6" fill="white" text-anchor="middle">16</text><rect x="18" y="18" width="12" height="12" rx="2" fill="#ef4444"/><text x="24" y="26" font-size="6" fill="white" text-anchor="middle">32</text><rect x="2" y="18" width="12" height="12" rx="2" fill="#7c3aed"/><text x="8" y="26" font-size="6" fill="white" text-anchor="middle">64</text><rect x="2" y="34" width="12" height="12" rx="2" fill="#06b6d4"/><text x="8" y="42" font-size="6" fill="white" text-anchor="middle">128</text><rect x="18" y="34" width="12" height="12" rx="2" fill="#10b981"/><text x="24" y="42" font-size="6" fill="white" text-anchor="middle">256</text><rect x="34" y="34" width="12" height="12" rx="2" fill="#f59e0b"/><text x="40" y="42" font-size="6" fill="white" text-anchor="middle">512</text></svg></div><div class="game2048-info"><h2 class="game2048-title">2048 数字合并</h2><p class="game2048-tags">滑动合并</p></div></div><div class="game2048-score"><span class="game2048-score-value">Score: 0</span><button class="game2048-restart">🔄 重来</button></div><div class="game2048-grid"></div><div class="game2048-message"></div></div>';
    gridEl = container.querySelector('.game2048-grid');
    scoreEl = container.querySelector('.game2048-score-value');
    messageEl = container.querySelector('.game2048-message');
    container.querySelector('.game2048-restart').addEventListener('click', restart);
    document.addEventListener('keydown', handleKey);
    restart();
  }

  function restart() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameOver = false;
    messageEl.textContent = '';
    addRandomTile();
    addRandomTile();
    updateGrid();
  }

  function addRandomTile() {
    var empty = [];
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        if (grid[r][c] === 0) empty.push({r: r, c: c});
      }
    }
    if (empty.length === 0) return;
    var pos = empty[Math.floor(Math.random() * empty.length)];
    grid[pos.r][pos.c] = Math.random() < 0.9 ? 2 : 4;
  }

  function updateGrid() {
    scoreEl.textContent = 'Score: ' + score;
    gridEl.innerHTML = '';
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var cell = document.createElement('div');
        cell.className = 'game2048-cell';
        var val = grid[r][c];
        if (val !== 0) {
          cell.textContent = val;
          cell.classList.add('game2048-cell-' + val);
        }
        gridEl.appendChild(cell);
      }
    }
    if (gameOver) {
      messageEl.textContent = '游戏结束！';
      messageEl.className = 'game2048-message lose';
    } else if (checkWin()) {
      messageEl.textContent = '恭喜你赢了！';
      messageEl.className = 'game2048-message';
    }
  }

  function checkWin() {
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        if (grid[r][c] === 2048) return true;
      }
    }
    return false;
  }

  function handleKey(e) {
    if (gameOver) return;
    var moved = false;
    switch (e.key) {
      case 'ArrowUp': moved = moveUp(); break;
      case 'ArrowDown': moved = moveDown(); break;
      case 'ArrowLeft': moved = moveLeft(); break;
      case 'ArrowRight': moved = moveRight(); break;
      default: return;
    }
    e.preventDefault();
    if (moved) {
      addRandomTile();
      updateGrid();
      if (!canMove()) {
        gameOver = true;
        updateGrid();
      }
    }
  }

  function slide(row) {
    var arr = row.filter(v => v !== 0);
    var newArr = [];
    var i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] === arr[i+1]) {
        newArr.push(arr[i] * 2);
        score += arr[i] * 2;
        i += 2;
      } else {
        newArr.push(arr[i]);
        i++;
      }
    }
    while (newArr.length < 4) newArr.push(0);
    return newArr;
  }

  function moveLeft() {
    var changed = false;
    for (var r = 0; r < 4; r++) {
      var oldRow = grid[r].slice();
      var newRow = slide(grid[r]);
      if (oldRow.join(',') !== newRow.join(',')) changed = true;
      grid[r] = newRow;
    }
    return changed;
  }

  function moveRight() {
    var changed = false;
    for (var r = 0; r < 4; r++) {
      var oldRow = grid[r].slice();
      var reversed = grid[r].slice().reverse();
      var newRow = slide(reversed);
      newRow.reverse();
      if (oldRow.join(',') !== newRow.join(',')) changed = true;
      grid[r] = newRow;
    }
    return changed;
  }

  function moveUp() {
    var changed = false;
    for (var c = 0; c < 4; c++) {
      var col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      var oldCol = col.slice();
      var newCol = slide(col);
      if (oldCol.join(',') !== newCol.join(',')) changed = true;
      for (var r = 0; r < 4; r++) grid[r][c] = newCol[r];
    }
    return changed;
  }

  function moveDown() {
    var changed = false;
    for (var c = 0; c < 4; c++) {
      var col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      var reversed = col.slice().reverse();
      var newCol = slide(reversed);
      newCol.reverse();
      var oldCol = col.slice();
      if (oldCol.join(',') !== newCol.join(',')) changed = true;
      for (var r = 0; r < 4; r++) grid[r][c] = newCol[r];
    }
    return changed;
  }

  function canMove() {
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return true;
        if (c < 3 && grid[r][c] === grid[r][c+1]) return true;
        if (r < 3 && grid[r][c] === grid[r+1][c]) return true;
      }
    }
    return false;
  }

  init();
}
}