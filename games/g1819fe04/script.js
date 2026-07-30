function init_g1819fe04(container) {
  container.innerHTML = '<div style="text-align:center"><span class="brk-score" style="font-size:1.2rem;font-weight:700;color:#7c3aed;">0</span></div><div style="position:relative;display:flex;justify-content:center"><canvas style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"></canvas><div class="brk-overlay" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(255,255,255,0.9);border-radius:8px;font-size:1.5rem;font-weight:700;color:#7c3aed;gap:8px;"><span id="brk-msg">Breakout!</span><span class="brk-sub" id="brk-sub"></span></div></div><div style="text-align:center;margin-top:8px"><button class="btn" id="brk-restart">New Game</button></div>';
  var canvas = container.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var scoreEl = container.querySelector('.brk-score');
  var overlay = container.querySelector('.brk-overlay');
  var msgEl = container.querySelector('#brk-msg');
  var subEl = container.querySelector('#brk-sub');

  var W, H, bricks = [], score = 0, balls = [], running = false;
  var paddleW = 100, paddleH = 12, paddleX = 0;

  var ROWS = 8, COLS = 8;
  var brickW = 0, brickH = 16, pad = 6, topOff = 40;
  var colors = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#6366f1','#84cc16'];

  function resize() {
    var r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = Math.max(300, W * 0.7);
    canvas.width = W; canvas.height = H;
    brickW = (W - pad * 2 - pad * (COLS - 1)) / COLS;
    paddleX = (W - paddleW) / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  function initBricks() {
    bricks = [];
    for (var r = 0; r < ROWS; r++) {
      bricks[r] = [];
      for (var c = 0; c < COLS; c++) {
        // 随机留空 (30% 空洞)，越往下越多砖
        var skip = Math.random() < 0.25 - r * 0.015;
        if (skip) { bricks[r][c] = { hp: 0, color: '' }; continue; }
        // 底部砖更硬 (20% 概率 2HP)
        var hp = (r >= 5 && Math.random() < 0.3) ? 2 : 1;
        bricks[r][c] = { hp: hp, maxHp: hp, color: colors[r % colors.length] };
      }
    }
    score = 0; scoreEl.textContent = '0';
  }

  function getBrickTotal() {
    var t = 0;
    for (var r = 0; r < ROWS; r++)
      for (var c = 0; c < COLS; c++)
        if (bricks[r][c].hp > 0) t++;
    return t;
  }

  var ballOnPaddle = true;

  function spawnBall() {
    return {
      x: paddleX + paddleW / 2,
      y: H - paddleH - 6,
      dx: (Math.random() * 2 + 2) * (Math.random() > 0.5 ? 1 : -1),
      dy: -(Math.random() * 1.5 + 2.5),
      r: 5
    };
  }

  function launchBall() {
    if (!ballOnPaddle || balls.length === 0) return;
    ballOnPaddle = false;
    var b = balls[0];
    b.dx = (Math.random() * 2 + 2) * (Math.random() > 0.5 ? 1 : -1);
    b.dy = -(Math.random() * 1.5 + 2.5);
  }

  function drawBricks() {
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var b = bricks[r][c];
        if (b.hp <= 0) continue;
        var bx = pad + c * (brickW + pad);
        var by = topOff + r * (brickH + pad);
        b._x = bx; b._y = by;
        ctx.fillStyle = b.hp === 2 ? '#475569' : b.color; // 2HP砖深色
        ctx.fillRect(bx, by, brickW, brickH);
        if (b.hp === 2) {
          ctx.fillStyle = b.color;
          ctx.fillRect(bx + 3, by + 3, brickW - 6, brickH - 6);
        }
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, by, brickW, brickH);
      }
    }
  }

  function drawPaddle() {
    var grad = ctx.createLinearGradient(paddleX, H-paddleH, paddleX, H);
    grad.addColorStop(0, '#6366f1'); grad.addColorStop(1, '#4f46e5');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(paddleX, H - paddleH, paddleW, paddleH, 6);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBricks();
    drawPaddle();
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fillStyle = '#1e293b'; ctx.fill(); ctx.closePath();
    }

    // 球在板子上跟随
    if (ballOnPaddle && balls.length > 0) {
      balls[0].x = paddleX + paddleW / 2;
      balls[0].y = H - paddleH - 6;
    }

    // 移动球
    for (var i = balls.length - 1; i >= 0; i--) {
      var bl = balls[i];
      if (ballOnPaddle && i === 0) continue; // 板子上的球不动
      bl.x += bl.dx; bl.y += bl.dy;
      if (bl.x - bl.r < 0 || bl.x + bl.r > W) bl.dx = -bl.dx;
      if (bl.y - bl.r < 0) bl.dy = -bl.dy;

      // 碰挡板
      if (bl.y + bl.r > H - paddleH && bl.x > paddleX - 5 && bl.x < paddleX + paddleW + 5) {
        bl.dy = -Math.abs(bl.dy);
        bl.y = H - paddleH - bl.r;
        // 根据击球位置改变角度
        var hit = (bl.x - paddleX) / paddleW;
        bl.dx = (hit - 0.5) * 6;
      }

      // 落底
      if (bl.y > H + 20) { balls.splice(i, 1); }

      // 碰撞砖块
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var bk = bricks[r][c];
          if (bk.hp <= 0) continue;
          if (bl.x > bk._x && bl.x < bk._x + brickW && bl.y > bk._y && bl.y < bk._y + brickH) {
            bl.dy = -bl.dy;
            bk.hp--;
            if (bk.hp <= 0) {
              score += (r + 1) * 5;
              scoreEl.textContent = score;
              // 5% 概率额外球
              if (Math.random() < 0.05 && balls.length < 3) {
                balls.push(spawnBall());
              }
            }
            break;
          }
        }
      }
    }

    // 全部球没了
    if (balls.length === 0) {
      running = false;
      msgEl.textContent = 'Game Over';
      subEl.textContent = 'Score: ' + score;
      overlay.style.display = 'flex';
    }

    // 赢了
    if (getBrickTotal() === 0) {
      running = false;
      msgEl.textContent = 'You Win!';
      subEl.textContent = 'Score: ' + score + (balls.length > 1 ? ' (Multiball!)' : '');
      overlay.style.display = 'flex';
    }

    if (running) requestAnimationFrame(draw);
  }

  function startGame() {
    initBricks();
    ballOnPaddle = true;
    balls = [spawnBall()];
    paddleX = (W - paddleW) / 2;
    running = true;
    overlay.style.display = 'none';
    draw();
  }

  // 点击发射
  canvas.addEventListener('click', launchBall);

  // 鼠标
  canvas.addEventListener('mousemove', function(e) {
    var mx = e.clientX - canvas.getBoundingClientRect().left;
    paddleX = Math.max(0, Math.min(W - paddleW, mx - paddleW / 2));
  });

  // 键盘
  var keys = {};
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); launchBall(); }
  });
  document.addEventListener('keyup', function(e) { keys[e.key] = false; });
  setInterval(function() {
    if (keys['ArrowLeft'] || keys['a']) paddleX = Math.max(0, paddleX - 8);
    if (keys['ArrowRight'] || keys['d']) paddleX = Math.min(W - paddleW, paddleX + 8);
  }, 16);

  container.querySelector('#brk-restart').addEventListener('click', startGame);
  startGame();
}
