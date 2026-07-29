// ========================= 数独游戏 =========================
function initSudoku(container) {
  const solution = Array.from({length:9}, () => Array(9).fill(0));
  function isValid(b, r, c, n) {
    for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
    const sr = Math.floor(r/3)*3, sc = Math.floor(c/3)*3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[sr+i][sc+j] === n) return false;
    return true;
  }
  (function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (solution[r][c] === 0) {
          const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random()-0.5);
          for (const n of nums) {
            if (isValid(solution, r, c, n)) { solution[r][c] = n; if (solve()) return true; solution[r][c] = 0; }
          }
          return false;
        }
      }
    }
    return true;
  })();

  const puzzle = solution.map(r => [...r]);
  const cells = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r,c]);
  cells.sort(() => Math.random()-0.5);
  // 后41个格子保留数字（given），前40个挖空让玩家填
  const given = new Set();
  for (const [r,c] of cells.slice(40)) given.add(r*9+c);
  for (const [r,c] of cells.slice(0, 40)) puzzle[r][c] = 0;

  let selectedR = -1, selectedC = -1;
  const playerBoard = puzzle.map(r => [...r]);

  function render() {
    let html = '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">';
    html += '<div class="sudoku-board">';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let cls = 'sudoku-cell';
        if (c % 3 === 2 && c < 8) cls += ' br-right';
        if (r % 3 === 2 && r < 8) cls += ' br-bottom';
        if (given.has(r*9+c)) cls += ' given';
        if (r === selectedR && c === selectedC) cls += ' selected';
        if (playerBoard[r][c] !== 0 && playerBoard[r][c] !== solution[r][c] && !given.has(r*9+c)) cls += ' error';
        html += '<div class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + (playerBoard[r][c] || '') + '</div>';
      }
    }
    html += '</div>';
    html += '<div class="sudoku-numpad">';
    for (let i = 1; i <= 9; i++) html += '<button data-num="' + i + '">' + i + '</button>';
    html += '<button class="erase" data-num="0">✕</button>';
    html += '</div>';
    const done = playerBoard.every((row, r) => row.every((v, c) => v === solution[r][c]));
    if (done) html += '<div class="maze-win">🎉 恭喜完成数独！你太聪明了！ 🎉</div>';
    html += '<button class="btn" onclick="initSudoku(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 新题目</button>';
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.sudoku-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
        if (given.has(r*9+c)) return;
        selectedR = r; selectedC = c;
        render();
      });
    });
    container.querySelectorAll('.sudoku-numpad button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (selectedR < 0) return;
        playerBoard[selectedR][selectedC] = parseInt(btn.dataset.num);
        render();
      });
    });
  }
  render();
}
// === wordsearch ===