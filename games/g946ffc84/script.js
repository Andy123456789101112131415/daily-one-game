function init_g946ffc84(container) {
function(container){
  // 内部状态
  var colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
  var targetColor = '';
  var score = 0;
  var attempts = 3;
  var gameOver = false;

  // 创建DOM结构
  container.classList.add('cm-game');
  container.innerHTML = '';

  var header = document.createElement('div');
  header.className = 'cm-header';
  var title = document.createElement('div');
  title.className = 'cm-title';
  title.textContent = '色彩配对';
  var scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'cm-score';
  scoreDisplay.textContent = '分数: 0';
  header.appendChild(title);
  header.appendChild(scoreDisplay);

  var target = document.createElement('div');
  target.className = 'cm-target';
  var targetLabel = document.createElement('span');
  targetLabel.className = 'cm-target-label';
  targetLabel.textContent = '目标色';
  var targetColorDiv = document.createElement('div');
  targetColorDiv.className = 'cm-target-color';
  target.appendChild(targetLabel);
  target.appendChild(targetColorDiv);

  var board = document.createElement('div');
  board.className = 'cm-board';
  var cards = [];
  for (var i = 0; i < 9; i++) {
    var card = document.createElement('div');
    card.className = 'cm-card';
    card.dataset.index = i;
    board.appendChild(card);
    cards.push(card);
  }

  var message = document.createElement('div');
  message.className = 'cm-message';
  message.textContent = '点击与目标色相同的卡片';

  var resetBtn = document.createElement('button');
  resetBtn.className = 'cm-btn';
  resetBtn.textContent = '重新开始';

  container.appendChild(header);
  container.appendChild(target);
  container.appendChild(board);
  container.appendChild(message);
  container.appendChild(resetBtn);

  // 辅助函数
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function resetGame() {
    score = 0;
    attempts = 3;
    gameOver = false;
    scoreDisplay.textContent = '分数: 0';
    message.textContent = '点击与目标色相同的卡片';
    message.className = 'cm-message';
    generateRound();
  }

  function generateRound() {
    // 随机目标色
    targetColor = getRandomColor();
    targetColorDiv.style.backgroundColor = targetColor;

    // 生成卡片颜色：随机选9个颜色，确保至少有一个是目标色
    var cardColors = [];
    // 保证目标色出现1~3次
    var targetCount = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < targetCount; i++) {
      cardColors.push(targetColor);
    }
    while (cardColors.length < 9) {
      var c = getRandomColor();
      if (c !== targetColor) {
        cardColors.push(c);
      }
    }
    // 打乱
    cardColors = shuffleArray(cardColors);

    // 更新卡片背景
    for (var j = 0; j < 9; j++) {
      cards[j].style.backgroundColor = cardColors[j];
      cards[j].classList.remove('cm-disabled');
      cards[j].dataset.color = cardColors[j];
    }
  }

  function handleCardClick(e) {
    if (gameOver) return;
    var card = e.target;
    if (!card.classList.contains('cm-card') || card.classList.contains('cm-disabled')) return;
    var cardColor = card.dataset.color;
    if (cardColor === targetColor) {
      // 正确
      score += 10;
      scoreDisplay.textContent = '分数: ' + score;
      message.textContent = '正确！+10分';
      message.className = 'cm-message cm-win';
      card.classList.add('cm-disabled');
      // 检查是否所有正确卡片都已点击
      var remainingCorrect = false;
      var correctCards = document.querySelectorAll('.cm-card[data-color="' + targetColor + '"]');
      for (var i = 0; i < correctCards.length; i++) {
        if (!correctCards[i].classList.contains('cm-disabled')) {
          remainingCorrect = true;
          break;
        }
      }
      if (!remainingCorrect) {
        // 所有目标色都点完了，进入下一轮
        setTimeout(function() {
          message.textContent = '进入下一轮！';
          message.className = 'cm-message';
          generateRound();
        }, 500);
      }
    } else {
      // 错误
      attempts--;
      message.textContent = '错误！剩余尝试 ' + attempts;
      message.className = 'cm-message cm-lose';
      if (attempts <= 0) {
        gameOver = true;
        message.textContent = '游戏结束！得分 ' + score;
        message.className = 'cm-message cm-lose';
        // 禁用所有卡片
        for (var i = 0; i < cards.length; i++) {
          cards[i].classList.add('cm-disabled');
        }
      }
    }
  }

  // 绑定事件
  board.addEventListener('click', handleCardClick);
  resetBtn.addEventListener('click', resetGame);

  // 初始化第一轮
  resetGame();
}
}