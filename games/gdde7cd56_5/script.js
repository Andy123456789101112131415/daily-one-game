function init_gdde7cd56_5(container) {
const nmSize = 4; let nmGrid = []; let nmPlayerPos = {r:0,c:0}; let nmGoalPos = {r:3,c:3}; let nmSteps = 0; let nmBest = Infinity; let nmGameOver = false; let nmWin = false; let nmContainer = container;

function nmInit() {
  nmContainer.innerHTML = '';
  nmContainer.className = 'nm-game';
  nmGameOver = false;
  nmWin = false;
  nmSteps = 0;
  nmPlayerPos = {r:0,c:0};
  nmGoalPos = {r:3,c:3};
  nmGrid = [];
  for (let r = 0; r < nmSize; r++) {
    nmGrid[r] = [];
    for (let c = 0; c < nmSize; c++) {
      nmGrid[r][c] = Math.floor(Math.random() * 9) + 1;
    }
  }
  nmGrid[0][0] = 0;
  nmGrid[3][3] = 0;
  nmRender();
}

function nmRender() {
  let html = '';
  html += '<div class="nm-header"><h1 class="nm-title">数字迷宫</h1><button class="nm-btn nm-primary" id="nm-restart">重来</button></div>';
  html += '<div class="nm-status">步数: <span id="nm-steps">' + nmSteps + '</span> 最佳: <span id="nm-best">' + (nmBest === Infinity ? '—' : nmBest) + '</span></div>';
  html += '<div class="nm-message" id="nm-message"></div>';
  html += '<div class="nm-grid" id="nm-grid">';
  for (let r = 0; r < nmSize; r++) {
    for (let c = 0; c < nmSize; c++) {
      let cls = 'nm-cell';
      if (r === nmPlayerPos.r && c === nmPlayerPos.c) cls += ' nm-active';
      if (r === 0 && c === 0) cls += ' nm-start';
      if (r === 3 && c === 3) cls += ' nm-goal';
      if (nmGameOver) cls += ' nm-disabled';
      let val = nmGrid[r][c];
      let display = (r === 0 && c === 0) ? '起' : (r === 3 && c === 3) ? '终' : val;
      html += '<div class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + display + '</div>';
    }
  }
  html += '</div>';
  html += '<div class="nm-controls"><div class="nm-hint">使用方向键或点击相邻格子移动</div><div class="nm-dpad">';
  html += '<button class="nm-btn nm-empty"></button><button class="nm-btn" data-dir="up">↑</button><button class="nm-btn nm-empty"></button>';
  html += '<button class="nm-btn" data-dir="left">←</button><button class="nm-btn nm-empty"></button><button class="nm-btn" data-dir="right">→</button>';
  html += '<button class="nm-btn nm-empty"></button><button class="nm-btn" data-dir="down">↓</button><button class="nm-btn nm-empty"></button>';
  html += '</div></div>';
  nmContainer.innerHTML = html;

  const gridEl = nmContainer.querySelector('#nm-grid');
  gridEl.addEventListener('click', function(e) {
    const cell = e.target.closest('.nm-cell');
    if (!cell || nmGameOver) return;
    const r = parseInt(cell.dataset.r);
    const c = parseInt(cell.dataset.c);
    nmTryMove(r, c);
  });

  nmContainer.querySelector('#nm-restart').addEventListener('click', function() {
    nmInit();
  });

  nmContainer.querySelectorAll('[data-dir]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (nmGameOver) return;
      const dir = btn.dataset.dir;
      let dr = 0, dc = 0;
      if (dir === 'up') dr = -1;
      else if (dir === 'down') dr = 1;
      else if (dir === 'left') dc = -1;
      else if (dir === 'right') dc = 1;
      nmTryMove(nmPlayerPos.r + dr, nmPlayerPos.c + dc);
    });
  });

  nmContainer.addEventListener('keydown', function(e) {
    if (nmGameOver) return;
    let dr = 0, dc = 0;
    if (e.key === 'ArrowUp') dr = -1;
    else if (e.key === 'ArrowDown') dr = 1;
    else if (e.key === 'ArrowLeft') dc = -1;
    else if (e.key === 'ArrowRight') dc = 1;
    else return;
    e.preventDefault();
    nmTryMove(nmPlayerPos.r + dr, nmPlayerPos.c + dc);
  });

  nmContainer.setAttribute('tabindex', '0');
  nmContainer.focus();
}

function nmTryMove(r, c) {
  if (r < 0 || r >= nmSize || c < 0 || c >= nmSize) return;
  const dr = Math.abs(r - nmPlayerPos.r);
  const dc = Math.abs(c - nmPlayerPos.c);
  if (dr + dc !== 1) return;
  const val = nmGrid[r][c];
  if (val === 0 || nmGameOver) return;
  nmPlayerPos = {r:r,c:c};
  nmSteps++;
  if (r === 3 && c === 3) {
    nmGameOver = true;
    nmWin = true;
    if (nmSteps < nmBest) nmBest = nmSteps;
    nmUpdate();
    nmShowMessage('🎉 你赢了！步数: ' + nmSteps, 'win');
  } else {
    nmUpdate();
  }
}

function nmUpdate() {
  const stepsEl = nmContainer.querySelector('#nm-steps');
  if (stepsEl) stepsEl.textContent = nmSteps;
  const bestEl = nmContainer.querySelector('#nm-best');
  if (bestEl) bestEl.textContent = nmBest === Infinity ? '—' : nmBest;
  const cells = nmContainer.querySelectorAll('.nm-cell');
  cells.forEach(function(cell) {
    const r = parseInt(cell.dataset.r);
    const c = parseInt(cell.dataset.c);
    cell.classList.toggle('nm-active', r === nmPlayerPos.r && c === nmPlayerPos.c);
    if (nmGameOver) cell.classList.add('nm-disabled');
  });
}

function nmShowMessage(text, type) {
  const msgEl = nmContainer.querySelector('#nm-message');
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.className = 'nm-message nm-' + type;
  if (type === 'win') {
    msgEl.style.animation = 'none';
    void msgEl.offsetWidth;
    msgEl.style.animation = 'nmPop 0.4s ease';
  }
}

nmInit();
}