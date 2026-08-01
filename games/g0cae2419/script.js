function init_g0cae2419(container) {
function(container){
  // 段落库
  const paragraphs = [
    "The quick brown fox jumps over the lazy dog while the sun sets over the quiet hills.",
    "Programming is the art of telling a computer what to do, and it requires patience and logic.",
    "In the midst of winter, I found there was, within me, an invincible summer.",
    "To be or not to be, that is the question that has puzzled philosophers for centuries.",
    "The only way to do great work is to love what you do, and never stop learning."
  ];

  let currentText = '';
  let startTime = null;
  let timerInterval = null;
  let timeElapsed = 0; // 秒
  let finished = false;
  let wpm = 0;
  let accuracy = 100;

  // DOM 元素
  const wrap = document.createElement('div');
  wrap.className = 'tt-wrap';
  wrap.innerHTML = `
    <div class="tt-card">
      <div class="tt-header">
        <span class="tt-title">打字速度测试</span>
        <div class="tt-stats">
          <span class="tt-stat">时间: <span id="tt-time">0</span>s</span>
          <span class="tt-stat">WPM: <span id="tt-wpm">0</span></span>
          <span class="tt-stat">准确率: <span id="tt-acc">100</span>%</span>
        </div>
      </div>
      <div class="tt-text-display" id="tt-text-display">点击开始后显示</div>
      <textarea class="tt-input" id="tt-input" placeholder="开始后在这里输入..." disabled></textarea>
      <div class="tt-error" id="tt-error"></div>
      <div class="tt-actions">
        <button class="tt-btn" id="tt-start">开始</button>
        <button class="tt-btn-secondary" id="tt-reset">重来</button>
      </div>
    </div>
    <div class="tt-celebrate" id="tt-celebrate">
      <h3>🎉 完成!</h3>
      <p>WPM: <span id="tt-final-wpm">0</span> | 准确率: <span id="tt-final-acc">0</span>%</p>
      <button class="tt-btn" id="tt-celebrate-close">继续</button>
    </div>
  `;
  container.appendChild(wrap);

  // 获取元素
  const textDisplay = wrap.querySelector('#tt-text-display');
  const inputArea = wrap.querySelector('#tt-input');
  const startBtn = wrap.querySelector('#tt-start');
  const resetBtn = wrap.querySelector('#tt-reset');
  const timeSpan = wrap.querySelector('#tt-time');
  const wpmSpan = wrap.querySelector('#tt-wpm');
  const accSpan = wrap.querySelector('#tt-acc');
  const errorDiv = wrap.querySelector('#tt-error');
  const celebrate = wrap.querySelector('#tt-celebrate');
  const finalWpm = wrap.querySelector('#tt-final-wpm');
  const finalAcc = wrap.querySelector('#tt-final-acc');
  const celebrateClose = wrap.querySelector('#tt-celebrate-close');

  // 初始化：随机选一段
  function pickText() {
    currentText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    textDisplay.textContent = currentText;
  }

  // 开始游戏
  function startGame() {
    if (finished) return; // 防止重复开始
    pickText();
    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.focus();
    startBtn.disabled = true;
    resetBtn.disabled = false;
    errorDiv.textContent = '';
    startTime = Date.now();
    timeElapsed = 0;
    timerInterval = setInterval(updateTimer, 100); // 100ms更新
    updateStats();
  }

  // 更新计时器
  function updateTimer() {
    if (startTime) {
      timeElapsed = (Date.now() - startTime) / 1000;
      timeSpan.textContent = Math.floor(timeElapsed);
      updateStats();
    }
  }

  // 更新统计
  function updateStats() {
    const inputVal = inputArea.value;
    const wordsTyped = inputVal.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minutes = timeElapsed / 60;
    wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    wpmSpan.textContent = wpm;

    // 计算准确率（基于字符）
    if (inputVal.length === 0) {
      accuracy = 100;
    } else {
      let correct = 0;
      for (let i = 0; i < inputVal.length; i++) {
        if (i < currentText.length && inputVal[i] === currentText[i]) correct++;
      }
      accuracy = Math.round((correct / inputVal.length) * 100);
    }
    accSpan.textContent = accuracy;
  }

  // 检查输入并高亮
  inputArea.addEventListener('input', function() {
    if (finished) return;
    updateStats();
    const inputVal = inputArea.value;
    // 高亮显示：将文本分为正确、错误、未输入部分
    let html = '';
    for (let i = 0; i < currentText.length; i++) {
      if (i < inputVal.length) {
        if (inputVal[i] === currentText[i]) {
          html += `<span style="color:#10b981;">${currentText[i]}</span>`;
        } else {
          html += `<span style="color:#ef4444;text-decoration:underline;">${currentText[i]}</span>`;
        }
      } else {
        html += currentText[i];
      }
    }
    textDisplay.innerHTML = html;

    // 完成检测：输入长度等于文本且所有字符正确
    if (inputVal.length === currentText.length && inputVal === currentText) {
      finishGame();
    }
  });

  // 完成游戏
  function finishGame() {
    clearInterval(timerInterval);
    startTime = null;
    finished = true;
    inputArea.disabled = true;
    startBtn.disabled = true;
    // 计算最终WPM（基于单词数）
    const words = currentText.trim().split(/\s+/).length;
    const minutes = timeElapsed / 60;
    const finalWpmVal = minutes > 0 ? Math.round(words / minutes) : 0;
    wpmSpan.textContent = finalWpmVal;
    finalWpm.textContent = finalWpmVal;
    finalAcc.textContent = accuracy;
    celebrate.classList.add('show');
  }

  // 重置游戏
  function resetGame() {
    clearInterval(timerInterval);
    startTime = null;
    timeElapsed = 0;
    finished = false;
    wpm = 0;
    accuracy = 100;
    inputArea.value = '';
    inputArea.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = true;
    timeSpan.textContent = '0';
    wpmSpan.textContent = '0';
    accSpan.textContent = '100';
    errorDiv.textContent = '';
    celebrate.classList.remove('show');
    pickText();
  }

  // 事件绑定
  startBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);
  celebrateClose.addEventListener('click', function() {
    celebrate.classList.remove('show');
    resetGame();
  });

  // 键盘快捷键：Ctrl+Enter 开始，Ctrl+R 重来（但防止浏览器刷新）
  wrap.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      if (!startBtn.disabled) startGame();
    } else if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      resetGame();
    }
  });

  // 初始显示
  pickText();
  resetBtn.disabled = true;
}
}