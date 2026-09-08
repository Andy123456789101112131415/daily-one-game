function init_g39979f44(container) {
// container is the game card element
    // Prevent double init
    if (container.querySelector('.ss-game-container')) return;
    // Build DOM
    const gameDiv = document.createElement('div');
    gameDiv.className = 'ss-game-container';
    gameDiv.innerHTML = `
        <canvas class='ss-canvas' width='680' height='520'></canvas>
        <div class='ss-ui'>
            <span class='ss-score'>得分: 0</span>
            <span class='ss-hint'>← → 移动 | 空格射击</span>
        </div>
        <div class='ss-start' style='display:flex;'>
            <h2>天穹战机</h2>
            <p>方向键移动，空格射击</p>
            <button class='ss-btn'>开始游戏</button>
        </div>
    `;
    container.appendChild(gameDiv);

    const canvas = gameDiv.querySelector('.ss-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = gameDiv.querySelector('.ss-score');
    const startScreen = gameDiv.querySelector('.ss-start');
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'ss-gameover';
    gameOverScreen.style.display = 'none';
    gameDiv.appendChild(gameOverScreen);

    // Game state
    const W = canvas.width;
    const H = canvas.height;
    let player = null;
    let enemies = [];
    let bullets = [];
    let particles = [];
    let score = 0;
    let gameRunning = false;
    let gameOver = false;
    let keys = {};
    let lastTime = 0;
    let enemySpawnTimer = 0;
    let animFrame = null;

    // Constants
    const PLAYER_WIDTH = 40;
    const PLAYER_HEIGHT = 40;
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const BULLET_WIDTH = 4;
    const BULLET_HEIGHT = 10;
    const ENEMY_WIDTH = 30;
    const ENEMY_HEIGHT = 30;
    const ENEMY_SPEED = 2;
    const ENEMY_SPAWN_INTERVAL = 1000; // ms

    // Utility: random between
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Draw functions (pure drawing)
    function drawPlayer() {
        ctx.save();
        ctx.translate(player.x, player.y);
        // Body
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        // Cockpit
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(0, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        // Wings
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-20, 15);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(20, 15);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawEnemy(e) {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(10, -10);
        ctx.lineTo(0, -5);
        ctx.lineTo(-10, -10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(0, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawBullet(b) {
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(b.x - BULLET_WIDTH/2, b.y - BULLET_HEIGHT/2, BULLET_WIDTH, BULLET_HEIGHT);
    }

    function drawParticles() {
        for (let p of particles) {
            ctx.globalAlpha = p.life / 1;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // Game update
    function update(dt) {
        // Player movement
        if (keys['ArrowLeft']) player.x -= PLAYER_SPEED * dt * 60;
        if (keys['ArrowRight']) player.x += PLAYER_SPEED * dt * 60;
        // Clamp player
        player.x = Math.max(PLAYER_WIDTH/2, Math.min(W - PLAYER_WIDTH/2, player.x));

        // Shooting
        if (keys[' '] || keys['Space']) {
            // Auto-fire with cooldown? For simplicity, every frame spawn bullet
            if (gameRunning && !gameOver) {
                // Add bullet if not too many
                if (bullets.length < 10) {
                    bullets.push({ x: player.x, y: player.y - 15, active: true });
                }
            }
        }

        // Spawn enemies
        enemySpawnTimer -= dt * 1000;
        if (enemySpawnTimer <= 0) {
            enemies.push({ x: rand(ENEMY_WIDTH/2, W - ENEMY_WIDTH/2), y: -ENEMY_HEIGHT, active: true });
            enemySpawnTimer = ENEMY_SPAWN_INTERVAL;
        }

        // Move enemies
        for (let e of enemies) {
            e.y += ENEMY_SPEED * dt * 60;
        }

        // Move bullets
        for (let b of bullets) {
            b.y -= BULLET_SPEED * dt * 60;
        }

        // Collision detection
        // Bullets vs enemies
        for (let b of bullets) {
            if (!b.active) continue;
            for (let e of enemies) {
                if (!e.active) continue;
                const dist = Math.hypot(b.x - e.x, b.y - e.y);
                if (dist < (BULLET_WIDTH/2 + ENEMY_WIDTH/2)) {
                    b.active = false;
                    e.active = false;
                    score += 10;
                    spawnExplosion(e.x, e.y);
                }
            }
        }
        // Player vs enemies
        for (let e of enemies) {
            if (!e.active) continue;
            const dist = Math.hypot(player.x - e.x, player.y - e.y);
            if (dist < (PLAYER_WIDTH/2 + ENEMY_WIDTH/2)) {
                e.active = false;
                gameOver = true;
                gameRunning = false;
                spawnExplosion(player.x, player.y);
                showGameOver();
                break;
            }
        }

        // Clean up inactive
        enemies = enemies.filter(e => e.active && e.y < H + 50);
        bullets = bullets.filter(b => b.active && b.y > -20);

        // Update particles
        for (let p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
        }
        particles = particles.filter(p => p.life > 0);

        // Update score display
        scoreEl.textContent = '得分: ' + score;
    }

    function spawnExplosion(x, y) {
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: x,
                y: y,
                vx: rand(-100, 100),
                vy: rand(-100, 100),
                life: rand(0.3, 1),
                size: rand(2, 5),
                color: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][Math.floor(rand(0, 5))]
            });
        }
    }

    function showGameOver() {
        gameOverScreen.innerHTML = `
            <h2>游戏结束</h2>
            <p>得分: ${score}</p>
            <button class='ss-btn' id='ss-restart'>重新开始</button>
        `;
        gameOverScreen.style.display = 'flex';
        gameOverScreen.querySelector('#ss-restart').addEventListener('click', resetGame);
    }

    function resetGame() {
        // Reset all
        score = 0;
        enemies = [];
        bullets = [];
        particles = [];
        player.x = W/2;
        player.y = H - 50;
        gameOver = false;
        gameRunning = true;
        enemySpawnTimer = 0;
        gameOverScreen.style.display = 'none';
        scoreEl.textContent = '得分: 0';
    }

    // Main loop
    function loop(time) {
        const dt = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;

        // Clear
        ctx.clearRect(0, 0, W, H);

        // Update if running
        if (gameRunning && !gameOver) {
            update(dt);
        }

        // Draw
        // Draw grid? No, keep simple
        drawPlayer();
        for (let e of enemies) drawEnemy(e);
        for (let b of bullets) drawBullet(b);
        drawParticles();

        animFrame = requestAnimationFrame(loop);
    }

    // Event listeners
    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
        if (['ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key)) e.preventDefault();
    });
    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });

    // Start button
    const startBtn = gameDiv.querySelector('.ss-start .ss-btn');
    startBtn.addEventListener('click', function() {
        startScreen.style.display = 'none';
        // Initialize player
        player = { x: W/2, y: H - 50 };
        score = 0;
        enemies = [];
        bullets = [];
        particles = [];
        gameRunning = true;
        gameOver = false;
        enemySpawnTimer = 0;
        lastTime = performance.now();
        animFrame = requestAnimationFrame(loop);
    });

    // Cleanup on container removal? Not needed for demo
}