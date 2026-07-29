// ========================= 迷宫游戏 =========================
function initMaze(container) {
  const w = 21, h = 15;
  const maze = generateMaze(w, h);
  let px = 1, py = 1;
  const ex = w - 2, ey = h - 2;
  maze[1][0] = 2; maze[h-2][w-1] = 3;
  let won = false;

  function render() {
    let html = '<div class="maze-container"><div class="maze-grid" style="grid-template-columns: repeat(' + w + ', 20px);">';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let cls = 'maze-cell '; let txt = '';
        if (x === px && y === py) { cls += 'player'; txt = '🙂'; }
        else if (maze[y][x] === 3) { cls += 'exit'; txt = '🚪'; }
        else if (maze[y][x] === 2) { cls += 'entry'; txt = '▶'; }
        else if (maze[y][x] === 1) { cls += 'wall'; txt = ''; }
        else { cls += 'path'; }
        html += '<div class="' + cls + '">' + txt + '</div>';
      }
    }
    html += '</div>';
    if (won) html += '<div class="maze-win">🎉 恭喜通关！你太厉害了！ 🎉</div>';
    html += '<div class="maze-controls">⬆⬇⬅➡ 方向键移动 &nbsp;|&nbsp; <button class="btn small" onclick="initMaze(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 新迷宫</button></div>';
    html += '</div>';
    container.innerHTML = html;
  }

  document.removeEventListener('keydown', mazeKeyHandler);
  mazeKeyHandler = function(e) {
    if (!$('#overlay').classList.contains('active')) return;
    if (won) return;
    let nx = px, ny = py;
    if (e.key === 'ArrowUp') ny--; else if (e.key === 'ArrowDown') ny++;
    else if (e.key === 'ArrowLeft') nx--; else if (e.key === 'ArrowRight') nx++;
    else return;
    e.preventDefault();
    if (nx >= 0 && nx < w && ny >= 0 && ny < h && maze[ny][nx] !== 1) {
      px = nx; py = ny;
      if (maze[ny][nx] === 3) won = true;
      render();
    }
  };
  document.addEventListener('keydown', mazeKeyHandler);
  render();
}

let mazeKeyHandler = null;

function generateMaze(w, h) {
  const maze = Array.from({length: h}, () => Array(w).fill(1));
  function carve(x, y) {
    maze[y][x] = 0;
    const dirs = [[0,2],[2,0],[0,-2],[-2,0]].sort(() => Math.random() - 0.5);
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < w-1 && ny > 0 && ny < h-1 && maze[ny][nx] === 1) {
        maze[y + dy/2][x + dx/2] = 0;
        carve(nx, ny);
      }
    }
  }
  carve(1, 1);
  maze[1][0] = 2; maze[h-2][w-1] = 3;
  return maze;
}
// === memory ===