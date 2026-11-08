function init_gdde7cd56_7(container) {
const nmSize = 4;
let nmGrid = [];
let nmCurrent = { r: 0, c: 0 };
let nmTarget = { r: 3, c: 3 };
let nmScore = 0;
let nmSteps = 0;
let nmGameOver = false;

const container = document.querySelector('.nm-container');
const nmGridEl = container.querySelector('.nm-grid');
const nmScoreEl = container.querySelector('.nm-score span');
const nmStepsEl = container.querySelector('.nm-steps span');
const nmMessageEl = container.querySelector('.nm-message');
const nmResetBtn = container.querySelector('.nm-reset-btn');

function nmInitGame() {
  nmScore = 0;
  nmSteps = 0;
  nmGameOver = false;
  nmCurrent = { r: 0, c: 0 };
  nmTarget = { r: nmSize - 1, c: nmSize - 1 };
  nmGenerateGrid();
  nmUpdateUI();
  nmRenderGrid();
  nmMessageEl.textContent = '使用方向键或点击移动，收集数字并到达目标';
  nmMessageEl.className = 'nm-message';
}

function nmGenerateGrid() {
  nmGrid = [];
  for (let r = 0; r < nmSize; r++) {
    nmGrid[r] = [];
    for (let c = 0; c < nmSize; c++) {
      nmGrid[r][c] = { value: 0, blocked: false, visited: false };
    }
  }
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const positions = [];
  for (let r = 0; r < nmSize; r++) {
    for (let c = 0; c < nmSize; c++) {
      positions.push({ r, c });
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const numCount = Math.floor(Math.random() * 3) + 10;
  for (let i = 0; i < numCount && i < positions.length; i++) {
    const pos = positions[i];
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    nmGrid[pos.r][pos.c].value = num;
  }
  nmGrid[0][0].value = 1;
  nmGrid[nmSize - 1][nmSize - 1].value = 9;
  const blockedCount = 2 + Math.floor(Math.random() * 2);
  let placed = 0;
  let attempts = 0;
  const maxAttempts = 100;
  while (placed < blockedCount && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * nmSize);
    const c = Math.floor(Math.random() * nmSize);
    if ((r === 0 && c === 0) || (r === nmSize - 1 && c === nmSize - 1)) continue;
    if (!nmGrid[r][c].blocked && nmGrid[r][c].value === 0) {
      nmGrid[r][c].blocked = true;
      placed++;
    }
  }
  nmGrid[0][0].visited = true;
}

function nmRenderGrid() {
  nmGridEl.innerHTML = '';
  for (let r = 0; r < nmSize; r++) {
    for (let c = 0; c < nmSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'nm-cell';
      if (nmGrid[r][c].blocked) {
        cell.classList.add('nm-blocked');
      } else {
        cell.textContent = nmGrid[r][c].value;
        if (nmGrid[r][c].visited) {
          cell.classList.add('nm-visited');
        }
        if (r === nmCurrent.r && c === nmCurrent.c) {
          cell.classList.add('nm-current');
        }
        if (r === nmTarget.r && c === nmTarget.c) {
          cell.classList.add('nm-target');
        }
      }
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('click', () => nmHandleCellClick(r, c));
      nmGridEl.appendChild(cell);
    }
  }
}

function nmHandleCellClick(r, c) {
  if (nmGameOver) return;
  const dr = r - nmCurrent.r;
  const dc = c - nmCurrent.c;
  if (Math.abs(dr) + Math.abs(dc) !== 1) return;
  nmMove(r, c);
}

function nmMove(r, c) {
  if (nmGameOver) return;
  if (r < 0 || r >= nmSize || c < 0 || c >= nmSize) return;
  if (nmGrid[r][c].blocked) return;
  nmCurrent = { r, c };
  nmSteps++;
  if (!nmGrid[r][c].visited) {
    nmGrid[r][c].visited = true;
    nmScore += nmGrid[r][c].value;
  }
  nmUpdateUI();
  nmRenderGrid();
  if (r === nmTarget.r && c === nmTarget.c) {
    nmGameOver = true;
    nmMessageEl.textContent = `恭喜！你到达了终点！得分：${nmScore}，步数：${nmSteps}`;
    nmMessageEl.className = 'nm-message nm-win';
  }
}

function nmUpdateUI() {
  nmScoreEl.textContent = nmScore;
  nmStepsEl.textContent = nmSteps;
}

function nmHandleKeydown(e) {
  if (nmGameOver) return;
  const keyMap = {
    ArrowUp: { dr: -1, dc: 0 },
    ArrowDown: { dr: 1, dc: 0 },
    ArrowLeft: { dr: 0, dc: -1 },
    ArrowRight: { dr: 0, dc: 1 },
    w: { dr: -1, dc: 0 },
    s: { dr: 1, dc: 0 },
    a: { dr: 0, dc: -1 },
    d: { dr: 0, dc: 1 },
    W: { dr: -1, dc: 0 },
    S: { dr: 1, dc: 0 },
    A: { dr: 0, dc: -1 },
    D: { dr: 0, dc: 1 }
  };
  const move = keyMap[e.key];
  if (move) {
    e.preventDefault();
    const nr = nmCurrent.r + move.dr;
    const nc = nmCurrent.c + move.dc;
    nmMove(nr, nc);
  }
}

nmResetBtn.addEventListener('click', nmInitGame);
document.addEventListener('keydown', nmHandleKeydown);

nmInitGame();
}