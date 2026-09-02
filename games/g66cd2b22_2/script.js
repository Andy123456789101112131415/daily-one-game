function init_g66cd2b22_2(container) {
function(container){
    var board = [];
    var emptyIndex = 15;
    var moves = 0;
    var gameOver = false;

    function init() {
        var nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        // shuffle until solvable
        do {
            shuffle(nums);
            emptyIndex = 15;
            board = nums.concat([0]);
        } while (!isSolvable());
        moves = 0;
        gameOver = false;
        render();
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    function isSolvable() {
        var inv = 0;
        var b = board.slice();
        for (var i = 0; i < 16; i++) {
            for (var j = i + 1; j < 16; j++) {
                if (b[i] !== 0 && b[j] !== 0 && b[i] > b[j]) {
                    inv++;
                }
            }
        }
        var rowEmpty = Math.floor(emptyIndex / 4);
        return (inv % 2 === 0) === (rowEmpty % 2 !== 0);
    }

    function render() {
        var boardDiv = container.querySelector('.hsd-board');
        boardDiv.innerHTML = '';
        for (var i = 0; i < 16; i++) {
            var tile = document.createElement('div');
            tile.className = 'hsd-tile';
            var val = board[i];
            if (val === 0) {
                tile.classList.add('hsd-empty');
                tile.dataset.index = i;
            } else {
                tile.classList.add('hsd-tile-' + val);
                tile.textContent = val;
                tile.dataset.index = i;
                tile.addEventListener('click', function() {
                    var idx = parseInt(this.dataset.index);
                    moveTile(idx);
                });
            }
            boardDiv.appendChild(tile);
        }
        var movesSpan = container.querySelector('.hsd-moves');
        movesSpan.textContent = '步数: ' + moves;
    }

    function moveTile(index) {
        if (gameOver) return;
        var emptyRow = Math.floor(emptyIndex / 4);
        var emptyCol = emptyIndex % 4;
        var row = Math.floor(index / 4);
        var col = index % 4;
        var dr = Math.abs(row - emptyRow);
        var dc = Math.abs(col - emptyCol);
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            board[emptyIndex] = board[index];
            board[index] = 0;
            emptyIndex = index;
            moves++;
            render();
            checkWin();
        }
    }

    function checkWin() {
        var win = true;
        for (var i = 0; i < 15; i++) {
            if (board[i] !== i + 1) {
                win = false;
                break;
            }
        }
        if (win) {
            gameOver = true;
            var winDiv = document.createElement('div');
            winDiv.className = 'hsd-win';
            winDiv.innerHTML = '<h2>🎉 恭喜完成！</h2><p>用了 ' + moves + ' 步</p><button id="hsd-again-win">再来一局</button>';
            container.appendChild(winDiv);
            winDiv.querySelector('#hsd-again-win').addEventListener('click', function() {
                container.removeChild(winDiv);
                init();
            });
        }
    }

    function handleKey(e) {
        if (gameOver) return;
        var key = e.key;
        var row = Math.floor(emptyIndex / 4);
        var col = emptyIndex % 4;
        var newIndex = -1;
        if (key === 'ArrowUp' && row < 3) {
            newIndex = emptyIndex + 4;
        } else if (key === 'ArrowDown' && row > 0) {
            newIndex = emptyIndex - 4;
        } else if (key === 'ArrowLeft' && col < 3) {
            newIndex = emptyIndex + 1;
        } else if (key === 'ArrowRight' && col > 0) {
            newIndex = emptyIndex - 1;
        }
        if (newIndex !== -1) {
            e.preventDefault();
            moveTile(newIndex);
        }
    }

    // build DOM
    container.innerHTML = '<div class="hsd-container"><div class="hsd-header"><span class="hsd-title">数字华容道</span><span class="hsd-moves">步数: 0</span></div><div class="hsd-board"></div><div class="hsd-buttons"><button class="hsd-btn">🔄 重来</button></div></div>';
    var resetBtn = container.querySelector('.hsd-btn');
    resetBtn.addEventListener('click', function() {
        var winDiv = container.querySelector('.hsd-win');
        if (winDiv) container.removeChild(winDiv);
        init();
    });

    // keyboard events
    document.addEventListener('keydown', handleKey);

    // cleanup on re-init? Not needed for this simple game, but we could store and remove later
    // However, we can't easily remove listener, but it's fine as long as container is unique.
    // To be safe, we can use container-specific event, but document is okay.

    init();
}
}