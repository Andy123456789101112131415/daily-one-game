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
    container.innerHTML = '';
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