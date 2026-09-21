function init_ge6ac44a1(container) {
const size=4;let board=[],score=0,best=0,tid=0,gameOver=false,won=false;
const colors={2:['#ede9fe','#7c3aed'],4:['#cffafe','#0891b2'],8:['#d1fae5','#059669'],16:['#fef3c7','#d97706'],32:['#fde68a','#b45309'],64:['#fecaca','#dc2626'],128:['#fbcfe8','#be185d'],256:['#ddd6fe','#6d28d9'],512:['#a5f3fc','#0e7490'],1024:['#bbf7d0','#15803d'],2048:['#fde047','#a16207']};
function cStyle(v){return colors[v]||['#1e293b','#f8f9fc']}
container.innerHTML='<div class="m2048-wrap"><div class="m2048-top"><div class="m2048-scores"><div class="m2048-score"><span>分数</span><b class="m2048-cur">0</b></div><div class="m2048-score"><span>最高</span><b class="m2048-best">0</b></div></div><button class="m2048-btn m2048-restart" type="button">重来</button></div><div class="m2048-board"><div class="m2048-grid"></div><div class="m2048-tiles"></div><div class="m2048-over hide"></div></div><div class="m2048-hint">方向键 / WASD 滑动方块，相同数字合并，目标 2048</div></div>';
const grid=container.querySelector('.m2048-grid'),tilesEl=container.querySelector('.m2048-tiles'),overEl=container.querySelector('.m2048-over'),curEl=container.querySelector('.m2048-cur'),bestEl=container.querySelector('.m2048-best'),boardEl=container.querySelector('.m2048-board'),restartBtn=container.querySelector('.m2048-restart');
for(let i=0;i<size*size;i++){const c=document.createElement('div');c.className='m2048-cell';grid.appendChild(c)}
try{best=parseInt(localStorage.getItem('m2048best')||'0',10)||0}catch(e){best=0}
function emptyCells(){const r=[];for(let i=0;i<size;i++)for(let j=0;j<size;j++)if(!board[i][j])r.push([i,j]);return r}
function addRandom(){const e=emptyCells();if(!e.length)return;const p=e[Math.floor(Math.random()*e.length)];const v=Math.random()<0.9?2:4;board[p[0]][p[1]]={id:++tid,v:v,new:true}}
function layout(){const W=tilesEl.clientWidth||(boardEl.clientWidth-20);if(W<=0)return;const gap=10;const s=(W-gap*(size-1))/size;tilesEl.innerHTML='';for(let i=0;i<size;i++)for(let j=0;j<size;j++){const t=board[i][j];if(!t)continue;const d=document.createElement('div');d.className='m2048-tile'+(t.new?' new':'');d.style.width=s+'px';d.style.height=s+'px';d.style.left=(j*(s+gap))+'px';d.style.top=(i*(s+gap))+'px';d.style.fontSize=Math.max(13,Math.round(s*(t.v>=1024?0.32:t.v>=128?0.38:0.44)))+'px';const cs=cStyle(t.v);d.style.background=cs[0];d.style.color=cs[1];d.textContent=t.v;tilesEl.appendChild(d);t.new=false}}
function updateScore(){curEl.textContent=score;bestEl.textContent=best}
function canMove(){if(emptyCells().length)return true;for(let i=0;i<size;i++)for(let j=0;j<size;j++){const v=board[i][j]&&board[i][j].v;if(!v)continue;if(j+1<size&&board[i][j+1]&&board[i][j+1].v===v)return true;if(i+1<size&&board[i+1][j]&&board[i+1][j].v===v)return true}return false}
function checkState(){if(!won){for(let i=0;i<size;i++)for(let j=0;j<size;j++){if(board[i][j]&&board[i][j].v>=2048){won=true;showOver('达成 2048!',true);return}}}if(!canMove()){gameOver=true;showOver('游戏结束',false)}}
function showOver(text,isWin){overEl.innerHTML='<b>'+text+'</b><button class="m2048-btn m2048-again" type="button">再来一局</button>';overEl.classList.remove('hide');const b=overEl.querySelector('.m2048-again');if(b)b.addEventListener('click',reset)}
function move(dir){if(gameOver)return;let moved=false;let lines=[];if(dir==='left'||dir==='right'){for(let i=0;i<size;i++)lines.push(board[i].slice())}else{for(let j=0;j<size;j++){const col=[];for(let i=0;i<size;i++)col.push(board[i][j]);lines.push(col)}}
const newLines=lines.map(line=>{let arr=line.filter(x=>x);if(dir==='right'||dir==='down')arr.reverse();const out=[];for(let k=0;k<arr.length;k++){if(k+1<arr.length&&arr[k].v===arr[k+1].v){const nv=arr[k].v*2;out.push({id:++tid,v:nv,merged:true});score+=nv;if(nv>best){best=nv;try{localStorage.setItem('m2048best',String(best))}catch(e){}}k++}else{out.push(arr[k])}}while(out.length<size)out.push(null);if(dir==='right'||dir==='down')out.reverse();return out});
for(let i=0;i<size;i++)for(let j=0;j<size;j++){const old=board[i][j];const nw=dir==='left'||dir==='right'?newLines[i][j]:newLines[j][i];if((old&&old.id)!==(nw&&nw.id))moved=true}
if(!moved)return;
if(dir==='left'||dir==='right'){for(let i=0;i<size;i++)board[i]=newLines[i]}else{for(let j=0;j<size;j++)for(let i=0;i<size;i++)board[i][j]=newLines[j][i]}
addRandom();updateScore();layout();checkState()}
function reset(){board=[];score=0;gameOver=false;won=false;tid=0;overEl.classList.add('hide');overEl.innerHTML='';for(let i=0;i<size;i++){board.push([]);for(let j=0;j<size;j++)board[i].push(null)}addRandom();addRandom();updateScore();layout()}
function onKey(e){const k=e.key;let dir=null;if(k==='ArrowLeft'||k==='a'||k==='A')dir='left';else if(k==='ArrowRight'||k==='d'||k==='D')dir='right';else if(k==='ArrowUp'||k==='w'||k==='W')dir='up';else if(k==='ArrowDown'||k==='s'||k==='S')dir='down';if(dir){e.preventDefault();move(dir)}}
document.addEventListener('keydown',onKey);
let sx=0,sy=0,touching=false;
boardEl.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;touching=true;sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
boardEl.addEventListener('touchmove',e=>{if(touching)e.preventDefault()},{passive:false});
boardEl.addEventListener('touchend',e=>{if(!touching)return;touching=false;const t=e.changedTouches[0];const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<24&&Math.abs(dy)<24)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up')});
if(restartBtn)restartBtn.addEventListener('click',reset);
window.addEventListener('resize',()=>layout());
reset();
}