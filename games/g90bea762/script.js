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
    submitBtn.addEventListener('click', handleSubmit);
    restartBtn.addEventListener('click', function() {
      restartGame();
    });
  }

  function generateSequence(length) {
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 10));
    }
    return seq;
  }

  function updateStats() {
    const scoreSpan = container.querySelector('#mm-score');
    const roundSpan = container.querySelector('#mm-round');
    if (scoreSpan) scoreSpan.textContent = score;
    if (roundSpan) roundSpan.textContent = round;
  }

  function updateProgressDots() {
    progressContainer.innerHTML = '';
    dotElements = [];
    for (let i = 0; i < sequence.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'mm-dot';
      if (i < currentIndex) {
        dot.classList.add('correct');
      } else if (i === currentIndex) {
        dot.classList.add('active');
      }
      progressContainer.appendChild(dot);
      dotElements.push(dot);
    }
  }

  function showMessage(text, type) {
    if (!messageElement) return;
    messageElement.textContent = text;
    messageElement.className = 'mm-message ' + (type || '');
  }

  function clearMessage() {
    if (!messageElement) return;
    messageElement.textContent = '';
    messageElement.className = 'mm-message';
  }

  function showSequenceForRound() {
    if (!numberElement || !sequenceElement) return;
    numberElement.style.display = 'none';
    sequenceElement.style.display = 'block';
    sequenceElement.textContent = '';
    let i = 0;
    function showNextDigit() {
      if (i < sequence.length) {
        sequenceElement.textContent = sequence[i];
        i++;
        showTimeout = setTimeout(showNextDigit, 600);
      } else {
        showTimeout = setTimeout(function() {
          sequenceElement.style.display = 'none';
          numberElement.style.display = 'block';
          numberElement.textContent = '?';
          isShowing = false;
          isInputEnabled = true;
          inputElement.disabled = false;
          submitBtn.disabled = false;
          inputElement.value = '';
          inputElement.focus();
          clearMessage();
          updateProgressDots();
          showMessage('输入你看到的数字序列', 'info');
        }, 500);
      }
    }
    showNextDigit();
  }

  function startRound() {
    clearTimeout(timer);
    clearTimeout(showTimeout);
    isInputEnabled = false;
    isShowing = true;
    const length = baseLength + round - 1;
    sequence = generateSequence(length);
    currentIndex = 0;
    if (numberElement) {
      numberElement.textContent = '准备...';
      numberElement.style.display = 'block';
    }
    if (sequenceElement) {
      sequenceElement.style.display = 'none';
    }
    if (inputElement) {
      inputElement.value = '';
      inputElement.disabled = true;
    }
    if (submitBtn) submitBtn.disabled = true;
    updateStats();
    updateProgressDots();
    clearMessage();
    showMessage('记住出现的数字序列', 'info');
    timer = setTimeout(function() {
      showSequenceForRound();
    }, 800);
  }

  function handleSubmit() {
    if (!isInputEnabled) return;
    const userInput = inputElement.value.trim();
    if (!userInput) {
      showMessage('请输入数字', 'error');
      return;
    }
    const correctSequence = sequence.join('');
    if (userInput === correctSequence) {
      score += sequence.length * 10;
      updateStats();
      showMessage('正确！', 'success');
      celebrate();
      isInputEnabled = false;
      inputElement.disabled = true;
      submitBtn.disabled = true;
      round++;
      if (round > maxRounds) {
        endGame(true);
        return;
      }
      timer = setTimeout(function() {
        startRound();
      }, 1000);
    } else {
      showMessage('错误！正确的序列是：' + correctSequence, 'error');
      const displayEl = container.querySelector('.mm-display');
      if (displayEl) {
        displayEl.classList.add('mm-shake');
        setTimeout(function() {
          displayEl.classList.remove('mm-shake');
        }, 400);
      }
      isInputEnabled = false;
      inputElement.disabled = true;
      submitBtn.disabled = true;
      endGame(false);
    }
  }

  function celebrate() {
    for (let i = 0; i < 12; i++) {
      const span = document.createElement('span');
      span.className = 'mm-celebration';
      span.textContent = '★';
      span.style.left = Math.random() * 80 + 10 + '%';
      span.style.top = Math.random() * 40 + 30 + '%';
      span.style.color = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)];
      span.style.animationDelay = Math.random() * 0.3 + 's';
      container.appendChild(span);
      setTimeout(function() {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 1500);
    }
  }

  function endGame(won) {
    isInputEnabled = false;
    inputElement.disabled = true;
    submitBtn.disabled = true;
    if (won) {
      showMessage('恭喜你完成所有轮次！最终得分：' + score, 'success');
      celebrate();
    } else {
      showMessage('游戏结束！最终得分：' + score, 'error');
    }
    restartBtn.textContent = '再玩一次';
  }

  function restartGame() {
    clearTimeout(timer);
    clearTimeout(showTimeout);
    score = 0;
    round = 1;
    isShowing = false;
    isInputEnabled = false;
    sequence = [];
    currentIndex = 0;
    updateStats();
    progressContainer.innerHTML = '';
    dotElements = [];
    clearMessage();
    restartBtn.textContent = '重新开始';
    startRound();
  }

  createUI();
  startRound();
}
}