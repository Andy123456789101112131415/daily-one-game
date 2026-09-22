function init_g7836f25a(container) {
var size=4,board,score,best=0,over=false,won=false,containerEl=container;
containerEl.innerHTML='<div id="g2048-wrap"><div class="g2048-head"><div class="g2048-scorebox"><div class="g2048-score"><b id="g2048-s">0</b><span>分数</span></div><div class="g2048-score"><b id="g2048-b">0</b><span>最高</span></div></div><button class="g2048-btn alt" id="g2048-r">🔄 重来</button></div><div class="g2048-grid" id="g2048-grid"><div class="g2048-overlay" id="g2048-ov"><h2 id="g2048-ovt"></h2><p id="g2048-ovp"></p><button class="g2048-btn" id="g2048-ob">再来一局</button></div></div><div class="g2048-hint">方向键 / WASD 移动 · 手机可滑动</div></div>';
var gridEl=containerEl.querySelector('#g2048-grid');
var sEl=containerEl.querySelector('#g2048-s'),bEl=containerEl.querySelector('#g2048-b');
var ovEl=containerEl.querySelector('#g2048-ov'),ovtEl=containerEl.querySelector('#g2048-ovt'),ovpEl=containerEl.querySelector('#g2048-ovp');
var colors={2:'#eef2f7',4:'#e2e8f0',8:'#a5b4fc',16:'#818cf8',32:'#7c3aed',64:'#6d28d9',128:'#06b6d4',256:'#0891b2',512:'#10b981',1024:'#f59e0b',2048:'#ef4444'};
function txtColor(v){return v<=4?'#1e293b':'#ffffff';}
function build(){for(var i=0;i<size;i++){var row=document.createElement('div');row.className='g2048-row';for(var j=0;j<size;j++){var c=document.createElement('div');c.className='g2048-cell';row.appendChild(c);}gridEl.appendChild(row);}}
function render(){var cells=gridEl.querySelectorAll('.g2048-cell');for(var i=0;i<size;i++)for(var j=0;j<size;j++){var v=board[i][j],el=cells[i*size+j];el.textContent=v||'';el.style.background=v?(colors[v]||'#ef4444'):'#fff';el.style.color=v?txtColor(v):'#1e293b';}sEl.textContent=score;bEl.textContent=best;}
function addTile(){var empty=[];for(var i=0;i<size;i++)for(var j=0;j<size;j++)if(!board[i][j])empty.push([i,j]);if(!empty.length)return;var p=empty[Math.floor(Math.random()*empty.length)];board[p[0]][p[1]]=Math.random()<0.9?2:4;}
function slide(row){var a=row.filter(function(x){return x;});var out=[];for(var i=0;i<a.length;i++){if(a[i]===a[i+1]){out.push(a[i]*2);score+=a[i]*2;if(a[i]*2>=2048)won=true;i++;}else out.push(a[i]);}while(out.length<size)out.push(0);return out;}
function move(dir){if(over)return;var moved=false,old=JSON.stringify(board);
 if(dir==='left'){for(var i=0;i<size;i++){board[i]=slide(board[i]);}}
 else if(dir==='right'){for(var i=0;i<size;i++){board[i]=slide(board[i].slice().reverse()).reverse();}}
 else if(dir==='up'){for(var j=0;j<size;j++){var col=[];for(var i=0;i<size;i++)col.push(board[i][j]);col=slide(col);for(var i=0;i<size;i++)board[i][j]=col[i];}}
 else if(dir==='down'){for(var j=0;j<size;j++){var col=[];for(var i=0;i<size;i++)col.push(board[i][j]);col=slide(col.reverse()).reverse();for(var i=0;i<size;i++)board[i][j]=col[i];}}
 moved=old!==JSON.stringify(board);
 if(moved){addTile();if(score>best)best=score;render();check();}}
function check(){var full=true;for(var i=0;i<size;i++)for(var j=0;j<size;j++){if(!board[i][j])full=false;else{if(i<size-1&&board[i][j]===board[i+1][j])full=false;if(j<size-1&&board[i][j]===board[i][j+1])full=false;}}
 if(won){over=true;ovtEl.textContent='🎉 达成 2048！';ovpEl.textContent='得分 '+score;ovEl.classList.add('show');}
 else if(full){over=true;ovtEl.textContent='游戏结束';ovpEl.textContent='最终得分 '+score;ovEl.classList.add('show');}}
function reset(){board=[];score=0;over=false;won=false;for(var i=0;i<size;i++){board.push([]);for(var j=0;j<size;j++)board[i].push(0);}ovEl.classList.remove('show');addTile();addTile();render();}
containerEl.querySelector('#g2048-r').onclick=reset;
containerEl.querySelector('#g2048-ob').onclick=reset;
containerEl.addEventListener('keydown',function(e){var k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'].indexOf(k)<0)return;e.preventDefault();var m={'arrowleft':'left','arrowright':'right','arrowup':'up','arrowdown':'down','a':'left','d':'right','w':'up','s':'down'};move(m[k]);});
containerEl.setAttribute('tabindex','0');
var sx=0,sy=0,sw=false;
gridEl.addEventListener('touchstart',function(e){if(e.touches.length){sx=e.touches[0].clientX;sy=e.touches[0].clientY;sw=true;}},{passive:true});
gridEl.addEventListener('touchend',function(e){if(!sw)return;sw=false;var t=e.changedTouches[0];var dx=t.clientX-sx,dy=t.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');},{passive:true});
build();reset();containerEl.focus();
}