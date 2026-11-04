function init_g90bea762(container) {
function initGame(container) {
  let sequence = [];
  let currentIndex = 0;
  let score = 0;
  let round = 1;
  let isShowing = false;
  let isInputEnabled = false;
  let timer = null;
  let showTimeout = null;
  let dotElements = [];
  let inputElement = null;
  let numberElement = null;
  let sequenceElement = null;
  let messageElement = null;
  let submitBtn = null;
  let restartBtn = null;
  let progressContainer = null;

  const baseLength = 3;
  const maxRounds = 10;

  function createUI() {
    container.innerHTML = '';
    container.classList.add('mm-game');

    const header = document.createElement('div');
    header.className = 'mm-header';
    const title = document.createElement('div');
    title.className = 'mm-title';
    title.textContent = '数字记忆挑战';
    const stats = document.createElement('div');
    stats.className = 'mm-stats';
    stats.innerHTML = '<div>得分 <span id="mm-score">0</span></div><div>轮次 <span id="mm-round">1</span>/10</div>';
    header.appendChild(title);
    header.appendChild(stats);

    const main = document.createElement('div');
    main.className = 'mm-main';

    const display = document.createElement('div');
    display.className = 'mm-display';
    numberElement = document.createElement('div');
    numberElement.className = 'mm-number';
    sequenceElement = document.createElement('div');
    sequenceElement.className = 'mm-sequence';
    sequenceElement.style.display = 'none';
    display.appendChild(numberElement);
    display.appendChild(sequenceElement);

    const inputArea = document.createElement('div');
    inputArea.className = 'mm-input-area';
    inputElement = document.createElement('input');
    inputElement.className = 'mm-input';
    inputElement.type = 'text';
    inputElement.inputMode = 'numeric';
    inputElement.placeholder = '输入数字';
    inputElement.disabled = true;
    inputElement.maxLength = 10;
    submitBtn = document.createElement('button');
    submitBtn.className = 'mm-btn';
    submitBtn.textContent = '提交';
    submitBtn.disabled = true;
    inputArea.appendChild(inputElement);
    inputArea.appendChild(submitBtn);

    messageElement = document.createElement('div');
    messageElement.className = 'mm-message';

    progressContainer = document.createElement('div');
    progressContainer.className = 'mm-progress';

    const buttons = document.createElement('div');
    buttons.className = 'mm-buttons';
    restartBtn = document.createElement('button');
    restartBtn.className = 'mm-btn mm-btn-secondary';
    restartBtn.textContent = '重新开始';
    buttons.appendChild(restartBtn);

    main.appendChild(display);
    main.appendChild(inputArea);
    main.appendChild(messageElement);
    main.appendChild(progressContainer);
    main.appendChild(buttons);

    container.appendChild(header);
    container.appendChild(main);

    inputElement.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && isInputEnabled) {
        e.preventDefault();
        handleSubmit();
      }
    });

    submitBtn.addEventListener('click', function() {
      if (isInputEnabled) {
        handleSubmit();
      }
    });

    restartBtn.addEventListener('click', function() {
      resetGame();
    });
  }

  function updateStats() {
    const scoreSpan = document.getElementById('mm-score');
    const roundSpan = document.getElementById('mm-round');
    if (scoreSpan) scoreSpan.textContent = score;
    if (roundSpan) roundSpan.textContent = round;
  }

  function updateProgress() {
    progressContainer.innerHTML = '';
    dotElements = [];
    for (let i = 0; i < maxRounds; i++) {
      const dot = document.createElement('div');
      dot.className = 'mm-progress-dot' + (i < round - 1 ? ' active' : '');
      progressContainer.appendChild(dot);
      dotElements.push(dot);
    }
  }

  function generateSequence(length) {
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 10));
    }
    return seq;
  }

  function showSequence() {
    isShowing = true;
    isInputEnabled = false;
    inputElement.disabled = true;
    submitBtn.disabled = true;
    numberElement.style.display = 'none';
    sequenceElement.style.display = 'block';
    sequenceElement.textContent = sequence.join('');
    messageElement.textContent = '请记住这个数字序列';

    showTimeout = setTimeout(function() {
      sequenceElement.style.display = 'none';
      numberElement.style.display = 'block';
      numberElement.textContent = '?';
      messageElement.textContent = '请输入你看到的数字序列';
      isShowing = false;
      isInputEnabled = true;
      inputElement.disabled = false;
      submitBtn.disabled = false;
      inputElement.value = '';
      inputElement.focus();
    }, 2000);
  }

  function handleSubmit() {
    if (!isInputEnabled) return;
    const userInput = inputElement.value.trim();
    if (userInput === '') {
      messageElement.textContent = '请输入数字';
      return;
    }
    if (!/^\d+$/.test(userInput)) {
      messageElement.textContent = '只能输入数字';
      return;
    }
    const correct = sequence.join('');
    if (userInput === correct) {
      score += 10 * round;
      messageElement.textContent = '正确！';
      updateStats();
      round++;
      if (round > maxRounds) {
        endGame(true);
      } else {
        updateStats();
        updateProgress();
        startRound();
      }
    } else {
      messageElement.textContent = '错误！正确序列是：' + correct;
      endGame(false);
    }
  }

  function startRound() {
    if (round > maxRounds) {
      endGame(true);
      return;
    }
    sequence = generateSequence(baseLength + round - 1);
    currentIndex = 0;
    updateStats();
    updateProgress();
    showSequence();
  }

  function endGame(win) {
    isInputEnabled = false;
    inputElement.disabled = true;
    submitBtn.disabled = true;
    if (win) {
      messageElement.textContent = '恭喜你完成所有轮次！最终得分：' + score;
    } else {
      messageElement.textContent = '游戏结束！最终得分：' + score;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
  }

  function resetGame() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
    sequence = [];
    currentIndex = 0;
    score = 0;
    round = 1;
    isShowing = false;
    isInputEnabled = false;
    inputElement.value = '';
    inputElement.disabled = true;
    submitBtn.disabled = true;
    numberElement.textContent = '';
    sequenceElement.textContent = '';
    sequenceElement.style.display = 'none';
    numberElement.style.display = 'block';
    messageElement.textContent = '';
    updateStats();
    updateProgress();
    startRound();
  }

  createUI();
  resetGame();
}
}