function init_g08612630(container) {
const state = { level: 1, score: 0, currentNumber: '', input: '', phase: 'show', timer: null, best: 0 };
const displayEl = container.querySelector('.nm-display');
const scoreEl = container.querySelector('.nm-score');
const levelEl = container.querySelector('.nm-level');
const messageEl = container.querySelector('.nm-message');
const inputEl = container.querySelector('.nm-input');
const submitBtn = container.querySelector('.nm-submit');
const restartBtn = container.querySelector('.nm-restart');
const celebrationEl = container.querySelector('.nm-celebration');

function generateNumber(len) {
  let num = '';
  for (let i = 0; i < len; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

function startRound() {
  clearTimeout(state.timer);
  state.phase = 'show';
  state.input = '';
  state.currentNumber = generateNumber(state.level);
  displayEl.textContent = state.currentNumber;
  displayEl.style.color = '#1e293b';
  messageEl.textContent = '记住这个数字';
  messageEl.className = 'nm-message';
  inputEl.value = '';
  inputEl.disabled = true;
  submitBtn.disabled = true;
  const showTime = Math.max(1000, 2000 - (state.level - 1) * 100);
  state.timer = setTimeout(() => {
    displayEl.textContent = '?';
    displayEl.style.color = '#64748b';
    messageEl.textContent = '输入你看到的数字';
    inputEl.disabled = false;
    submitBtn.disabled = false;
    inputEl.focus();
    state.phase = 'input';
  }, showTime);
}

function checkAnswer() {
  if (state.phase !== 'input') return;
  const userInput = inputEl.value.trim();
  if (userInput === '') return;
  if (userInput === state.currentNumber) {
    state.score += state.level * 10;
    state.level++;
    state.best = Math.max(state.best, state.score);
    updateScore();
    messageEl.textContent = '正确！进入下一关';
    messageEl.className = 'nm-message success';
    inputEl.disabled = true;
    submitBtn.disabled = true;
    state.phase = 'transition';
    createConfetti();
    state.timer = setTimeout(() => { startRound(); }, 1500);
  } else {
    state.phase = 'over';
    displayEl.textContent = state.currentNumber;
    displayEl.style.color = '#ef4444';
    messageEl.textContent = '错误！正确数字是 ' + state.currentNumber;
    messageEl.className = 'nm-message error';
    inputEl.disabled = true;
    submitBtn.disabled = true;
    state.timer = setTimeout(() => { resetGame(); }, 2500);
  }
}

function updateScore() {
  scoreEl.textContent = '分数: ' + state.score;
  levelEl.textContent = '关卡: ' + state.level;
}

function createConfetti() {
  const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'nm-confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
    celebrationEl.appendChild(confetti);
    setTimeout(() => { confetti.remove(); }, 3000);
  }
}

function resetGame() {
  clearTimeout(state.timer);
  state.level = 1;
  state.score = 0;
  state.phase = 'show';
  state.currentNumber = '';
  state.input = '';
  updateScore();
  startRound();
}

submitBtn.addEventListener('click', checkAnswer);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkAnswer();
  }
});
restartBtn.addEventListener('click', resetGame);

updateScore();
startRound();
}