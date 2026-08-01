function init_g554863fb(container) {
function(container) {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameOver = false;
  let scores = { win: 0, lose: 0, draw: 0 };

  const statusEl = document.createElement('div');
  statusEl.className = 'ttt-status';
  const restartBtn = document.createElement('button');
  restartBtn.className = 'ttt-restart';
  restartBtn.textContent = '🔄 重来';

  function createBoard() {
    container.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'ttt-header';
    const title = document.createElement('div');
    title.className = 'ttt-title';
    title.textContent = '井字棋';
    const score = document.createElement('div');
    score.className = 'ttt-score';
    score.id = 'ttt-score';
    updateScore();
    header.appendChild(title);
    header.appendChild(score);

    const boardEl = document.createElement('div');
    boardEl.className = 'ttt-board';
    boardEl.id = 'ttt-board';

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('button');
      cell.className = 'ttt-cell';
      cell.dataset.index = i;
      cell.addEventListener('click', handleCellClick);
      boardEl.appendChild(cell);
    }

    container.appendChild(header);
    container.appendChild(boardEl);
    container.appendChild(statusEl);
    container.appendChild(restartBtn);

    restartBtn.addEventListener('click', resetGame);
    document.addEventListener('keydown', handleKeyPress);
  }

  function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    if (board[index] || gameOver) return;
    makeMove(index);
  }

  function handleKeyPress(e) {
    if (gameOver) return;
    const key = e.key;
    if (key >= '1' && key <= '9') {
      const index = parseInt(key) - 1;
      if (board[index] === '') {
        makeMove(index);
      }
    }
  }

  function makeMove(index) {
    board[index] = currentPlayer;
    updateBoardUI();
    if (checkWin(currentPlayer)) {
      gameOver = true;
      if (currentPlayer === 'X') {
        scores.win++;
        statusEl.textContent = '你赢了！';
        statusEl.className = 'ttt-status ttt-win';
      } else {
        scores.lose++;
        statusEl.textContent = 'AI 赢了！';
        statusEl.className = 'ttt-status ttt-lose';
      }
      updateScore();
      return;
    }
    if (board.every(cell => cell !== '')) {
      gameOver = true;
      scores.draw++;
      statusEl.textContent = '平局！';
      statusEl.className = 'ttt-status ttt-draw';
      updateScore();
      return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
      setTimeout(aiMove, 300);
    }
  }

  function aiMove() {
    if (gameOver) return;
    const empty = [];
    for (let i = 0; i < 9; i++) if (board[i] === '') empty.push(i);
    if (empty.length === 0) return;

    let bestScore = -Infinity;
    let bestMove = empty[0];
    for (let i of empty) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
    board[bestMove] = 'O';
    updateBoardUI();
    if (checkWin('O')) {
      gameOver = true;
      scores.lose++;
      statusEl.textContent = 'AI 赢了！';
      statusEl.className = 'ttt-status ttt-lose';
      updateScore();
      return;
    }
    if (board.every(cell => cell !== '')) {
      gameOver = true;
      scores.draw++;
      statusEl.textContent = '平局！';
      statusEl.className = 'ttt-status ttt-draw';
      updateScore();
      return;
    }
    currentPlayer = 'X';
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = '';
        }
      }
      return best;
    }
  }

  function checkWin(player) {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern => pattern.every(i => board[i] === player));
  }

  function updateBoardUI() {
    const cells = container.querySelectorAll('.ttt-cell');
    cells.forEach((cell, i) => {
      cell.textContent = board[i] === 'X' ? 'X' : board[i] === 'O' ? 'O' : '';
      cell.className = 'ttt-cell' + (board[i] === 'X' ? ' ttt-x' : board[i] === 'O' ? ' ttt-o' : '');
      cell.disabled = board[i] !== '' || gameOver;
    });
  }

  function updateScore() {
    const scoreEl = container.querySelector('#ttt-score');
    if (scoreEl) {
      scoreEl.textContent = `胜:${scores.win} 负:${scores.lose} 平:${scores.draw}`;
    }
  }

  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    statusEl.textContent = '';
    statusEl.className = 'ttt-status';
    updateBoardUI();
    updateScore();
  }

  createBoard();
}
}