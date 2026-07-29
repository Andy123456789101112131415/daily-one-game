function init_gae84ccb5(container) {
  var DURATION = 30; // 游戏时长（秒）
  var state, spawnTimer, gameLoop, keyHandler;

  function buildHTML() {
    var lanesHTML = '';
    var keysHTML = '';
    var labels = ['D', 'F', 'J', 'K'];
    for (var i = 0; i < 4; i++) {
      lanesHTML += '<div id="rt-lane2-' + i + '" style="width:64px;height:240px;background:#fff;border:2px solid #e2e8f0;border-radius:10px;position:relative;overflow:hidden;">'
        + '<div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:44px;height:44px;border:3px dashed #e2e8f0;border-radius:50%;"></div>'
        + '</div>';
      keysHTML += '<div class="rt-key2" data-lane="' + i + '" style="width:64px;height:44px;background:#fff;border:2px solid #e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#64748b;cursor:pointer;user-select:none;">' + labels[i] + '</div>';
    }
    container.innerHTML = ''
      + '<div style="text-align:center;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      + '<span style="font-size:1rem;font-weight:700;">RhythmTap</span>'
      + '<span style="font-size:0.9rem;color:#7c3aed;font-weight:700;">分: <span id="rt-score2">0</span></span>'
      + '<span style="font-size:0.85rem;color:#64748b;">⏱ <span id="rt-time2">' + DURATION + '</span>s</span>'
      + '</div>'
      + '<div id="rt-combo2" style="font-size:0.9rem;min-height:22px;color:#f59e0b;font-weight:600;"></div>'
      + '<div style="display:flex;justify-content:center;gap:8px;margin:6px 0;">' + lanesHTML + '</div>'
      + '<div style="display:flex;justify-content:center;gap:8px;margin:6px 0;">' + keysHTML + '</div>'
      + '<div id="rt-feedback2" style="font-size:1.8rem;font-weight:700;min-height:36px;"></div>'
      + '<button class="btn" style="margin-top:4px;" onclick="init_gae84ccb5(document.getElementById(\'panelContent\'));event.stopPropagation();">🔄 重新开始</button>'
      + '<div id="rt-result2" style="display:none;margin-top:8px;font-size:1.1rem;font-weight:700;color:#7c3aed;"></div>'
      + '</div>';
  }

  function reset() {
    if (spawnTimer) clearInterval(spawnTimer);
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    state = { score: 0, combo: 0, maxCombo: 0, notes: [], noteId: 0, playing: true, timeLeft: DURATION };
    buildHTML();
    bindEvents();
    startGame();
  }

  function bindEvents() {
    var keyMap = { 'd': 0, 'f': 1, 'j': 2, 'k': 3 };
    keyHandler = function(e) {
      var lane = keyMap[e.key.toLowerCase()];
      if (lane !== undefined) { e.preventDefault(); hit(lane); }
    };
    document.addEventListener('keydown', keyHandler);

    var keys = container.querySelectorAll('.rt-key2');
    for (var i = 0; i < keys.length; i++) {
      keys[i].addEventListener('mousedown', function(e) {
        hit(parseInt(e.currentTarget.dataset.lane));
      });
    }
  }

  function hit(lane) {
    if (!state.playing) return;
    var keyEl = container.querySelector('.rt-key2[data-lane="' + lane + '"]');
    var laneEl = container.querySelector('#rt-lane2-' + lane);

    // 找该轨道最接近底部的音符
    var notes = state.notes.filter(function(n) { return n.lane === lane && !n.hit && !n.miss; });
    if (notes.length === 0) {
      // 空按 — 红色
      state.combo = 0;
      if (keyEl) { keyEl.style.background = '#fee2e2'; keyEl.style.borderColor = '#ef4444'; keyEl.style.color = '#dc2626'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 150); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 12px rgba(239,68,68,0.4)'; laneEl.style.borderColor = '#ef4444'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      updateUI(); showFB('Miss', '#ef4444'); return;
    }

    var best = notes[0], bestDist = Math.abs(best.y - 235);
    for (var i = 1; i < notes.length; i++) {
      var d = Math.abs(notes[i].y - 235);
      if (d < bestDist) { best = notes[i]; bestDist = d; }
    }

    if (bestDist < 30) { // Perfect — 绿色
      best.hit = true; state.score += 10; state.combo++;
      if (state.combo > state.maxCombo) state.maxCombo = state.combo;
      if (best.el) { best.el.style.background = '#10b981'; best.el.style.transform = 'translateX(-50%) scale(1.6)'; best.el.style.boxShadow = '0 0 24px rgba(16,185,129,0.7)'; }
      if (keyEl) { keyEl.style.background = '#d1fae5'; keyEl.style.borderColor = '#10b981'; keyEl.style.color = '#059669'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 120); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 14px rgba(16,185,129,0.5)'; laneEl.style.borderColor = '#10b981'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      showFB('Perfect!', '#10b981');
    } else if (bestDist < 60) { // Good — 绿色
      best.hit = true; state.score += 5; state.combo++;
      if (state.combo > state.maxCombo) state.maxCombo = state.combo;
      if (best.el) { best.el.style.background = '#34d399'; best.el.style.transform = 'translateX(-50%) scale(1.3)'; best.el.style.boxShadow = '0 0 16px rgba(16,185,129,0.5)'; }
      if (keyEl) { keyEl.style.background = '#d1fae5'; keyEl.style.borderColor = '#34d399'; keyEl.style.color = '#059669'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 120); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 10px rgba(16,185,129,0.35)'; laneEl.style.borderColor = '#34d399'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      showFB('Good', '#34d399');
    } else { // Miss — 红色
      state.combo = 0;
      if (keyEl) { keyEl.style.background = '#fee2e2'; keyEl.style.borderColor = '#ef4444'; keyEl.style.color = '#dc2626'; setTimeout(function() { keyEl.style.background = '#fff'; keyEl.style.borderColor = '#e2e8f0'; keyEl.style.color = '#64748b'; }, 150); }
      if (laneEl) { laneEl.style.boxShadow = '0 0 12px rgba(239,68,68,0.4)'; laneEl.style.borderColor = '#ef4444'; setTimeout(function() { laneEl.style.boxShadow = ''; laneEl.style.borderColor = '#e2e8f0'; }, 200); }
      showFB('Miss', '#ef4444');
    }
    updateUI();
  }

  function showFB(text, color) {
    var el = container.querySelector('#rt-feedback2');
    if (!el) return;
    el.textContent = text; el.style.color = color;
    clearTimeout(el._t); el._t = setTimeout(function() { el.textContent = ''; }, 400);
  }

  function spawnNote() {
    if (!state.playing) return;
    var lane = Math.floor(Math.random() * 4);
    var note = { id: state.noteId++, lane: lane, y: -40, hit: false, miss: false, el: null };
    var laneEl = container.querySelector('#rt-lane2-' + lane);
    var nd = document.createElement('div');
    nd.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:#10b981;transition:none;';
    nd.style.top = note.y + 'px';
    laneEl.appendChild(nd);
    note.el = nd;
    state.notes.push(note);
  }

  function updateNotes() {
    for (var i = state.notes.length - 1; i >= 0; i--) {
      var n = state.notes[i];
      if (n.hit || n.miss) {
        if (n.el && n.el.parentNode) n.el.parentNode.removeChild(n.el);
        state.notes.splice(i, 1);
        continue;
      }
      n.y += 1.8;
      if (n.el) n.el.style.top = n.y + 'px';
      if (n.y > 290) {
        n.miss = true; state.combo = 0;
        if (n.el) { n.el.style.background = '#ef4444'; n.el.style.boxShadow = '0 0 12px rgba(239,68,68,0.5)'; }
        updateUI(); showFB('Miss', '#ef4444');
      }
    }
  }

  function updateUI() {
    var s = container.querySelector('#rt-score2');
    if (s) s.textContent = state.score;
    var c = container.querySelector('#rt-combo2');
    if (c) c.textContent = state.combo > 0 ? '🔥 ' + state.combo + ' 连击' : '';
    var t = container.querySelector('#rt-time2');
    if (t) t.textContent = state.timeLeft;
  }

  function countdown() {
    if (!state.playing) return;
    state.timeLeft--;
    updateUI();
    if (state.timeLeft <= 0) endGame();
  }

  function startGame() {
    state.playing = true;
    spawnTimer = setInterval(spawnNote, 700);
    var timeTimer = setInterval(countdown, 1000);
    function loop() {
      if (!state.playing) { clearInterval(timeTimer); return; }
      updateNotes();
      gameLoop = requestAnimationFrame(loop);
    }
    gameLoop = requestAnimationFrame(loop);
  }

  function endGame() {
    state.playing = false;
    if (spawnTimer) clearInterval(spawnTimer);
    if (gameLoop) cancelAnimationFrame(gameLoop);
    var res = container.querySelector('#rt-result2');
    if (res) {
      res.style.display = 'block';
      res.innerHTML = '🎉 游戏结束！得分: <b>' + state.score + '</b> &nbsp;|&nbsp; 最高连击: <b>' + state.maxCombo + '</b>';
    }
  }

  reset();
}