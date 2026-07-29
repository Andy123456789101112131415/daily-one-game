// ========================= ASCII艺术 =========================
function initAscii(container) {
  const arts = [
    { art: '      /\\_/\\\n     ( o.o )\n      > ^ <\n     Meow ~ Have a great day!', quote: 'Code changes the world. Your line today could be tomorrow\'s miracle.' },
    { art: '      / \\__\n     (    @\\___\n     /         O\n    /   (_____/\n   /_____/   U\n    Woof ~ What a wonderful day!', quote: 'Every bug is a chance to grow. Don\'t fear mistakes.' },
    { art: '      (\\_/)\n      ( \u2022_\u2022)\n      / > \ud83e\udd55\n    Little bunny loves carrots~', quote: 'Improve 1% daily, in a year you\'ll be 37.8x better!' },
    { art: '      ,___,\n      [O.o]\n      /)__)\n      -\"--\"-\n    Night owls need sleep too!', quote: 'Great programmers fix fast, not never err.' },
    { art: '       \u2665\u2665\u2665\u2665\u2665\u2665\u2665\u2665\n      \u2665         \u2665\n     \u2665   LOVE   \u2665\n      \u2665         \u2665\n       \u2665\u2665\u2665\u2665\u2665\u2665\u2665\u2665\n    Code with heart, ship with love!', quote: 'Elegant code is a joy to behold.' },
    { art: '         /\\\n        /  \\\n       /    \\\n      /______\\\n      |      |\n      |  \ud83d\ude80  |\n      |      |\n     /|  GO  |\\\n    /_|______|_\\\n    To the stars and beyond!', quote: 'Instead of wishing on a star, become one yourself.' },
    { art: '        ^^^\n       ^^^^^\n      ^^^^^^^\n     ^^^^^^^^^\n        |||\n        |||\n    May your code grow like a tree!', quote: 'A bit more effort today = a bit more luck tomorrow.' },
    { art: '     ><((((\'><\n     ><((((\'><\n     ><((((\'><\n    Swim smoothly like a fish!', quote: 'Programming is a way of solving problems.' },
    { art: '         ( (\n          ) )\n       ........\n       |      |]\n       \\      /\n        `----\'\n    Coffee first, coding second!', quote: 'Today\'s sweat = tomorrow\'s success. Keep going!' },
    { art: '          *\n         ***\n        *****\n       *******\n        *****\n         ***\n          *\n    You are the brightest star!', quote: 'Life = Git. Every step counts, every commit matters.' }
  ];

  let idx = Math.floor(Math.random() * arts.length);

  function renderArt() {
    const a = arts[idx];
    let html = '<div style="text-align: center;">';
    html += '<div class="ascii-display">' + a.art + '</div>';
    html += '<div class="ascii-quote"><span class="quote-text">\ud83d\udcaa ' + a.quote + '</span></div>';
    html += '<div class="ascii-nav">';
    html += '<button class="btn" onclick="asciiPrev()">\u2b05 Prev</button>';
    html += '<span style="padding:6px 12px;color:var(--text-dim);font-size:0.85rem;">' + (idx+1) + '/' + arts.length + '</span>';
    html += '<button class="btn" onclick="asciiNext()">Next \u27a1</button>';
    html += '</div></div>';
    container.innerHTML = html;
    window.asciiPrev = () => { idx = (idx - 1 + arts.length) % arts.length; renderArt(); };
    window.asciiNext = () => { idx = (idx + 1) % arts.length; renderArt(); };
  }
  renderArt();
}
// === g1819fe04 ===
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
// === g1b8a479c ===
function init_g1b8a479c(container) {
    var gridSize = 20;
    var cellSize = 20;
    var canvas = document.createElement('canvas');
    canvas.className = 'snake-game-canvas';
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    var ctx = canvas.getContext('2d');
    var scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'snake-game-score';
    scoreDisplay.textContent = '0';
    var messageDiv = document.createElement('div');
    messageDiv.className = 'snake-game-message';
    var controlsDiv = document.createElement('div');
    controlsDiv.className = 'snake-game-controls';
    var restartBtn = document.createElement('button');
    restartBtn.className = 'snake-game-btn';
    restartBtn.textContent = '重新开始';
    controlsDiv.appendChild(restartBtn);
    var canvasWrap = document.createElement('div');
    canvasWrap.className = 'snake-game-canvas-wrap';
    canvasWrap.appendChild(canvas);
    var cardDiv = document.createElement('div');
    cardDiv.className = 'snake-game-card';
    var thumbDiv = document.createElement('div');
    thumbDiv.className = 'snake-game-thumb';
    thumbDiv.innerHTML = "<svg viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'><rect width='56' height='56' fill='#f8f9fc' rx='4'/><rect x='12' y='12' width='8' height='8' fill='#10b981' rx='2'/><rect x='20' y='12' width='8' height='8' fill='#10b981' rx='2'/><rect x='28' y='12' width='8' height='8' fill='#10b981' rx='2'/><rect x='36' y='12' width='8' height='8' fill='#10b981' rx='2'/><rect x='44' y='20' width='8' height='8' fill='#ef4444' rx='2'/></svg>";
    var infoDiv = document.createElement('div');
    infoDiv.className = 'snake-game-info';
    var titleP = document.createElement('p');
    titleP.className = 'snake-game-title';
    titleP.textContent = '贪吃蛇';
    var tagsP = document.createElement('p');
    tagsP.className = 'snake-game-tags';
    tagsP.textContent = '经典小游戏';
    infoDiv.appendChild(titleP);
    infoDiv.appendChild(tagsP);
    cardDiv.appendChild(thumbDiv);
    cardDiv.appendChild(infoDiv);
    container.innerHTML = '';
    container.appendChild(cardDiv);
    container.appendChild(scoreDisplay);
    container.appendChild(canvasWrap);
    container.appendChild(controlsDiv);
    container.appendChild(messageDiv);

    var snake = [{x:10, y:10}];
    var food = {x:15, y:15};
    var direction = 'right';
    var nextDirection = 'right';
    var score = 0;
    var gameOver = false;
    var win = false;
    var gameInterval = null;

    function randomFood() {
        var free = [];
        for (var i=0; i<gridSize; i++) {
            for (var j=0; j<gridSize; j++) {
                var occupied = false;
                for (var k=0; k<snake.length; k++) {
                    if (snake[k].x === i && snake[k].y === j) {
                        occupied = true;
                        break;
                    }
                }
                if (!occupied) {
                    free.push({x:i, y:j});
                }
            }
        }
        if (free.length === 0) {
            win = true;
            gameOver = true;
            clearInterval(gameInterval);
            gameInterval = null;
            messageDiv.textContent = '恭喜你赢了！';
            return null;
        }
        var idx = Math.floor(Math.random() * free.length);
        return free[idx];
    }

    function draw() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.5;
        for (var i=0; i<=gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i*cellSize, 0);
            ctx.lineTo(i*cellSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i*cellSize);
            ctx.lineTo(canvas.width, i*cellSize);
            ctx.stroke();
        }
        // 绘制蛇
        ctx.fillStyle = '#10b981';
        for (var i=0; i<snake.length; i++) {
            ctx.fillRect(snake[i].x*cellSize, snake[i].y*cellSize, cellSize-1, cellSize-1);
        }
        // 绘制食物
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(food.x*cellSize, food.y*cellSize, cellSize-1, cellSize-1);
    }

    function move() {
        if (gameOver) return;
        direction = nextDirection;
        var head = {x: snake[0].x, y: snake[0].y};
        switch(direction) {
            case 'right': head.x++; break;
            case 'left': head.x--; break;
            case 'up': head.y--; break;
            case 'down': head.y++; break;
        }
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = score;
            snake.unshift(head);
            var newFood = randomFood();
            if (newFood) {
                food = newFood;
            } else {
                // 胜利，游戏结束
                return;
            }
        } else {
            snake.unshift(head);
            snake.pop();
        }
        // 检查碰撞
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            gameOver = true;
            clearInterval(gameInterval);
            gameInterval = null;
            messageDiv.textContent = '游戏结束！撞墙了';
            return;
        }
        for (var i=1; i<snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver = true;
                clearInterval(gameInterval);
                gameInterval = null;
                messageDiv.textContent = '游戏结束！撞到自己了';
                return;
            }
        }
        draw();
    }

    function resetGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        snake = [{x:10, y:10}];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        gameOver = false;
        win = false;
        scoreDisplay.textContent = '0';
        messageDiv.textContent = '';
        food = randomFood();
        if (!food) {
            food = {x:15, y:15};
        }
        draw();
        startGame();
    }

    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(move, 150);
    }

    function keydownHandler(e) {
        if (gameOver) return;
        var key = e.key;
        if (key === 'ArrowUp' && direction !== 'down') nextDirection = 'up';
        else if (key === 'ArrowDown' && direction !== 'up') nextDirection = 'down';
        else if (key === 'ArrowLeft' && direction !== 'right') nextDirection = 'left';
        else if (key === 'ArrowRight' && direction !== 'left') nextDirection = 'right';
        e.preventDefault();
    }

    document.addEventListener('keydown', keydownHandler);
    restartBtn.addEventListener('click', resetGame);

    // 初始化食物
    food = randomFood();
    if (!food) {
        food = {x:15, y:15};
    }
    draw();
    startGame();

    // 清理函数（可选）
    return function cleanup() {
        clearInterval(gameInterval);
        document.removeEventListener('keydown', keydownHandler);
    };
}
// === gae84ccb5 ===
function init_gae84ccb5(container) {
  var DURATION = 30; // 游戏时长（秒）
  var state, spawnTimer, gameLoop, keyHandler;

  function buildHTML() {
    var lanesHTML = '';
    var keysHTML = '';
    var labels = ['D', 'F', 'J', 'K'];
    for (var i = 0; i < 4; i++) {
      lanesHTML += '<div id="rt-lane2-' + i + '" style="width:64px;height:240px;background:#fff;border:2px solid #e2e8f0;border-radius:10px;position:relative;overflow:hidden;">'
        + '<div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:44px;height:44px;border:3px dashed #e2e8f0;border-radius:50%;"></div>'
        + '</div>';
      keysHTML += '<div class="rt-key2" data-lane="' + i + '" style="width:64px;height:44px;background:#fff;border:2px solid #e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#64748b;cursor:pointer;user-select:none;">' + labels[i] + '</div>';
    }
    container.innerHTML = ''
      + '<div style="text-align:center;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      + '<span style="font-size:1rem;font-weight:700;">RhythmTap</span>'
      + '<span style="font-size:0.9rem;color:#7c3aed;font-weight:700;">分: <span id="rt-score2">0</span></span>'
      + '<span style="font-size:0.85rem;color:#64748b;">⏱ <span id="rt-time2">' + DURATION + '</span>s</span>'
      + '</div>'
      + '<div id="rt-combo2" style="font-size:0.9rem;min-height:22px;color:#f59e0b;font-weight:600;"></div>'
      + '<div style="display:flex;justify-content:center;gap:8px;margin:6px 0;">' + lanesHTML + '</div>'
      + '<div style="display:flex;justify-content:center;gap:8px;margin:6px 0;">' + keysHTML + '</div>'
      + '<div id="rt-feedback2" style="font-size:1.8rem;font-weight:700;min-height:36px;"></div>'
      + '<button class="btn" style="margin-top:4px;" onclick="init_gae84ccb5(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 重新开始</button>'
      + '<div id="rt-result2" style="display:none;margin-top:8px;font-size:1.1rem;font-weight:700;color:#7c3aed;"></div>'
      + '</div>';
  }

  function reset() {
    if (spawnTimer) clearInterval(spawnTimer);
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    state = { score: 0, combo: 0, maxCombo: 0, notes: [], noteId: 0, playing: true, timeLeft: DURATION };
    buildHTML();
    bindEvents();
    startGame();
  }

  function bindEvents() {
    var keyMap = { 'd': 0, 'f': 1, 'j': 2, 'k': 3 };
    keyHandler = function(e) {
      var lane = keyMap[e.key.toLowerCase()];
      if (lane !== undefined) { e.preventDefault(); hit(lane); }
    };
    document.addEventListener('keydown', keyHandler);

    var keys = container.querySelectorAll('.rt-key2');
    for (var i = 0; i < keys.length; i++) {
      keys[i].addEventListener('mousedown', function(e) {
        hit(parseInt(e.currentTarget.dataset.lane));
      });
    }
  }

  function hit(lane) {
    if (!state.playing) return;
    var keyEl = container.querySelector('.rt-key2[data-lane="' + lane + '"]');
    var laneEl = container.querySelector('#rt-lane2-' + lane);

    // 找该轨道最接近底部的音符
    var notes = state.notes.filter(function(n) { return n.lane === lane && !n.hit && !n.miss; });
    if (notes.length === 0) {
      // 空按 — 红色
      state.combo = 0;
      if (keyEl) { keyEl.style.background = '#fee2e2'; keyEl.style.borderColor = '#ef4444'; keyEl.style.color = '#dc2626'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 150); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 12px rgba(239,68,68,0.4)'; laneEl.style.borderColor = '#ef4444'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      updateUI(); showFB('Miss', '#ef4444'); return;
    }

    var best = notes[0], bestDist = Math.abs(best.y - 235);
    for (var i = 1; i < notes.length; i++) {
      var d = Math.abs(notes[i].y - 235);
      if (d < bestDist) { best = notes[i]; bestDist = d; }
    }

    if (bestDist < 30) { // Perfect — 绿色
      best.hit = true; state.score += 10; state.combo++;
      if (state.combo > state.maxCombo) state.maxCombo = state.combo;
      if (best.el) { best.el.style.background = '#10b981'; best.el.style.transform = 'translateX(-50%) scale(1.6)'; best.el.style.boxShadow = '0 0 24px rgba(16,185,129,0.7)'; }
      if (keyEl) { keyEl.style.background = '#d1fae5'; keyEl.style.borderColor = '#10b981'; keyEl.style.color = '#059669'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 120); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 14px rgba(16,185,129,0.5)'; laneEl.style.borderColor = '#10b981'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      showFB('Perfect!', '#10b981');
    } else if (bestDist < 60) { // Good — 绿色
      best.hit = true; state.score += 5; state.combo++;
      if (state.combo > state.maxCombo) state.maxCombo = state.combo;
      if (best.el) { best.el.style.background = '#34d399'; best.el.style.transform = 'translateX(-50%) scale(1.3)'; best.el.style.boxShadow = '0 0 16px rgba(16,185,129,0.5)'; }
      if (keyEl) { keyEl.style.background = '#d1fae5'; keyEl.style.borderColor = '#34d399'; keyEl.style.color = '#059669'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 120); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 10px rgba(16,185,129,0.35)'; laneEl.style.borderColor = '#34d399'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      showFB('Good', '#34d399');
    } else { // Miss — 红色
      state.combo = 0;
      if (keyEl) { keyEl.style.background = '#fee2e2'; keyEl.style.borderColor = '#ef4444'; keyEl.style.color = '#dc2626'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 150); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 12px rgba(239,68,68,0.4)'; laneEl.style.borderColor = '#ef4444'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      showFB('Miss', '#ef4444');
    }
    updateUI();
  }

  function showFB(text, color) {
    var el = container.querySelector('#rt-feedback2');
    if (!el) return;
    el.textContent = text; el.style.color = color;
    clearTimeout(el._t); el._t = setTimeout(function() { el.textContent = ''; }, 400);
  }

  function spawnNote() {
    if (!state.playing) return;
    var lane = Math.floor(Math.random() * 4);
    var note = { id: state.noteId++, lane: lane, y: -40, hit: false, miss: false, el: null };
    var laneEl = container.querySelector('#rt-lane2-' + lane);
    var nd = document.createElement('div');
    nd.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:#10b981;transition:none;';
    nd.style.top = note.y + 'px';
    laneEl.appendChild(nd);
    note.el = nd;
    state.notes.push(note);
  }

  function updateNotes() {
    for (var i = state.notes.length - 1; i >= 0; i--) {
      var n = state.notes[i];
      if (n.hit || n.miss) {
        if (n.el && n.el.parentNode) n.el.parentNode.removeChild(n.el);
        state.notes.splice(i, 1);
        continue;
      }
      n.y += 1.8;
      if (n.el) n.el.style.top = n.y + 'px';
      if (n.y > 290) {
        n.miss = true; state.combo = 0;
        if (n.el) { n.el.style.background = '#ef4444'; n.el.style.boxShadow = '0 0 12px rgba(239,68,68,0.5)'; }
        updateUI(); showFB('Miss', '#ef4444');
      }
    }
  }

  function updateUI() {
    var s = container.querySelector('#rt-score2');
    if (s) s.textContent = state.score;
    var c = container.querySelector('#rt-combo2');
    if (c) c.textContent = state.combo > 0 ? '🔥 ' + state.combo + ' 连击' : '';
    var t = container.querySelector('#rt-time2');
    if (t) t.textContent = state.timeLeft;
  }

  function countdown() {
    if (!state.playing) return;
    state.timeLeft--;
    updateUI();
    if (state.timeLeft <= 0) endGame();
  }

  function startGame() {
    state.playing = true;
    spawnTimer = setInterval(spawnNote, 700);
    var timeTimer = setInterval(countdown, 1000);
    function loop() {
      if (!state.playing) { clearInterval(timeTimer); return; }
      updateNotes();
      gameLoop = requestAnimationFrame(loop);
    }
    gameLoop = requestAnimationFrame(loop);
  }

  function endGame() {
    state.playing = false;
    if (spawnTimer) clearInterval(spawnTimer);
    if (gameLoop) cancelAnimationFrame(gameLoop);
    var res = container.querySelector('#rt-result2');
    if (res) {
      res.style.display = 'block';
      res.innerHTML = '🎉 游戏结束！得分: <b>' + state.score + '</b> &nbsp;|&nbsp; 最高连击: <b>' + state.maxCombo + '</b>';
    }
  }

  reset();
}
// === maze ===