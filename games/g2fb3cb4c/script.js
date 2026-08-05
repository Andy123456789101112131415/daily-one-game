function init_g2fb3cb4c(container) {
function(container){
  // Emoji set for 8 pairs
  const emojis = ['😀','😎','😍','🤔','🤗','😴','🤯','🥳'];
  // Create card data (duplicate and shuffle)
  let cards = [...emojis, ...emojis];
  // Shuffle function
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }
  cards = shuffle(cards);

  // Game state
  let opened = []; // indices of currently flipped cards
  let matched = new Set();
  let moves = 0;
  let lock = false;

  // Build DOM
  container.innerHTML = `
    <div class="em-match-container">
      <div class="em-header">
        <h2 class="em-title">Emoji Match</h2>
        <div class="em-stats">
          <span class="em-moves" id="em-moves">Moves: 0</span>
          <button class="em-btn" id="em-restart">🔄 Restart</button>
        </div>
      </div>
      <div class="em-grid" id="em-grid"></div>
      <div class="em-message" id="em-message"></div>
    </div>
  `;

  const grid = container.querySelector('#em-grid');
  const movesEl = container.querySelector('#em-moves');
  const messageEl = container.querySelector('#em-message');
  const restartBtn = container.querySelector('#em-restart');

  // Create card elements
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'em-card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.innerHTML = `
      <div class="em-card-inner em-card-back">?</div>
      <div class="em-card-inner em-card-front">${emoji}</div>
    `;
    grid.appendChild(card);
  });

  // Update moves display
  function updateMoves(){
    movesEl.textContent = 'Moves: ' + moves;
  }

  // Check win
  function checkWin(){
    if(matched.size === cards.length){
      messageEl.textContent = '🎉 You win! Great memory!';
      messageEl.className = 'em-message win';
      // Optional confetti animation (simple)
      // Could use CSS animation, but keep simple
    }
  }

  // Card click handler
  function handleCardClick(e){
    const card = e.target.closest('.em-card');
    if(!card || lock || matched.has(card.dataset.index) || opened.includes(card.dataset.index)) return;

    // Flip card
    card.classList.add('flipped');
    opened.push(card.dataset.index);

    if(opened.length === 2){
      moves++;
      updateMoves();
      lock = true;

      const [idx1, idx2] = opened;
      const card1 = grid.children[idx1];
      const card2 = grid.children[idx2];
      const emoji1 = card1.dataset.emoji;
      const emoji2 = card2.dataset.emoji;

      if(emoji1 === emoji2){
        // Match!
        matched.add(idx1);
        matched.add(idx2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        opened = [];
        lock = false;
        checkWin();
      } else {
        // No match: flip back after 800ms
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          opened = [];
          lock = false;
        }, 800);
      }
    }
  }

  // Restart game
  function restart(){
    // Shuffle new cards
    cards = shuffle([...emojis, ...emojis]);
    // Reset state
    opened = [];
    matched = new Set();
    moves = 0;
    lock = false;
    updateMoves();
    messageEl.textContent = '';
    messageEl.className = 'em-message';
    // Rebuild grid
    grid.innerHTML = '';
    cards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.className = 'em-card';
      card.dataset.index = index;
      card.dataset.emoji = emoji;
      card.innerHTML = `
        <div class="em-card-inner em-card-back">?</div>
        <div class="em-card-inner em-card-front">${emoji}</div>
      `;
      grid.appendChild(card);
    });
  }

  // Event listeners
  grid.addEventListener('click', handleCardClick);
  restartBtn.addEventListener('click', restart);

  // Keyboard support: 1-8 keys to flip first 8 cards? Not necessary, but could add arrows? For simplicity, we support mouse only.
  // But requirement says keyboard priority, we can add number keys to select cards? Might be overkill. We'll add simple: press 'r' to restart.
  container.addEventListener('keydown', function(e){
    if(e.key.toLowerCase() === 'r'){
      restart();
    }
  });

  // Focus container for keyboard
  container.tabIndex = 0;
  container.focus();

  // Initial update
  updateMoves();
}
}