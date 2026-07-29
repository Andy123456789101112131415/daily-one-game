// ======== Number Puzzle ========
function initPuzzle(container) {
  var idx = 0, score = 0, dots = [];
  var puzzles = [
    { icon: '🧩', q: '2, 3, 5, 7, 11, ?\n下一个数字是什么？', hint: '只能被1和自身整除的数...', a: '13' },
    { icon: '🃏', q: '用 3, 3, 8, 8 算出 24\n（加减乘除，每个数字用一次）', hint: '8 ÷ (3 - 8 ÷ 3) = 24', a: '24' },
    { icon: '🤔', q: '1 = 5\n2 = 10\n3 = 15\n4 = 20\n5 = ?', hint: '注意第一个等式...', a: '1' },
    { icon: '🔢', q: '2, 6, 12, 20, 30, ?\n找规律填空', hint: '1×2, 2×3, 3×4, 4×5...', a: '42' },
    { icon: '💡', q: '一个数加上自己等于\n自己乘自己，它是？', hint: 'x + x = x × x → 2x = x²', a: '2' }
  ].sort(function(){ return Math.random() - 0.5; });

  function dotsHTML() {
    var h = '<div class="np-score"><b>' + score + '</b> / ' + puzzles.length + ' 题正确</div>';
    h += '<div class="np-progress">';
    for (var i = 0; i < puzzles.length; i++) {
      var cls = 'np-dot';
      if (i < idx) cls += dots[i] ? ' done' : ' wrong';
      else if (i === idx) cls += ' current';
      h += '<div class="' + cls + '"></div>';
    }
    h += '</div>';
    return h;
  }

  function render() {
    var html = '<div class="np-wrap">';
    html += dotsHTML();

    if (idx >= puzzles.length) {
      html += '<div class="np-done"><div class="np-big">' + (score >= 4 ? '🏆' : score >= 2 ? '⭐' : '💪') + '</div>';
      html += '<div class="np-msg">答对 ' + score + ' / ' + puzzles.length + ' 题！</div>';
      html += '<button class="btn primary" onclick="initPuzzle(document.getElementById(\'panelContent\'));event.stopPropagation();">再来一轮</button></div>';
      container.innerHTML = html;
      return;
    }

    var p = puzzles[idx];
    html += '<div class="np-card">';
    html += '<div class="np-icon">' + p.icon + '</div>';
    html += '<div class="np-question">' + p.q + '</div>';
    html += '<div class="np-input-row">';
    html += '<input id="npA" placeholder="输入答案" autocomplete="off">';
    html += '<button onclick="npCheck()">确定</button>';
    html += '</div>';
    html += '<div class="np-feedback" id="npFB"></div>';
    html += '</div>';
    html += '<div style="text-align:center;margin-top:10px;"><button class="btn" onclick="initPuzzle(document.getElementById(\'panelContent\'));event.stopPropagation();">换一批题</button></div>';
    html += '</div>';
    container.innerHTML = html;

    window.npCheck = function() {
      var val = document.getElementById('npA').value.trim();
      var fb = document.getElementById('npFB');
      if (val === p.a || val.toLowerCase() === p.a.toLowerCase()) {
        fb.className = 'np-feedback ok';
        fb.innerHTML = '✅ 正确！';
        score++; dots.push(true);
        setTimeout(function(){ idx++; render(); }, 800);
      } else {
        fb.className = 'np-feedback no';
        fb.innerHTML = '❌ 不对哦<div class="np-hint">💡 ' + p.hint + '</div>';
        dots.push(false); idx++; 
        setTimeout(function(){ render(); }, 2500);
      }
    };

    document.getElementById('npA').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') npCheck();
    });
    setTimeout(function(){ document.getElementById('npA').focus(); }, 100);
  }
  render();
}
