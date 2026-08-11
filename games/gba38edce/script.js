function init_gba38edce(container) {
function(container){
  // 迷宫配置
  const COLS = 15, ROWS = 11;
  const CELL_SIZE = 32;
  const WALL = 1, PATH = 0;
  let maze = [];
  let player = {x:0, y:0};
  let exit = {x:COLS-1, y:ROWS-1};
  let steps = 0;
  let gameOver = false;
  let win = false;

  // 创建DOM
  container.innerHTML = `
    <div class='mzGame'>
      <div class='mzHeader'>
        <span class='mzTitle'>迷宫探险</span>
        <span class='mzStatus'>步数: <span class='mzSteps'>0</span></span>
      </div>
      <div class='mzBoard'>
        <div class='mzCanvasWrap'>
          <canvas class='mzCanvas' width='${COLS*CELL_SIZE}' height='${ROWS*CELL_SIZE}'></canvas>
        </div>
      </div>
      <div class='mzControls'>
        <button class='mzBtn' data-dir='up'>↑</button>
        <button class='mzBtn' data-dir='down'>↓</button>
        <button class='mzBtn' data-dir='left'>←</button>
        <button class='mzBtn' data-dir='right'>→</button>
        <button class='mzBtn mzBtnPrimary' id='mzRestartBtn'>🔄 重来</button>
      </div>
      <div class='mzControlsHint'>使用方向键或点击按钮移动</div>
    </div>
  `;

  const canvas = container.querySelector('.mzCanvas');
  const ctx = canvas.getContext('2d');
  const stepsSpan = container.querySelector('.mzSteps');
  const restartBtn = container.querySelector('#mzRestartBtn');
  const board = container.querySelector('.mzBoard');

  // 生成迷宫（递归回溯生成完美迷宫）
  function generateMaze() {
    // 初始化全墙
    maze = Array(ROWS).fill().map(() => Array(COLS).fill(WALL));
    // 从(1,1)开始挖
    const stack = [{x:1, y:1}];
    maze[1][1] = PATH;
    while (stack.length > 0) {
      const current = stack[stack.length-1];
      const {x, y} = current;
      // 获取相邻未访问的格子（步长为2）
      const neighbors = [];
      if (x-2 >= 1 && maze[y][x-2] === WALL) neighbors.push({x:x-2, y, dx:-1, dy:0});
      if (x+2 <= COLS-2 && maze[y][x+2] === WALL) neighbors.push({x:x+2, y, dx:1, dy:0});
      if (y-2 >= 1 && maze[y-2][x] === WALL) neighbors.push({x, y:y-2, dx:0, dy:-1});
      if (y+2 <= ROWS-2 && maze[y+2][x] === WALL) neighbors.push({x, y:y+2, dx:0, dy:1});
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random()*neighbors.length)];
        // 打通墙
        maze[y + next.dy][x + next.dx] = PATH;
        maze[next.y][next.x] = PATH;
        stack.push({x:next.x, y:next.y});
      } else {
        stack.pop();
      }
    }
    // 确保出口可到达（迷宫已连通，但出口可能被墙堵住？实际上完美迷宫所有格子可达，但出口可能在墙内？这里我们设置出口为右下角，确保它是通路）
    // 如果出口是墙，则打通周围
    if (maze[ROWS-2][COLS-2] === WALL) maze[ROWS-2][COLS-2] = PATH;
    if (maze[ROWS-2][COLS-1] === WALL) maze[ROWS-2][COLS-1] = PATH;
    if (maze[ROWS-1][COLS-2] === WALL) maze[ROWS-1][COLS-2] = PATH;
    maze[ROWS-1][COLS-1] = PATH; // 出口位置
  }

  // 绘制迷宫
  function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    // 绘制墙和路
    for (let y=0; y<ROWS; y++) {
      for (let x=0; x<COLS; x++) {
        if (maze[y][x] === WALL) {
          ctx.fillStyle = '#cbd5e1';
        } else {
          ctx.fillStyle = '#fff';
        }
        ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        // 网格线
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(x*CELL_SIZE+0.5, y*CELL_SIZE+0.5, CELL_SIZE, CELL_SIZE);
      }
    }
    // 绘制出口
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(exit.x*CELL_SIZE+CELL_SIZE/2, exit.y*CELL_SIZE+CELL_SIZE/2, CELL_SIZE*0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#065f46';
    ctx.stroke();
    // 绘制玩家
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(player.x*CELL_SIZE+CELL_SIZE/2, player.y*CELL_SIZE+CELL_SIZE/2, CELL_SIZE*0.35, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#4c1d95';
    ctx.stroke();
  }

  // 移动玩家
  function move(dx, dy) {
    if (gameOver || win) return;
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;
    if (maze[ny][nx] === WALL) return;
    player.x = nx;
    player.y = ny;
    steps++;
    stepsSpan.textContent = steps;
    draw();
    checkWin();
  }

  // 检查胜利
  function checkWin() {
    if (player.x === exit.x && player.y === exit.y) {
      win = true;
      gameOver = true;
      showOverlay(true);
    }
  }

  // 显示胜利提示
  function showOverlay(isWin) {
    const overlay = document.createElement('div');
    overlay.className = 'mzWinOverlay';
    overlay.innerHTML = `<span>${isWin ? '🎉 胜利！' : '失败'}</span>`;
    board.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1500);
  }

  // 重开游戏
  function restart() {
    generateMaze();
    player = {x:1, y:1};
    exit = {x:COLS-1, y:ROWS-1};
    steps = 0;
    gameOver = false;
    win = false;
    stepsSpan.textContent = '0';
    // 移除可能存在的胜利提示
    const overlay = container.querySelector('.mzWinOverlay');
    if (overlay) overlay.remove();
    draw();
  }

  // 事件绑定
  // 键盘事件
  function handleKey(e) {
    const key = e.key;
    if (key === 'ArrowUp') { e.preventDefault(); move(0, -1); }
    else if (key === 'ArrowDown') { e.preventDefault(); move(0, 1); }
    else if (key === 'ArrowLeft') { e.preventDefault(); move(-1, 0); }
    else if (key === 'ArrowRight') { e.preventDefault(); move(1, 0); }
  }
  document.addEventListener('keydown', handleKey);

  // 按钮点击事件
  container.querySelectorAll('.mzBtn[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir;
      switch(dir) {
        case 'up': move(0, -1); break;
        case 'down': move(0, 1); break;
        case 'left': move(-1, 0); break;
        case 'right': move(1, 0); break;
      }
    });
  });

  restartBtn.addEventListener('click', restart);

  // 初始化
  generateMaze();
  player = {x:1, y:1};
  exit = {x:COLS-1, y:ROWS-1};
  steps = 0;
  gameOver = false;
  win = false;
  draw();

  // 清理事件监听（可选，但为了健壮性，容器被移除时移除键盘监听）
  // 但这里无法监听移除，所以不处理。

  // 返回清理函数（如果需要）
  return function cleanup() {
    document.removeEventListener('keydown', handleKey);
  };
}
}