// ========================= Word Search（纯英文 + 按住拖拽选中） =========================
function initWordSearch(container) {
  const words = ['PYTHON','CODING','GITHUB','ALGORITHM','DEBUG','COMMIT','PUSH','BRANCH','MERGE','COMPILE','SCRIPT','STACK'];
  const size = 12;
  const grid = Array.from({length: size}, () => Array(size).fill(''));
  const dirs = [[1,0],[0,1],[1,1],[-1,1],[1,-1],[-1,0],[0,-1],[-1,-1]];
  const placedWords = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // 放置单词（长词优先，避免后期放不下）
  const shuffled = [...words].sort((a, b) => b.length - a.length || Math.random() - 0.5);
  for (const word of shuffled) {
    let placed = false;
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
      const len = word.length;
      const maxX = size - 1 - (len - 1) * Math.max(0, dx);
      const minX = (len - 1) * Math.max(0, -dx);
      const maxY = size - 1 - (len - 1) * Math.max(0, dy);
      const minY = (len - 1) * Math.max(0, -dy);
      if (minX > maxX || minY > maxY) continue;
      const x = minX + Math.floor(Math.random() * (maxX - minX + 1));
      const y = minY + Math.floor(Math.random() * (maxY - minY + 1));
      let ok = true;
      for (let i = 0; i < len; i++) {
        const cx = x + i * dx, cy = y + i * dy;
        if (grid[cy][cx] !== '' && grid[cy][cx] !== word[i]) { ok = false; break; }
      }
      if (ok) {
        for (let i = 0; i < len; i++) grid[y + i * dy][x + i * dx] = word[i];
        placedWords.push({word, positions: Array.from({length: len}, (_, i) => [y + i * dy, x + i * dx])});
        placed = true;
      }
    }
  }

  // 填充随机字母
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (!grid[y][x]) grid[y][x] = alphabet[Math.floor(Math.random() * 26)];

  const foundSet = new Set();
  let dragStart = null;     // [y, x]
  let dragCurrent = null;   // [y, x]
  let isDragging = false;

  // 计算从 (y0,x0) 到 (y1,x1) 的直线路径上所有格子
  function getLineCells(y0, x0, y1, x1) {
    const cells = [];
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    if (dx === 0 && dy === 0) return [[y0, x0]];
    const adx = Math.abs(x1 - x0);
    const ady = Math.abs(y1 - y0);
    if (dx !== 0 && dy !== 0 && adx !== ady) return [[y0, x0]];
    const steps = Math.max(adx, ady);
    for (let i = 0; i <= steps; i++) {
      const cy = y0 + i * dy;
      const cx = x0 + i * dx;
      if (cy >= 0 && cy < size && cx >= 0 && cx < size) cells.push([cy, cx]);
    }
    return cells;
  }

  function buildSelectingSet() {
    if (!dragStart || !dragCurrent) return new Set();
    const cells = getLineCells(dragStart[0], dragStart[1], dragCurrent[0], dragCurrent[1]);
    return new Set(cells.map(([y, x]) => y * size + x));
  }

  function render() {
    const selectingSet = buildSelectingSet();

    let html = '<div style="text-align:center;">';
    html += '<div class="ws-score">✅ Found: ' + foundSet.size + ' / ' + placedWords.length + '</div>';
    html += '<div class="word-list">';
    for (const pw of placedWords) {
      html += '<span class="word-tag' + (foundSet.has(pw.word) ? ' found' : '') + '">' + pw.word + '</span>';
    }
    html += '</div>';

    html += '<div class="wordsearch-grid" style="grid-template-columns: repeat(' + size + ', 32px);">';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let cls = 'wordsearch-cell';
        const key = y * size + x;

        let inFound = false;
        for (const fw of foundSet) {
          const pw = placedWords.find(p => p.word === fw);
          if (pw && pw.positions.some(p => p[0] === y && p[1] === x)) { inFound = true; break; }
        }

        if (inFound) cls += ' found';
        else if (selectingSet.has(key)) cls += ' selecting';

        html += '<div class="' + cls + '" data-y="' + y + '" data-x="' + x + '">' + grid[y][x] + '</div>';
      }
    }
    html += '</div>';

    if (foundSet.size === placedWords.length) {
      html += '<div class="maze-win">🎉 All words found! Great job! 🎉</div>';
    }

    html += '<button class="btn" style="margin-top:10px;" onclick="initWordSearch(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 New Puzzle</button>';
    html += '</div>';
    container.innerHTML = html;

    // ---- 拖拽事件绑定 ----
    const cells = container.querySelectorAll('.wordsearch-cell');

    cells.forEach(cell => {
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        dragStart = [parseInt(cell.dataset.y), parseInt(cell.dataset.x)];
        dragCurrent = [...dragStart];
        render();
      });
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || !el.classList.contains('wordsearch-cell')) return;
      const ny = parseInt(el.dataset.y), nx = parseInt(el.dataset.x);
      if (dragCurrent && dragCurrent[0] === ny && dragCurrent[1] === nx) return;

      if (dragStart) {
        const dx = nx - dragStart[1], dy = ny - dragStart[0];
        const adx = Math.abs(dx), ady = Math.abs(dy);
        if (dx === 0 || dy === 0 || adx === ady) {
          dragCurrent = [ny, nx];
        } else {
          // 智能吸附：优先斜向，其次水平/垂直
          const d = Math.min(adx, ady);
          dragCurrent = [dragStart[0] + Math.sign(dy) * d, dragStart[1] + Math.sign(dx) * d];
        }
      }
      render();
    });

    document.addEventListener('mouseup', onMouseUp);
    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;

      if (dragStart && dragCurrent) {
        const lineCells = getLineCells(dragStart[0], dragStart[1], dragCurrent[0], dragCurrent[1]);
        const selectedWord = lineCells.map(([y, x]) => grid[y][x]).join('');
        const reversedWord = [...selectedWord].reverse().join('');

        for (const pw of placedWords) {
          if ((pw.word === selectedWord || pw.word === reversedWord) && !foundSet.has(pw.word)) {
            foundSet.add(pw.word);
            break;
          }
        }
      }

      dragStart = null;
      dragCurrent = null;
      document.removeEventListener('mouseup', onMouseUp);
      render();
    }
  }
  render();
}