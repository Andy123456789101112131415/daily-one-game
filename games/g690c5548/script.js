function init_g690c5548(container) {
function(container){
  // State
  let state = 'idle'; // idle, waiting, ready, go, too-early, result
  let timeoutId = null;
  let startTime = 0;
  let resultTime = 0;
  let score = 0;
  let attempts = 0;
  
  // Create DOM structure
  container.classList.add('rr-container');
  container.innerHTML = `
    <div class="rr-card">
      <div class="rr-title">反应速度测试</div>
      <div class="rr-subtitle">屏幕变绿时快速点击，测你的毫秒级反应</div>
      <div class="rr-status" id="rr-status">点击开始</div>
      <div class="rr-area waiting" id="rr-area">点击开始</div>
      <div class="rr-info">
        <div class="rr-score">得分: <span id="rr-score">0</span> 分</div>
        <button class="rr-btn" id="rr-reset">🔄 重来</button>
      </div>
    </div>
  `;
  
  // Get references
  const statusEl = container.querySelector('#rr-status');
  const area = container.querySelector('#rr-area');
  const scoreEl = container.querySelector('#rr-score');
  const resetBtn = container.querySelector('#rr-reset');
  
  // Functions
  function setState(newState) {
    state = newState;
    area.className = 'rr-area';
    switch(newState) {
      case 'idle':
        area.classList.add('waiting');
        area.textContent = '点击开始';
        statusEl.textContent = '准备就绪';
        break;
      case 'waiting':
        area.classList.add('waiting');
        area.textContent = '等待绿色...';
        statusEl.textContent = '等待中...';
        break;
      case 'ready':
        area.classList.add('ready');
        area.textContent = '等待变绿';
        statusEl.textContent = '即将变绿，做好准备';
        break;
      case 'go':
        area.classList.add('go');
        area.textContent = '点击！';
        statusEl.textContent = '点击！';
        startTime = performance.now();
        break;
      case 'too-early':
        area.classList.add('too-early');
        area.textContent = '太早了！';
        statusEl.textContent = '太早了！';
        break;
      case 'result':
        area.classList.add('result');
        area.textContent = `${resultTime}ms`;
        statusEl.textContent = '反应时间';
        break;
    }
  }
  
  function handleClick() {
    if (state === 'idle') {
      startGame();
    } else if (state === 'ready') {
      // Too early
      clearTimeout(timeoutId);
      setState('too-early');
      setTimeout(() => {
        startGame();
      }, 1000);
    } else if (state === 'go') {
      // Success
      resultTime = performance.now() - startTime;
      attempts++;
      score = Math.max(score, Math.round(1000 / resultTime));
      scoreEl.textContent = score;
      setState('result');
      // Add highlight effect
      area.classList.add('rr-highlight');
      setTimeout(() => area.classList.remove('rr-highlight'), 500);
      // Allow restart after a short delay
      setTimeout(() => {
        setState('idle');
        area.textContent = '点击开始';
        statusEl.textContent = '点击开始';
      }, 1500);
    } else if (state === 'too-early' || state === 'result') {
      // Ignore clicks during these states
      return;
    }
  }
  
  function startGame() {
    attempts = 0;
    score = 0;
    scoreEl.textContent = '0';
    setState('waiting');
    // Random delay 1-3 seconds
    const delay = 1000 + Math.random() * 2000;
    timeoutId = setTimeout(() => {
      setState('go');
    }, delay);
  }
  
  function resetGame() {
    clearTimeout(timeoutId);
    attempts = 0;
    score = 0;
    scoreEl.textContent = '0';
    setState('idle');
  }
  
  // Event listeners
  area.addEventListener('click', handleClick);
  resetBtn.addEventListener('click', resetGame);
  
  // Keyboard support (Enter/Space)
  container.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  });
  
  // Make container focusable for keyboard
  container.setAttribute('tabindex', '0');
  container.focus();
  
  // Initial state
  setState('idle');
}
}