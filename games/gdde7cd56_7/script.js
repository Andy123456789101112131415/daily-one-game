function init_gdde7cd56_7(container) {
const nmSize = 4;
let nmGrid = [];
let nmCurrent = { r: 0, c: 0 };
let nmTarget = { r: 3, c: 3 };
let nmScore = 0;
let nmSteps = 0;
let nmGameOver = false;

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
  nmUpdateUI();
  nmGenerateGrid();
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
  // 随机放置数字1-9，每个数字出现1-2次，总共10-12个数字
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const positions = [];
  for (let r = 0; r < nmSize; r++) {
    for (let c = 0; c < nmSize; c++) {
      positions.push({ r, c });
    }
  }
  // 打乱位置
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  // 选择10-12个位置放置数字
  const numCount = Math.floor(Math.random() * 3) + 10; // 10-12
  for (let i = 0; i < numCount && i < positions.length; i++) {
    const pos = positions[i];
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    nmGrid[pos.r][pos.c].value = num;
  }
  // 确保起点和终点有数字
  nmGrid[0][0].value = 1;
  nmGrid[nmSize - 1][nmSize - 1].value = 9;
  // 随机放置障碍
  const blockedCount = 2 + Math.floor(Math.random() * 2); // 2-3个障碍
  let placed = 0;
  while (placed < blockedCount) {
    const r = Math.floor(Math.random() * nmSize);
    const c = Math.floor(Math.random() * nmSize);
    if ((r === 0 && c === 0) || (r === nmSize - 1 && c === nmSize - 1)) continue;
    if (!nmGrid[r][c].blocked && nmGrid[r][c].value === 0) {
      nmGrid[r][c].blocked = true;
      placed++;
    }
  }
  // 标记起点为已访问
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
      cell.addEventListener('click', () => nmHandleClick(r, c));
      nmGridEl.appendChild(cell);
    }
  }
}

function nmHandleClick(r, c) {
  if (nmGameOver) return;
  // 检查是否相邻
  const dr = Math.abs(r - nmCurrent.r);
  const dc = Math.abs(c - nmCurrent.c);
  if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
    nmMoveTo(r, c);
  }
}

function nmMoveTo(r, c) {
  if (nmGameOver) return;
  if (nmGrid[r][c].blocked) return;
  if (nmGrid[r][c].visited) return;
  nmCurrent = { r, c };
  nmGrid[r][c].visited = true;
  nmSteps++;
  nmScore += nmGrid[r][c].value;
  nmUpdateUI();
  nmRenderGrid();
  // 检查胜利
  if (r === nmTarget.r && c === nmTarget.c) {
    nmGameOver = true;
    nmMessageEl.textContent = '🎉 你赢了！最终得分: ' + nmScore;
    nmMessageEl.className = 'nm-message nm-win';
  } else {
    // 检查是否无路可走
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let hasMove = false;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < nmSize && nc >= 0 && nc < nmSize) {
        if (!nmGrid[nr][nc].blocked && !nmGrid[nr][nc].visited) {
          hasMove = true;
          break;
        }
      }
    }
    if (!hasMove) {
      nmGameOver = true;
      nmMessageEl.textContent = '💀 无路可走！得分: ' + nmScore;
      nmMessageEl.className = 'nm-message nm-lose';
    } else {
      nmMessageEl.textContent = '继续前进...';
      nmMessageEl.className = 'nm-message';
    }
  }
}

function nmUpdateUI() {
  nmScoreEl.textContent = nmScore;
  nmStepsEl.textContent = nmSteps;
}

function nmHandleKey(e) {
  if (nmGameOver) return;
  const key = e.key;
  let dr = 0, dc = 0;
  if (key === 'ArrowUp') dr = -1;
  else if (key === 'ArrowDown') dr = 1;
  else if (key === 'ArrowLeft') dc = -1;
  else if (key === 'ArrowRight') dc = 1;
  else return;
  e.preventDefault();
  const nr = nmCurrent.r + dr;
  const nc = nmCurrent.c + dc;
  if (nr >= 0 && nr < nmSize && nc >= 0 && nc < nmSize) {
    if (!nmGrid[nr][nc].blocked && !nmGrid[nr][nc].visited) {
      nmMoveTo(nr, nc);
    }
  }
}

// 绑定键盘事件
container.addEventListener('keydown', nmHandleKey);
// 确保容器可以聚焦以接收键盘事件
container.setAttribute('tabindex', '0');
container.style.outline = 'none';
container.focus();

// 重置按钮事件
nmResetBtn.addEventListener('click', () => {
  nmInitGame();
  container.focus();
});

// 初始化游戏
nmInitGame();
}