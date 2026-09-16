function init_gdde7cd56(container) {
var size = 4;
var total = size * size;
var tiles = [];
var moves = 0;
var best = null;
var solved = false;
var boardEl, movesEl, bestEl, msgEl, overlayEl;

function idx(r, c) { return r * size + c; }

function render() {
  boardEl.innerHTML = '';
  for (var i = 0; i < total; i++) {
    var cell = document.createElement('div');
    cell.className = 'nm-cell';
    var v = tiles[i];
    if (v === 0) {
      cell.classList.add('nm-empty');
    } else {
      cell.classList.add('nm-tile');
      cell.textContent = v;
      if (v === i + 1) cell.classList.add('nm-correct');
      (function (pos) {
        cell.addEventListener('click', function () { tryMove(pos); });
      })(i);
    }
    boardEl.appendChild(cell);
  }
  movesEl.textContent = moves;
  bestEl.textContent = best === null ? '-' : best;
}

function tryMove(pos) {
  if (solved) return;
  var empty = tiles.indexOf(0);
  if (empty < 0) return;
  var r1 = Math.floor(pos / size), c1 = pos % size;
  var r2 = Math.floor(empty / size), c2 = empty % size;
  var dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
  if (dist !== 1) return;
  tiles[empty] = tiles[pos];
  tiles[pos] = 0;
  moves++;
  render();
  checkWin();
}

function checkWin() {
  for (var i = 0; i < total - 1; i++) {
    if (tiles[i] !== i + 1) return;
  }
  if (tiles[total - 1] !== 0) return;
  solved = true;
  if (best === null || moves < best) best = moves;
  msgEl.textContent = '完成！用时 ' + moves + ' 步';
  msgEl.classList.add('nm-win');
  render();
  showOverlay();
}

function showOverlay() {
  overlayEl.innerHTML = '';
  var h = document.createElement('h3');
  h.textContent = '🎉 恭喜完成';
  var p = document.createElement('p');
  p.textContent = '步数：' + moves + (best !== null ? '　最佳：' + best : '');
  var b = document.createElement('button');
  b.className = 'nm-btn';
  b.textContent = '再来一局';
  b.addEventListener('click', shuffle);
  overlayEl.appendChild(h);
  overlayEl.appendChild(p);
  overlayEl.appendChild(b);
  overlayEl.style.display = 'flex';
}

function hideOverlay() {
  overlayEl.style.display = 'none';
  overlayEl.innerHTML = '';
}

function solvable(arr) {
  var inv = 0;
  var a = arr.filter(function (x) { return x !== 0; });
  for (var i = 0; i < a.length; i++) {
    for (var j = i + 1; j < a.length; j++) {
      if (a[i] > a[j]) inv++;
    }
  }
  var emptyRow = Math.floor(arr.indexOf(0) / size);
  var rowFromBottom = size - emptyRow;
  if (size % 2 === 1) return inv % 2 === 0;
  return (rowFromBottom % 2 === 0) ? (inv % 2 === 1) : (inv % 2 === 0);
}

function isSolvedAlready() {
  for (var i = 0; i < total - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[total - 1] === 0;
}

function shuffle() {
  hideOverlay();
  solved = false;
  moves = 0;
  msgEl.textContent = '点击空格旁的方块移动';
  msgEl.classList.remove('nm-win');
  var attempts = 0;
  do {
    tiles = [];
    for (var i = 0; i < total; i++) tiles.push(i);
    for (var k = tiles.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var t = tiles[k]; tiles[k] = tiles[j]; tiles[j] = t;
    }
    attempts++;
  } while ((!solvable(tiles) || isSolvedAlready()) && attempts < 1000);
  render();
}

function init() {
  boardEl = document.getElementById('nm-board');
  movesEl = document.getElementById('nm-moves');
  bestEl = document.getElementById('nm-best');
  msgEl = document.getElementById('nm-msg');
  overlayEl = document.getElementById('nm-overlay');
  var resetBtn = document.getElementById('nm-reset');
  if (resetBtn) resetBtn.addEventListener('click', shuffle);
  shuffle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
}