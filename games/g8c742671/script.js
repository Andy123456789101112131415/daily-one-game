function init_g8c742671(container) {
function(container){
  // 游戏配置
  const SIZE = 9;
  const PLAYER_COUNT = 1;
  const ENEMY_COUNT = 3;
  const WALL_COUNT = 12;
  const FLAG_COUNT = 3;

  // 游戏状态
  let board = [];
  let playerPos = null;
  let enemyPositions = [];
  let flagPositions = [];
  let score = 0;
  let gameOver = false;
  let win = false;

  // DOM 元素
  const wrap = document.createElement('div');
  wrap.className = 'ctf-wrap';
  container.appendChild(wrap);

  // 初始化界面
  wrap.innerHTML = `
    <div class="ctf-header">
      <div class="ctf-title">Capture the Flag</div>
      <div class="ctf-scores">
        <div class="ctf-score-item"><span class="ctf-score-label">Flags:</span><span class="ctf-score-value" id="ctf-score">0</span></div>
        <div class="ctf-score-item"><span class="ctf-score-label">Moves:</span><span class="ctf-score-value" id="ctf-moves">0</span></div>
      </div>
    </div>
    <div class="ctf-board" id="ctf-board"></div>
    <div class="ctf-controls">
      <button class="ctf-btn ctf-btn-primary" id="ctf-restart">🔄 Replay</button>
      <div class="ctf-msg" id="ctf-msg">Use arrow keys or WASD to move. Reach all flags.</div>
    </div>
  `;

  const boardEl = wrap.querySelector('#ctf-board');
  const scoreEl = wrap.querySelector('#ctf-score');
  const movesEl = wrap.querySelector('#ctf-moves');
  const msgEl = wrap.querySelector('#ctf-msg');
  const restartBtn = wrap.querySelector('#ctf-restart');

  // 初始化游戏
  function initGame() {
    // 重置状态
    score = 0;
    gameOver = false;
    win = false;
    updateScore();
    movesEl.textContent = '0';
    msgEl.textContent = 'Use arrow keys or WASD to move. Reach all flags.';
    msgEl.className = 'ctf-msg';

    // 生成空棋盘
    board = Array.from({length: SIZE}, () => Array(SIZE).fill('empty'));

    // 放置墙壁
    let walls = 0;
    while (walls < WALL_COUNT) {
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);
      if (board[y][x] === 'empty' && !(x === Math.floor(SIZE/2) && y === Math.floor(SIZE/2))) {
        board[y][x] = 'wall';
        walls++;
      }
    }

    // 放置旗帜
    flagPositions = [];
    let flags = 0;
    while (flags < FLAG_COUNT) {
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);
      if (board[y][x] === 'empty') {
        board[y][x] = 'flag';
        flagPositions.push({x, y});
        flags++;
      }
    }

    // 放置玩家
    // 确保不在墙和旗上
    let px, py;
    do {
      px = Math.floor(Math.random() * SIZE);
      py = Math.floor(Math.random() * SIZE);
    } while (board[py][px] !== 'empty');
    playerPos = {x: px, y: py};
    board[py][px] = 'player';

    // 放置敌人
    enemyPositions = [];
    let enemies = 0;
    while (enemies < ENEMY_COUNT) {
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);
      if (board[y][x] === 'empty') {
        board[y][x] = 'enemy';
        enemyPositions.push({x, y});
        enemies++;
      }
    }

    renderBoard();
  }

  // 渲染棋盘
  function renderBoard() {
    boardEl.innerHTML = '';
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const cell = document.createElement('div');
        cell.className = 'ctf-cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        const type = board[y][x];
        if (type === 'wall') {
          cell.classList.add('wall');
        } else if (type === 'player') {
          cell.classList.add('player');
          cell.innerHTML = '<div class="ctf-eye"></div>';
        } else if (type === 'enemy') {
          cell.classList.add('enemy');
          cell.innerHTML = '<div class="ctf-eye"></div>';
        } else if (type === 'flag') {
          cell.classList.add('flag');
        }
        boardEl.appendChild(cell);
      }
    }
  }

  // 移动玩家
  function movePlayer(dx, dy) {
    if (gameOver) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // 边界检查
    if (newX < 0 || newX >= SIZE || newY < 0 || newY >= SIZE) return;

    const target = board[newY][newX];

    // 墙壁阻挡
    if (target === 'wall') return;

    // 移动玩家
    board[playerPos.y][playerPos.x] = 'empty';
    playerPos = {x: newX, y: newY};

    // 检查是否吃到旗帜
    if (target === 'flag') {
      score++;
      updateScore();
      // 移除旗帜（已变为玩家）
      // 但我们需要保留它作为已收集，所以直接覆盖为玩家即可
    }

    board[newY][newX] = 'player';

    // 更新移动次数
    const moves = parseInt(movesEl.textContent) + 1;
    movesEl.textContent = moves;

    // 检查胜利：所有旗帜被收集（即score == FLAG_COUNT）
    if (score >= FLAG_COUNT) {
      gameOver = true;
      win = true;
      showMessage('You captured all flags!', 'ctf-win');
    } else {
      // 移动敌人
      moveEnemies();
      // 检查是否被抓
      if (checkCollision()) {
        gameOver = true;
        win = false;
        showMessage('Caught by enemy!', 'ctf-lose');
      } else {
        showMessage('Keep going...', 'ctf-msg');
      }
    }

    renderBoard();
  }

  // 移动敌人（简单AI：随机移动一步）
  function moveEnemies() {
    for (let i = 0; i < enemyPositions.length; i++) {
      const enemy = enemyPositions[i];
      // 随机选择一个方向
      const dirs = [
        {dx: 0, dy: -1},
        {dx: 0, dy: 1},
        {dx: -1, dy: 0},
        {dx: 1, dy: 0}
      ];
      // 随机打乱
      dirs.sort(() => Math.random() - 0.5);
      let moved = false;
      for (const dir of dirs) {
        const nx = enemy.x + dir.dx;
        const ny = enemy.y + dir.dy;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && board[ny][nx] === 'empty') {
          // 移动敌人
          board[enemy.y][enemy.x] = 'empty';
          enemy.x = nx;
          enemy.y = ny;
          board[ny][nx] = 'enemy';
          moved = true;
          break;
        }
      }
      // 如果没有移动，保持原位
    }
  }

  // 检查碰撞
  function checkCollision() {
    for (const enemy of enemyPositions) {
      if (enemy.x === playerPos.x && enemy.y === playerPos.y) {
        return true;
      }
    }
    return false;
  }

  // 更新分数
  function updateScore() {
    scoreEl.textContent = score;
  }

  // 显示消息
  function showMessage(text, className) {
    msgEl.textContent = text;
    msgEl.className = 'ctf-msg ' + (className || '');
    // 添加动画
    msgEl.classList.add('ctf-anim');
    setTimeout(() => msgEl.classList.remove('ctf-anim'), 400);
  }

  // 键盘事件
  function handleKey(e) {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':
        movePlayer(0, -1);
        break;
      case 'ArrowDown': case 's': case 'S':
        movePlayer(0, 1);
        break;
      case 'ArrowLeft': case 'a': case 'A':
        movePlayer(-1, 0);
        break;
      case 'ArrowRight': case 'd': case 'D':
        movePlayer(1, 0);
        break;
    }
  }

  // 绑定事件
  document.addEventListener('keydown', handleKey);

  // 重开按钮
  restartBtn.addEventListener('click', () => {
    initGame();
  });

  // 初始化
  initGame();

  // 清理事件监听（可选）
  // 注意：由于container可能被多次调用，需要确保事件不重复绑定
  // 但这里简单起见，每次init都添加，但会重复，所以用匿名函数？但这里不处理，因为页面通常只调用一次。
  // 更健壮：使用命名函数并移除？但为了简洁，我们假设只调用一次。
  // 如果需要清理，可以这样：
  // 在函数开始处，查找已有的listener？不做了。

  // 如果希望支持鼠标点击移动，可以添加点击事件，但这里略。

  // 返回一个清理函数（可选）
  return function() {
    document.removeEventListener('keydown', handleKey);
  };
}
}