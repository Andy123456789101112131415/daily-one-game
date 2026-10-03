function init_gc14ed3c8_2(container) {
var N=4;var board=[];var score=0;var best=0;var cellSize=0;var gap=8;var pad=8;var tiles=[];var over=false;var won=false;

container.innerHTML='<div class="g2048-wrap"><div class="g2048-head"><div class="g2048-box"><div class="lbl">Score</div><div class="val" id="g2048-score">0</div></div><div class="g2048-box"><div class="lbl">Best</div><div class="val" id="g2048-best">0</div></div><button class="g2048-btn" id="g2048-reset">重来</button></div><div class="g2048-grid" id="g2048-grid"><div class="g2048-cells" id="g2048-cells"></div><div id="g2048-tiles"></div><div class="g2048-over" id="g2048-over"><h3 id="g2048-over-t">游戏结束</h3><p id="g2048-over-p">最终得分 0</p><button class="g2048-btn" id="g2048-again">再来一局</button></div></div><div class="g2048-hint">方向键 / WASD 滑动数字，相同数字合并</div></div>';

var grid=container.querySelector('#g2048-grid');
var cellsEl=container.querySelector('#g2048-cells');
var tilesEl=container.querySelector('#g2048-tiles');
var scoreEl=container.querySelector('#g2048-score');
var bestEl=container.querySelector('#g2048-best');
var overEl=container.querySelector('#g2048-over');
var overT=container.querySelector('#g2048-over-t');
var overP=container.querySelector('#g2048-over-p');

var colors={2:'#f1f5f9',4:'#e2e8f0',8:'#06b6d4',16:'#0ea5e9',32:'#10b981',64:'#f59e0b',128:'#f97316',256:'#ef4444',512:'#db2777',1024:'#7c3aed',2048:'#5b21b6'};
var textColors={2:'#1e293b',4:'#1e293b',8:'#ffffff',16:'#ffffff',32:'#ffffff',64:'#ffffff',128:'#ffffff',256:'#ffffff',512:'#ffffff',1024:'#ffffff',2048:'#ffffff'};

function emptyBoard(){var b=[];for(var r=0;r<N;r++){b.push([0,0,0,0]);}return b;}
function clone(b){var n=[];for(var r=0;r<N;r++){n.push(b[r].slice());}return n;}
function empties(b){var list=[];for(var r=0;r<N;r++){for(var c=0;c<N;c++){if(b[r][c]===0)list.push([r,c]);}}return list;}
function addRandom(b){var e=empties(b);if(e.length===0)return null;var p=e[Math.floor(Math.random()*e.length)];var v=Math.random()<0.9?2:4;b[p[0]][p[1]]=v;return {r:p[0],c:p[1],v:v,isNew:true};}

function calcSize(){var wrap=container.querySelector('.g2048-wrap');var w=grid.clientWidth;cellSize=(w-pad*2-gap*(N-1))/N;}

function buildCells(){cellsEl.innerHTML='';for(var i=0;i<N*N;i++){var d=document.createElement('div');d.className='g2048-cell';cellsEl.appendChild(d);}}

function makeTile(r,c,v,isNew,merge){var t=document.createElement('div');t.className='g2048-tile'+(isNew?' pop':'')+(merge?' merge':'');t.textContent=v;var fs=cellSize*(v>=1024?0.36:v>=128?0.44:0.52);t.style.width=cellSize+'px';t.style.height=cellSize+'px';t.style.fontSize=Math.max(13,fs)+'px';t.style.left=(pad+c*(cellSize+gap))+'px';t.style.top=(pad+r*(cellSize+gap))+'px';t.style.background=colors[v]||'#5b21b6';t.style.color=textColors[v]||'#ffffff';tilesEl.appendChild(t);return t;}

function render(newTile,merged){tilesEl.innerHTML='';for(var r=0;r<N;r++){for(var c=0;c<N;c++){var v=board[r][c];if(v){var isNew=newTile&&newTile.r===r&&newTile.c===c;var isM=merged&&merged.some(function(m){return m.r===r&&m.c===c;});makeTile(r,c,v,isNew,isM);}}}}

function updateScore(){scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}}

