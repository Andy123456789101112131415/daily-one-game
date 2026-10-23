function init_gbc5e8933(container) {
const N=4;
const COLORS=['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444'];
container.innerHTML='';
const wrap=document.createElement('div');
wrap.className='pz-wrap';
const head=document.createElement('div');
head.className='pz-head';
const statMoves=document.createElement('div');
statMoves.className='pz-stat';
statMoves.innerHTML='<b>0</b><span>步数</span>';
const statTime=document.createElement('div');
statTime.className='pz-stat';
statTime.innerHTML='<b>00:00</b><span>时间</span>';
const statBest=document.createElement('div');
statBest.className='pz-stat';
statBest.innerHTML='<b>--</b><span>最佳</span>';
const btnRestart=document.createElement('button');
btnRestart.className='pz-btn pz-primary';
btnRestart.textContent='重来';
head.appendChild(statMoves);
head.appendChild(statTime);
head.appendChild(statBest);
head.appendChild(btnRestart);
wrap.appendChild(head);
const board=document.createElement('div');
board.className='pz-board';
const grid=document.createElement('div');
grid.className='pz-grid';
board.appendChild(grid);
const overlay=document.createElement('div');
overlay.className='pz-overlay';
overlay.innerHTML='<h2>完成！</h2><p class="pz-msg"></p>';
const ovBtn=document.createElement('button');
ovBtn.className='pz-btn pz-primary';
ovBtn.textContent='再来一局';
overlay.appendChild(ovBtn);
board.appendChild(overlay);
wrap.appendChild(board);
const foot=document.createElement('div');
foot.className='pz-foot';
foot.textContent='点击空格旁的方块滑动，或用方向键移动。把 1–15 按顺序排好即获胜。';
wrap.appendChild(foot);
container.appendChild(wrap);
const movesEl=statMoves.querySelector('b');
const timeEl=statTime.querySelector('b');
const bestEl=statBest.querySelector('b');
const msgEl=overlay.querySelector('.pz-msg');
let tiles=[];
let empty=15;
let moves=0;
let timer=null;
let seconds=0;
let playing=false;
let best=null;
try{ const s=localStorage.getItem('pz_best_moves'); if(s){ const v=parseInt(s,10); if(!isNaN(v)&&v>0) best=v; } }catch(e){ best=null; }
if(best){ bestEl.textContent=best; }
function tileColor(v){ return COLORS[(v-1)%COLORS.length]; }
function computeSize(){
  const w=Math.min(container.clientWidth||420,420)-32;
  return Math.max(200,Math.min(w,380));
}
function layout(){
  const size=computeSize();
  const gap=6;
  const cell=(size-gap*(N-1))/N;
  grid.style.gridTemplateColumns='repeat('+N+','+cell+'px)';
  grid.style.gridTemplateRows='repeat('+N+','+cell+'px)';
  grid.style.gap=gap+'px';
  grid.style.width=size+'px';
  grid.style.height=size+'px';
  grid.querySelectorAll('.pz-tile').forEach(function(t){
    t.style.fontSize=Math.round(cell*0.34)+'px';
  });
}
function solved(){
  for(let i=0;i<15;i++){ if(tiles[i]!==i+1) return false; }
  return tiles[15]===0;
}
function fmt(s){
  const m=Math.floor(s/60);
  const ss=s%60;
  return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss;
}
function startTimer(){
  if(timer) return;
  timer=setInterval(function(){
    seconds++;
    timeEl.textContent=fmt(seconds);
  },1000);
}
function stopTimer(){
  if(timer){ clearInterval(timer); timer=null; }
}
function shuffle(){
  do{
    tiles=[];
    for(let i=0;i<16;i++) tiles.push(i);
    for(let i=15;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      const tmp=tiles[i]; tiles[i]=tiles[j]; tiles[j]=tmp;
    }
    empty=tiles.indexOf(0);
  }while(!isSolvable()||solved());
}
function isSolvable(){
  let inv=0;
  for(let i=0;i<16;i++){
    if(tiles[i]===0) continue;
    for(let j=i+1;j<16;j++){
      if(tiles[j]!==0 && tiles[i]>tiles[j]) inv++;
    }
  }
  const emptyRow=Math.floor(empty/N);
  return (inv+emptyRow)%2===1;
}
function render(){
  grid.innerHTML='';
  for(let i=0;i<16;i++){
    const v=tiles[i];
    const t=document.createElement('button');
    t.className='pz-tile'+(v===0?' pz-empty':'');
    t.type='button';
    if(v===0){ t.textContent=''; t.disabled=true; }
    else { t.textContent=v; t.style.background=tileColor(v); }
    t.dataset.index=i;
    t.addEventListener('click',function(){ onTileClick(i); });
    grid.appendChild(t);
  }
  layout();
}
function onTileClick(i){
  if(!playing) return;
  tryMove(i);
}
function tryMove(i){
  if(i<0||i>15) return;
  const r=Math.floor(i/N), c=i%N;
  const er=Math.floor(empty/N), ec=empty%N;
  if(Math.abs(r-er)+Math.abs(c-ec)!==1) return;
  tiles[empty]=tiles[i];
  tiles[i]=0;
  empty=i;
  moves++;
  movesEl.textContent=moves;
  render();
  if(solved()) win();
}
function win(){
  playing=false;
  stopTimer();
  if(best===null||moves<best){
    best=moves;
    bestEl.textContent=best;
    try{ localStorage.setItem('pz_best_moves',String(best)); }catch(e){}
  }
  msgEl.textContent='步数 '+moves+' · 用时 '+fmt(seconds);
  overlay.classList.add('pz-show');
}
function reset(){
  stopTimer();
  overlay.classList.remove('pz-show');
  moves=0; seconds=0;
  movesEl.textContent='0';
  timeEl.textContent='00:00';
  shuffle();
  render();
  playing=true;
  startTimer();
}
function onKey(e){
  if(!playing) return;
  const er=Math.floor(empty/N), ec=empty%N;
  let target=-1;
  if(e.key==='ArrowUp'){ if(er<3) target=empty+N; }
  else if(e.key==='ArrowDown'){ if(er>0) target=empty-N; }
  else if(e.key==='ArrowLeft'){ if(ec<3) target=empty+1; }
  else if(e.key==='ArrowRight'){ if(ec>0) target=empty-1; }
  else return;
  e.preventDefault();
  if(target>=0) tryMove(target);
}
document.addEventListener('keydown',onKey);
btnRestart.addEventListener('click',reset);
ovBtn.addEventListener('click',reset);
window.addEventListener('resize',layout);
reset();
}