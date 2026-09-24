function init_g5eabda53(container) {
/* 修复：容器引用、事件委托、计时器、重置、胜利判定、键盘支持 */
(function(){
  const container = document.querySelector('.game-container');
  if(!container) return;

  const boardSize = 3;
  let board = [];
  let emptyPos = {r: boardSize - 1, c: boardSize - 1};
  let moves = 0;
  let startTime = null;
  let timerInterval = null;
  let gameWon = false;

  const boardEl = container.querySelector('.game-board');
  const movesEl = container.querySelector('.moves');
  const timeEl = container.querySelector('.time');
  const messageEl = container.querySelector('.game-message');
  const resetBtn = container.querySelector('.btn-reset');

  function initBoard(){
    board = Array.from({length: boardSize}, () => Array(boardSize).fill(0));
    let nums = [];
    for(let i = 1; i < boardSize * boardSize; i++) nums.push(i);
    nums.push(0);
    for(let i = nums.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    let idx = 0;
    for(let r = 0; r < boardSize; r++){
      for(let c = 0; c < boardSize; c++){
        board[r][c] = nums[idx];
        if(nums[idx] === 0) emptyPos = {r, c};
        idx++;
      }
    }
  }

  function render(){
    boardEl.innerHTML = '';
    for(let r = 0; r < boardSize; r++){
      for(let c = 0; c < boardSize; c++){
        const val = board[r][c];
        const tile = document.createElement('div');
        tile.className = 'tile' + (val === 0 ? ' empty' : '');
        if(val !== 0){
          tile.textContent = val;
          if(val === r * boardSize + c + 1) tile.classList.add('correct');
        }
        tile.dataset.r = r;
        tile.dataset.c = c;
        boardEl.appendChild(tile);
      }
    }
  }

  function moveTile(r, c){
    if(gameWon) return;
    if(r < 0 || r >= boardSize || c < 0 || c >= boardSize) return;
    const dr = Math.abs(r - emptyPos.r);
    const dc = Math.abs(c - emptyPos.c);
    if((dr === 1 && dc === 0) || (dr === 0 && dc === 1)){
      board[emptyPos.r][emptyPos.c] = board[r][c];
      board[r][c] = 0;
      emptyPos = {r, c};
      moves++;
      updateStats();
      render();
      checkWin();
    }
  }

  function checkWin(){
    let win = true;
    for(let r = 0; r < boardSize; r++){
      for(let c = 0; c < boardSize; c++){
        const expected = r * boardSize + c + 1;
        if(r === boardSize - 1 && c === boardSize - 1){
          if(board[r][c] !== 0) win = false;
        } else if(board[r][c] !== expected){
          win = false;
        }
      }
    }
    if(win){
      gameWon = true;
      clearInterval(timerInterval);
      timerInterval = null;
      messageEl.textContent = '🎉 恭喜！你赢了！';
      messageEl.classList.add('win');
      setTimeout(() => messageEl.classList.remove('win'), 1500);
    }
  }

  function updateStats(){
    movesEl.textContent = moves;
    if(!startTime){
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        timeEl.textContent = `${mins}:${secs}`;
      }, 500);
    }
  }

  function resetGame(){
    clearInterval(timerInterval);
    timerInterval = null;
    moves = 0;
    startTime = null;
    gameWon = false;
    movesEl.textContent = '0';
    timeEl.textContent = '00:00';
    messageEl.textContent = '';
    messageEl.classList.remove('win');
    initBoard();
    render();
  }

  boardEl.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if(!tile) return;
    const r = parseInt(tile.dataset.r, 10);
    const c = parseInt(tile.dataset.c, 10);
    if(Number.isNaN(r) || Number.isNaN(c)) return;
    moveTile(r, c);
  });

  document.addEventListener('keydown', (e) => {
    if(gameWon) return;
    let dr = 0, dc = 0;
    if(e.key === 'ArrowUp') dr = 1;
    else if(e.key === 'ArrowDown') dr = -1;
    else if(e.key === 'ArrowLeft') dc = 1;
    else if(e.key === 'ArrowRight') dc = -1;
    else return;
    e.preventDefault();
    const r = emptyPos.r + dr;
    const c = emptyPos.c + dc;
    moveTile(r, c);
  });

  if(resetBtn) resetBtn.addEventListener('click', resetGame);

  resetGame();
})();
}