function slideLine(line){var arr=line.filter(function(x){return x!==0;});var res=[];var merged=[];for(var i=0;i<arr.length;i++){if(i<arr.length-1&&arr[i]===arr[i+1]){res.push(arr[i]*2);merged.push(arr[i]*2);score+=arr[i]*2;i++;}else{res.push(arr[i]);}}
while(res.length<N)res.push(0);return {line:res,merged:merged};}

function move(dir){if(over)return;var moved=false;var mergedCells=[];var old=clone(board);var b=board;
for(var i=0;i<N;i++){var line=[];for(var j=0;j<N;j++){if(dir==='left')line.push(b[i][j]);else if(dir==='right')line.push(b[i][N-1-j]);else if(dir==='up')line.push(b[j][i]);else line.push(b[N-1-j][i]);}
var r=slideLine(line);for(var j=0;j<N;j++){if(dir==='left')b[i][j]=r.line[j];else if(dir==='right')b[i][N-1-j]=r.line[j];else if(dir==='up')b[j][i]=r.line[j];else b[N-1-j][i]=r.line[j];}}
for(var rr=0;rr<N;rr++){for(var cc=0;cc<N;cc++){if(b[rr][cc]!==old[rr][cc]){moved=true;if(b[rr][cc]!==0&&b[rr][cc]!==old[rr][cc])mergedCells.push({r:rr,c:cc});}}}
if(moved){var nt=addRandom(b);render(nt,mergedCells);updateScore();checkState();}}

function canMove(){if(empties(board).length>0)return true;for(var r=0;r<N;r++){for(var c=0;c<N;c++){var v=board[r][c];if(c<N-1&&board[r][c+1]===v)return true;if(r<N-1&&board[r+1][c]===v)return true;}}return false;}

function checkState(){if(!won){for(var r=0;r<N;r++){for(var c=0;c<N;c++){if(board[r][c]>=2048){won=true;over=true;overT.textContent='你赢了！';overP.textContent='达成 2048，得分 '+score;overEl.classList.add('show');return;}}}}
if(!canMove()){over=true;overT.textContent='游戏结束';overP.textContent='最终得分 '+score;overEl.classList.add('show');}}

function reset(){board=emptyBoard();score=0;won=false;over=false;overEl.classList.remove('show');tilesEl.innerHTML='';calcSize();addRandom(board);addRandom(board);render(null,null);updateScore();}

function keyHandler(e){var k=e.key;var dir=null;if(k==='ArrowLeft'||k==='a'||k==='A')dir='left';else if(k==='ArrowRight'||k==='d'||k==='D')dir='right';else if(k==='ArrowUp'||k==='w'||k==='W')dir='up';else if(k==='ArrowDown'||k==='s'||k==='S')dir='down';if(dir){e.preventDefault();move(dir);}}

var touchStart=null;
grid.addEventListener('touchstart',function(e){if(e.touches.length===1){touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};}},{passive:true});
grid.addEventListener('touchend',function(e){if(!touchStart)return;var t=e.changedTouches[0];var dx=t.clientX-touchStart.x;var dy=t.clientY-touchStart.y;var ax=Math.abs(dx),ay=Math.abs(dy);if(Math.max(ax,ay)<24)return;if(ax>ay){move(dx>0?'right':'left');}else{move(dy>0?'down':'up');}touchStart=null;},{passive:true});

container.querySelector('#g2048-reset').addEventListener('click',reset);
container.querySelector('#g2048-again').addEventListener('click',reset);
container.addEventListener('keydown',keyHandler);
container.tabIndex=0;

buildCells();reset();
container.addEventListener('keydown',keyHandler);
window.addEventListener('resize',function(){calcSize();render(null,null);});
}