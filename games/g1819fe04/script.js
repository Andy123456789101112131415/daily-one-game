function init_g1819fe04(container) {
  container.innerHTML = '<div style="text-align:center"><span class="brk-score" style="font-size:1.2rem;font-weight:700;color:#7c3aed;">0</span></div><div style="position:relative;display:flex;justify-content:center"><canvas style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"></canvas><div class="brk-overlay" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(255,255,255,0.9);border-radius:8px;font-size:1.5rem;font-weight:700;color:#7c3aed;gap:8px;"><span>Breakout!</span><span class="brk-sub"></span></div></div><div style="text-align:center;margin-top:8px"><button class="btn" id="brk-restart">New Game</button></div>';
  var restartBtn = container.querySelector('#brk-restart');
  if (restartBtn) restartBtn.addEventListener('click', function() { init_g1819fe04(container); });
  const scoreEl = container.querySelector('.brk-score');
  const canvas = container.querySelector('canvas');
  const overlay = container.querySelector('.brk-overlay');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = W * 0.75;
    canvas.width = W;
    canvas.height = H;
  }
  resize();
  window.addEventListener('resize', resize);

  // Game state
  const paddleWidth = 80;
  const paddleHeight = 10;
  const ballRadius = 6;
  const brickRowCount = 5;
  const brickColCount = 7;
  const brickWidth = 60;
  const brickHeight = 16;
  const brickPadding = 6;
  const brickOffsetTop = 30;
  const brickOffsetLeft = (W - (brickColCount * (brickWidth + brickPadding) - brickPadding)) / 2;
  let paddleX = (W - paddleWidth) / 2;
  let ballX = W / 2;
  let ballY = H - 30;
  let ballDX = 3;
  let ballDY = -3;
  let score = 0;
  let gameOver = false;
  let gameWin = false;
  let running = false;
  let bricks = [];

  function initBricks() {
    bricks = [];
    const colors = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444'];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[r] = [];
      for (let c = 0; c < brickColCount; c++) {
        bricks[r][c] = { x: 0, y: 0, status: 1, color: colors[r] };
      }
    }
  }
  initBricks();

  function drawBricks() {
    for (let r = 0; r < brickRowCount; r++) {
      for (let c = 0; c < brickColCount; c++) {
        if (bricks[r][c].status === 1) {
          const brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
          const brickY = brickOffsetTop + r * (brickHeight + brickPadding);
          bricks[r][c].x = brickX;
          bricks[r][c].y = brickY;
          ctx.fillStyle = bricks[r][c].color;
          ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          ctx.strokeStyle = '#e2e8f0';
          ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
        }
      }
    }
  }

  function drawPaddle() {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(paddleX, H - paddleHeight, paddleWidth, paddleHeight);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(paddleX, H - paddleHeight, paddleWidth, paddleHeight);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.closePath();
  }

  function collisionDetection() {
    for (let r = 0; r < brickRowCount; r++) {
      for (let c = 0; c < brickColCount; c++) {
        const b = bricks[r][c];
        if (b.status === 1) {
          if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
            ballDY = -ballDY;
            b.status = 0;
            score += 10;
            scoreEl.textContent = score;
            if (score === brickRowCount * brickColCount * 10) {
              gameWin = true;
              running = false;
              overlay.style.display = 'flex';
              overlay.innerHTML = '<div>🎉 You Win!</div><div class="brk-sub">Score: ' + score + '</div>';
            }
          }
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBricks();
    drawPaddle();
    drawBall();
    collisionDetection();

    // Ball movement
    if (ballX + ballDX > W - ballRadius || ballX + ballDX < ballRadius) {
      ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
      ballDY = -ballDY;
    } else if (ballY + ballDY > H - ballRadius) {
      // Paddle hit?
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballDY = -ballDY;
        ballY = H - paddleHeight - ballRadius;
      } else {
        // Game over
        gameOver = true;
        running = false;
        overlay.style.display = 'flex';
        overlay.innerHTML = '<div>Game Over</div><div class="brk-sub">Score: ' + score + '</div>';
      }
    }
    ballX += ballDX;
    ballY += ballDY;

    if (running) {
      requestAnimationFrame(draw);
    }
  }

  function startGame() {
    running = true;
    gameOver = false;
    gameWin = false;
    overlay.style.display = 'none';
    score = 0;
    scoreEl.textContent = '0';
    initBricks();
    paddleX = (W - paddleWidth) / 2;
    ballX = W / 2;
    ballY = H - 30;
    ballDX = 3 * (Math.random() > 0.5 ? 1 : -1);
    ballDY = -3;
    draw();
  }

  // Mouse control
  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    if (mouseX < 0) mouseX = 0;
    if (mouseX > W) mouseX = W;
    paddleX = mouseX - paddleWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddleWidth > W) paddleX = W - paddleWidth;
  });

  // Keyboard control
  const keys = {};
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
  });
  document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
  });
  setInterval(function() {
    if (keys['ArrowLeft'] || keys['a']) {
      paddleX -= 7;
      if (paddleX < 0) paddleX = 0;
    }
    if (keys['ArrowRight'] || keys['d']) {
      paddleX += 7;
      if (paddleX + paddleWidth > W) paddleX = W - paddleWidth;
    }
  }, 16);

  restartBtn.addEventListener('click', startGame);

  // Auto start
  startGame();
}