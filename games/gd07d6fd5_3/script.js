function init_gd07d6fd5_3(container) {
var size=3,board=[],empty=0,moves=0,solved=false,wrap=null,boardEl=null,movesEl=null,timerEl=null,sec=0,timerId=null;
var COLORS=['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#14b8a6'];
function idx(r,c){return r*size+c}
function shuffle(){
  var total=size*size;
  board=[];
  for(var i=0;i<total;i++)board.push(i);
  empty=total-1;
  var prev=-1;
  for(var k=0;k<400;k++){
    var er=Math.floor(empty/size),ec=empty%size;
    var cand=[];
    if(er>0)cand.push(idx(er-1,ec));
    if(er<size-1)cand.push(idx(er+1,ec));
    if(ec>0)cand.push(idx(er,ec-1));
    if(ec<size-1)cand.push(idx(er,ec+1));
    var pick;
    do{pick=cand[Math.floor(Math.random()*cand.length)];}while(pick===prev&&cand.length>1);
    board[empty]=board[pick];board[pick]=total-1;prev=empty;empty=pick;
  }
  if(isSolved())shuffle();
}
function isSolved(){
  for(var i=0;i<board.length-1;i++){if(board[i]!==i+1)return false;}
  return board[board.length-1]===size*size;
}
function render(){
  boardEl.style.gridTemplateColumns='repeat('+size+',1fr)';
  boardEl.innerHTML='';
  var total=size*size;
  for(var i=0;i<total;i++){
    var v=board[i];
    var d=document.createElement('div');
    d.className='ns-tile';
    d.dataset.pos=i;
    if(v===total){d.classList.add('ns-empty');d.textContent='';}
    else{d.textContent=v;d.style.background=COLORS[(v-1)%COLORS.length];}
    boardEl.appendChild(d);
  }
  movesEl.textContent=moves;
}
function tryMove(pos){
  if(solved)return;
  var pr=Math.floor(pos/size),pc=pos%size;
  var er=Math.floor(empty/size),ec=empty%size;
  var dist=Math.abs(pr-er)+Math.abs(pc-ec);
  if(dist!==1)return;
  board[empty]=board[pos];
  board[pos]=size*size;
  empty=pos;
  moves++;
  render();
  var el=boardEl.children[pos];
  if(el){el.classList.add('ns-pop');setTimeout(function(){el.classList.remove('ns-pop');},260);}
  if(isSolved())win();
}
function moveDir(dr,dc){
  var er=Math.floor(empty/size),ec=empty%size;
  var nr=er+dr,nc=ec+dc;
  if(nr<0||nr>=size||nc<0||nc>=size)return;
  tryMove(idx(nr,nc));
}
function win(){
  solved=true;
  if(timerId)clearInterval(timerId);
  var d=document.createElement('div');
  d.className='ns-done';
  d.innerHTML='<h3>完成！</h3><p>步数 '+moves+' · 用时 '+sec+' 秒</p>';
  boardEl.parentNode.appendChild(d);
}
function startTimer(){
  if(timerId)clearInterval(timerId);
  sec=0;timerEl.textContent='0s';
  timerId=setInterval(function(){sec++;timerEl.textContent=sec+'s';},1000);
}
function reset(){
  solved=false;moves=0;empty=size*size-1;
  var old=boardEl.parentNode.querySelector('.ns-done');
  if(old)old.parentNode.removeChild(old);
  shuffle();render();startTimer();
}
function onKey(e){
  var k=e.key;
  if(k==='ArrowUp'||k==='w'||k==='W'){moveDir(1,0);e.preventDefault();}
  else if(k==='ArrowDown'||k==='s'||k==='S'){moveDir(-1,0);e.preventDefault();}
  else if(k==='ArrowLeft'||k==='a'||k==='A'){moveDir(0,1);e.preventDefault();}
  else if(k==='ArrowRight'||k==='d'||k==='D'){moveDir(0,-1);e.preventDefault();}
}
wrap=document.createElement('div');
wrap.id='ns-wrap';
wrap.innerHTML='<div class="ns-head"><div class="ns-info"><div class="ns-chip">步数<b class="ns-mv">0</b></div><div class="ns-chip">时间<b class="ns-tm">0s</b></div></div><button class="ns-btn ns-reset" type="button">重来</button></div><div class="ns-board"></div><div class="ns-hint">点击与空格相邻的方块，或用 <kbd>方向键</kbd> / <kbd>WASD</kbd> 滑动</div>';
container.appendChild(wrap);
boardEl=wrap.querySelector('.ns-board');
movesEl=wrap.querySelector('.ns-mv');
timerEl=wrap.querySelector('.ns-tm');
boardEl.addEventListener('click',function(e){
  var t=e.target;
  if(t&&t.classList&&t.classList.contains('ns-tile'))tryMove(parseInt(t.dataset.pos,10));
});
wrap.querySelector('.ns-reset').addEventListener('click',reset);
container.addEventListener('keydown',onKey);
container.setAttribute('tabindex','0');
var total=size*size;
board.length=0;
for(var i=0;i<total;i++)board.push(i);
reset();
}