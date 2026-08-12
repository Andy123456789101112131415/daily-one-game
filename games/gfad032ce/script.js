function init_gfad032ce(container) {
function(container){
  // 游戏状态
  var board = [];
  var emptyIndex = 15;
  var moves = 0;
  var gameWon = false;

  // 初始化棋盘（打乱保证可解）
  function initBoard() {
    board = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
    // 打乱：随机移动空白格多次（保证可解）
    for (var i = 0; i < 1000; i++) {
      var possibleMoves = getPossibleMoves(emptyIndex);
      var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      // 交换
      board[emptyIndex] = board[randomMove];
      board[randomMove] = 0;
      emptyIndex = randomMove;
    }
    // 确保不是已完成状态
    if (isSolved()) {
      // 交换最后两个非零数字（保持可解）
      board[14] = 13;
      board[13] = 14;
      // 调整空位
      // 因为空位在15，但我们交换了13和14，不影响空位
    }
    moves = 0;
    gameWon = false;
  }

  // 获取空白格可移动的邻居索引
  function getPossibleMoves(empty) {
    var moves = [];
    var row = Math.floor(empty / 4);
    var col = empty % 4;
    // 上
    if (row > 0) moves.push(empty - 4);
    // 下
    if (row < 3) moves.push(empty + 4);
    // 左
    if (col > 0) moves.push(empty - 1);
    // 右
    if (col < 3) moves.push(empty + 1);
    return moves;
  }

  // 检查是否胜利
  function isSolved() {
    for (var i = 0; i < 15; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[15] === 0;
  }

  // 渲染棋盘
  function render() {
    var boardEl = container.querySelector('.sp-board');
    boardEl.innerHTML = '';
    for (var i = 0; i < 16; i++) {
      var tile = document.createElement('div');
      tile.className = 'sp-tile';
      if (board[i] === 0) {
        tile.classList.add('sp-tile-empty');
        tile.textContent = '';
      } else {
        tile.textContent = board[i];
        // 根据数字分配颜色（可选）
        var colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];
        // 简单分配：数字1-4用紫，5-8青，9-12绿，13-15金
        var colorIndex = Math.floor((board[i] - 1) / 4);
        tile.style.background = colors[colorIndex];
      }
      tile.dataset.index = i;
      tile.addEventListener('click', handleTileClick);
      boardEl.appendChild(tile);
    }
    // 更新步数
    var movesEl = container.querySelector('.sp-moves');
    movesEl.textContent = '步数: ' + moves;
    // 检测胜利
    if (isSolved() && !gameWon) {
      gameWon = true;
      var header = container.querySelector('.sp-header');
      header.classList.add('sp-win');
      // 可以添加庆祝效果（简单闪烁）
      var tiles = container.querySelectorAll('.sp-tile:not(.sp-tile-empty)');
      for (var j = 0; j < tiles.length; j++) {
        tiles[j].classList.add('sp-tile-win');
      }
      // 显示胜利信息
      setTimeout(function() {
        alert('恭喜！你用了 ' + moves + ' 步完成！');
      }, 100);
    }
  }

  // 处理点击
  function handleTileClick(e) {
    if (gameWon) return;
    var index = parseInt(e.target.dataset.index);
    // 检查是否可移动（与空白相邻）
    var possible = getPossibleMoves(emptyIndex);
    if (possible.indexOf(index) !== -1) {
      // 交换
      board[emptyIndex] = board[index];
      board[index] = 0;
      emptyIndex = index;
      moves++;
      render();
    }
  }

  // 键盘控制
  function handleKeydown(e) {
    if (gameWon) return;
    var key = e.key;
    var row = Math.floor(emptyIndex / 4);
    var col = emptyIndex % 4;
    var target = -1;
    if (key === 'ArrowUp' && row < 3) { // 上移：空白格向下移动，数字向上
      target = emptyIndex + 4;
    } else if (key === 'ArrowDown' && row > 0) {
      target = emptyIndex - 4;
    } else if (key === 'ArrowLeft' && col < 3) {
      target = emptyIndex + 1;
    } else if (key === 'ArrowRight' && col > 0) {
      target = emptyIndex - 1;
    }
    if (target !== -1) {
      e.preventDefault();
      // 交换
      board[emptyIndex] = board[target];
      board[target] = 0;
      emptyIndex = target;
      moves++;
      render();
    }
  }

  // 重新开始
  function restart() {
    initBoard();
    var header = container.querySelector('.sp-header');
    header.classList.remove('sp-win');
    var tiles = container.querySelectorAll('.sp-tile');
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].classList.remove('sp-tile-win');
    }
    render();
  }

  // 构建HTML结构
  container.innerHTML = '<div class="sp-game">' +
    '<div class="sp-header">' +
      '<span class="sp-moves">步数: 0</span>' +
      '<button class="sp-restart">重新开始</button>' +
    '</div>' +
    '<div class="sp-board"></div>' +
  '</div>';

  // 绑定事件
  var restartBtn = container.querySelector('.sp-restart');
  restartBtn.addEventListener('click', restart);
  document.addEventListener('keydown', handleKeydown);

  // 初始化
  initBoard();
  render();

  // 清理函数（可选）
  return function() {
    document.removeEventListener('keydown', handleKeydown);
  };
}
}