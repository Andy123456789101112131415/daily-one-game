function init_gc14ed3c8_2(container) {
var N=4;var board=[];var score=0;var best=0;var cellSize=0;var gap=8;var pad=8;var over=false;var won=false;var container=document.getElementById('game-container')||document.body;

container.innerHTML='<div class="g2048-wrap"><div class="g2048-head"><div class="g2048-scores"><div class="g2048-box"><div class="lbl">Score</div><div class="val" id="g2048-score">0</div></div><div class="g2048-box"><div class="lbl">Best</div><div class="val" id="g2048-best">0</div></div></div><button class="g2048-btn" id="g2048-reset">重来</button></div><div class="g2048-grid" id="g2048-grid"><div class="g2048-cells" id="g2048-cells"></div><div id="g2048-tiles"></div><div class="g2048-over" id="g2048-over"><h3 id="g2048-over-t">游戏结束</h3><p id="g2048-over-p">最终得分 0</p><button class="g2048-btn" id="g2048-again">再来一局</button></div></div><div class="g2048-hint">方向键 / WASD 滑动数字，相同数字合并</div></div>';

var grid=container.querySelector('#g2048-grid');
var cellsEl=container.querySelector('#g2048-cells');
var tilesEl=container.querySelector('#g2048-tiles');
var scoreEl=container.querySelector('#g2048-score');
var bestEl=container.querySelector('#g2048-best');
var overEl=container.querySelector('#g2048-over');
var overT=container.querySelector('#g2048-over-t');
var overP=container.querySelector('#g2048-over-p');
var resetBtn=container.querySelector('#g2048-reset');
var againBtn=container.querySelector('#g2048-again');

var colors={2:'#f1f5f9',4:'#e2e8f0',8:'#06b6d4',16:'#0ea5e9',32:'#10b981',64:'#f59e0b',128:'#f97316',256:'#ef4444',512:'#db2777',1024:'#7c3aed',2048:'#5b21b6'};
var textColors={2:'#1e293b',4:'#1e293b',8:'#ffffff',16:'#ffffff',32:'#ffffff',64:'#ffffff',128:'#ffffff',256:'#ffffff',512:'#ffffff',1024:'#ffffff',2048:'#ffffff'};

function emptyBoard(){var b=[];for(var r=0;r<N;r++){b.push([0,0,0,0]);}return b;}
function clone(b){var n=[];for(var r=0;r<N;r++){n.push(b[r].slice());}return n;}
function empties(b){var list=[];for(var r=0;r<N;r++){for(var c=0;c<N;c++){if(b[r][c]===0)list.push([r,c]);}}return list;}
function addRandom(b){var e=empties(b);if(e.length===0)return null;var p=e[Math.floor(Math.random()*e.length)];var v=Math.random()<0.9?2:4;b[p[0]][p[1]]=v;return {r:p[0],c:p[1],v:v,isNew:true};}

function calcSize(){var w=grid.clientWidth;if(!w){w=400;}cellSize=(w-pad*2-gap*(N-1))/N;if(cellSize<0){cellSize=0;}}

function buildCells(){cellsEl.innerHTML='';for(var i=0;i<N*N;i++){var d=document.createElement('div');d.className='g2048-cell';cellsEl.appendChild(d);}}

function makeTile(r,c,v,isNew,merge){var t=document.createElement('div');t.className='g2048-tile'+(isNew?' pop':'')+(merge?' merge':'');t.textContent=v;var fs=cellSize*(v>=1024?0.36:v>=128?0.44:0.52);t.style.width=cellSize+'px';t.style.height=cellSize+'px';t.style.fontSize=Math.max(13,fs)+'px';t.style.left=(pad+c*(cellSize+gap))+'px';t.style.top=(pad+r*(cellSize+gap))+'px';t.style.background=colors[v]||'#5b21b6';t.style.color=textColors[v]||'#ffffff';tilesEl.appendChild(t);return t;}

function render(newTile,merged){tilesEl.innerHTML='';for(var r=0;r<N;r++){for(var c=0;c<N;c++){var v=board[r][c];if(v){var isNew=newTile&&newTile.r===r&&newTile.c===c;var isM=merged&&merged.some(function(m){return m.r===r&&m.c===c;});makeTile(r,c,v,isNew,isM);}}}}

function updateScore(){scoreEl.textContent=score;if(score>best){best=score;}bestEl.textContent=best;}

function canMove(){if(empties(board).length>0)return true;for(var r=0;r<N;r++){for(var c=0;c<N;c++){var v=board[r][c];if(c<N-1&&board[r][c+1]===v)return true;if(r<N-1&&board[r+1][c]===v)return true;}}return false;}

function checkOver(){if(!canMove()){over=true;overT.textContent='游戏结束';overP.textContent='最终得分 '+score;overEl.classList.add('show');}}

function slide(row){var arr=row.filter(function(v){return v;});var merged=[];for(var i=0;i<arr.length-1;i++){if(arr[i]===arr[i+1]){arr[i]*=2;score+=arr[i];if(arr[i]===2048&&!won){won=true;}arr.splice(i+1,1);merged.push(i);}}while(arr.length<N){arr.push(0);}return {row:arr,merged:merged};}

function move(dir){if(over)return;var moved=false;var mergedList=[];var newBoard=clone(board);if(dir==='left'||dir==='right'){for(var r=0;r<N;r++){var row=newBoard[r].slice();if(dir==='right')row.reverse();var res=slide(row);if(dir==='right')res.row.reverse();for(var c=0;c<N;c++){if(newBoard[r][c]!==res.row[c])moved=true;newBoard[r][c]=res.row[c];}for(var k=0;k<res.merged.length;k++){var mc=dir==='right'?N-1-res.merged[k]:res.merged[k];mergedList.push({r:r,c:mc});}}}else{for(var c2=0;c2<N;c2++){var col=[];for(var r2=0;r2<N;r2++)col.push(newBoard[r2][c2]);if(dir==='down')col.reverse();var res2=slide(col);if(dir==='down')res2.row.reverse();for(var r3=0;r3<N;r3++){if(newBoard[r3][c2]!==res2.row[r3])moved=true;newBoard[r3][c2]=res2.row[r3];}for(var k2=0;k2<res2.merged.length;k2++){var mr=dir==='down'?N-1-res2.merged[k2]:res2.merged[k2];mergedList.push({r:mr,c:c2});}}}if(!moved)return;board=newBoard;var nt=addRandom(board);updateScore();render(nt,mergedList);checkOver();}

function reset(){board=emptyBoard();score=0;over=false;won=false;overEl.classList.remove('show');addRandom(board);addRandom(board);updateScore();calcSize();render(null,null);}

function handleKey(e){var k=e.key;var dir=null;if(k==='ArrowLeft'||k==='a'||k==='A')dir='left';else if(k==='ArrowRight'||k==='d'||k==='D')dir='right';else if(k==='ArrowUp'||k==='w'||k==='W')dir='up';else if(k==='ArrowDown'||k==='s'||k==='S')dir='down';if(dir){e.preventDefault();move(dir);}}

var touchStartX=0,touchStartY=0,touching=false;
function onTouchStart(e){if(e.touches.length!==1)return;touching=true;touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;}
function onTouchEnd(e){if(!touching)return;touching=false;var t=e.changedTouches[0];var dx=t.clientX-touchStartX;var dy=t.clientY-touchStartY;var ax=Math.abs(dx),ay=Math.abs(dy);if(Math.max(ax,ay)<24)return;if(ax>ay){move(dx>0?'right':'left');}else{move(dy>0?'down':'up');}}

window.addEventListener('keydown',handleKey);
grid.addEventListener('touchstart',onTouchStart,{passive:true});
grid.addEventListener('touchend',onTouchEnd,{passive:true});
resetBtn.addEventListener('click',reset);
againBtn.addEventListener('click',reset);
window.addEventListener('resize',function(){calcSize();render(null,null);});

buildCells();reset();
}