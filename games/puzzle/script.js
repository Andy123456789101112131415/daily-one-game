// ========================= 数字谜题 =========================
function initPuzzle(container) {
  let puzzleIndex = 0;
  let score = 0;
  const puzzles = [
    { title: '🔢 Find the Pattern', question: 'Sequence: 2, 3, 5, 7, 11, ?\nWhat is the next number?', hint: 'These numbers can only be divided by 1 and themselves...', answer: '13' },
    { title: '🃏 24 Game', question: 'Using 3, 3, 8, 8 each exactly once,\nmake 24 with + - × ÷', hint: 'Hint: 8 ÷ (3 - 8 ÷ 3) = ?', answer: '24' },
    { title: '💡 Brain Teaser', question: '1 = 5\n2 = 10\n3 = 15\n4 = 20\n5 = ?', hint: 'Look at the first equation carefully...', answer: '1' },
    { title: '🔢 Missing Number', question: 'Find the pattern:\n2, 6, 12, 20, 30, ?', hint: '2=1×2, 6=2×3, 12=3×4, 20=4×5...', answer: '42' },
    { title: '💡 Math Puzzle', question: 'A number added to itself equals\nitself multiplied by itself.\nWhat is it? (integer)', hint: 'x + x = x × x  →  2x = x²', answer: '2' }
  ].sort(() => Math.random() - 0.5);

  function renderPuzzle() {
    let html = '<div>';
    if (puzzleIndex >= puzzles.length) {
      html += '<div class="maze-win">🎉 All done! Score: ' + score + '/' + puzzles.length + '</div>';
      html += '<div style="text-align:center;"><button class="btn primary" onclick="initPuzzle(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 Play Again</button></div>';
      container.innerHTML = html;
      return;
    }
    const p = puzzles[puzzleIndex];
    html += '<div class="puzzle-progress">Question ' + (puzzleIndex+1) + ' / ' + puzzles.length + ' &nbsp;|&nbsp; ✅ ' + score + ' pts</div>';
    html += '<div class="puzzle-card">';
    html += '<h3>' + p.title + '</h3>';
    html += '<div class="question">' + p.question + '</div>';
    html += '<div class="puzzle-input">';
    html += '<input type="text" id="puzzleAnswer" placeholder="Your answer..." autocomplete="off">';
    html += '<button onclick="checkPuzzleAnswer()">Submit</button>';
    html += '</div>';
    html += '<div class="puzzle-feedback" id="puzzleFeedback"></div>';
    html += '</div>';
    html += '<div style="text-align:center;"><button class="btn" onclick="initPuzzle(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 New Set</button></div>';
    html += '</div>';
    container.innerHTML = html;

    window.checkPuzzleAnswer = function() {
      const input = $('#puzzleAnswer').value.trim();
      const fb = $('#puzzleFeedback');
      if (input === p.answer || input.toLowerCase() === p.answer.toLowerCase()) {
        fb.className = 'puzzle-feedback correct';
        fb.innerHTML = '✅ Correct! Well done!';
        score++;
        setTimeout(() => { puzzleIndex++; renderPuzzle(); }, 1000);
      } else {
        fb.className = 'puzzle-feedback wrong';
        fb.innerHTML = '❌ Not quite, try again!<div class="hint-text">💡 ' + p.hint + '</div>';
      }
    };
    $('#puzzleAnswer').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkPuzzleAnswer();
    });
  }
  renderPuzzle();
}
// === sudoku ===