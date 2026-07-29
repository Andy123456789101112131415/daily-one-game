// ========================= 记忆翻牌 =========================
function initMemory(container) {
  const emojis = ['🐶','🐱','🐰','🦊','🐻','🐼','🐨','🐯'];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flipped = [];      // 当前翻开的卡片索引
  let matched = new Set(); // 已配对的索引
  let moves = 0;
  let lock = false;

  function render() {
    let html = '<div style="text-align:center;">';
    html += '<div class="memory-stats">Moves: <span>' + moves + '</span> &nbsp;|&nbsp; Matched: <span>' + matched.size/2 + '</span> / ' + emojis.length + '</div>';
    html += '<div class="memory-grid">';
    for (let i = 0; i < cards.length; i++) {
      let cls = 'memory-card';
      if (flipped.includes(i) || matched.has(i)) cls += ' flipped';
      if (matched.has(i)) cls += ' matched';
      html += '<div class="' + cls + '" data-idx="' + i + '">' + cards[i] + '</div>';
    }
    html += '</div>';

    if (matched.size === cards.length) {
      html += '<div class="maze-win">🎉 全部配对成功！用了 ' + moves + ' 步！</div>';
    }

    html += '<button class="btn" style="margin-top:12px;" onclick="initMemory(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 新游戏</button>';
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('click', () => {
        if (lock) return;
        const idx = parseInt(card.dataset.idx);
        if (flipped.includes(idx) || matched.has(idx)) return;
        if (flipped.length >= 2) return;

        flipped.push(idx);
        render();

        if (flipped.length === 2) {
          moves++;
          const [a, b] = flipped;
          if (cards[a] === cards[b]) {
            matched.add(a); matched.add(b);
            flipped = [];
            render();
          } else {
            lock = true;
            setTimeout(() => {
              flipped = [];
              lock = false;
              render();
            }, 600);
          }
        }
      });
    });
  }
  render();
}
// === puzzle ===