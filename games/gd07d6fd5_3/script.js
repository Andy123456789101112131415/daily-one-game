function init_gd07d6fd5_3(container) {
var size=3,board=[],empty=0,moves=0,solved=false,wrap=null,boardEl=null,movesEl=null,timerEl=null,sec=0,timerId=null;
var COLORS=['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#14b8a6'];
function idx(r,c){return r*size+c}
function shuffle(){
  var total=size*size;
  board=[];
  for(var i=0;i<total;i++)board.push(i+1);
  empty=total-1;
  board[empty]=total;
  var prev=-1;
  for(var k=0;k<400;k++){
    var er=Math.floor(empty/size),ec=empty%size;
    var cand=[];
    if(er>0)cand.push(idx(er-1,ec));
    if(er<size-1)cand.push(idx(er+1,ec));
    if(ec>0)cand.push(idx(er,ec-1));
    if(ec<size-1)cand.push(idx(er,ec+1));
    if(cand.length===0)break;
    var pick;
    do{pick=cand[Math.floor(Math.random()*cand.length)];}while(pick===prev&&cand.length>1);
    board[empty]=board[pick];board[pick]=total;prev=empty;empty=pick;
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
function init(){
  wrap=document.getElementById('ns-wrap');
  if(!wrap)return;
  boardEl=wrap.querySelector('.ns-board');
  movesEl=wrap.querySelector('.ns-moves');
  timerEl=wrap.querySelector('.ns-timer');
  var resetBtn=wrap.querySelector('.ns-reset');
  if(resetBtn)resetBtn.addEventListener('click',reset);
  boardEl.addEventListener('click',function(e){
    var t=e.target.closest('.ns-tile');
    if(!t||t.classList.contains('ns-empty'))return;
    var pos=parseInt(t.dataset.pos,10);
    if(!isNaN(pos))tryMove(pos);
  });
  document.addEventListener('keydown',onKey);
  reset();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
}