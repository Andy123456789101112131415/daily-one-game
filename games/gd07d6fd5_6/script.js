function init_gd07d6fd5_6(container) {
var size=4;
var tiles=[];
var emptyIdx=size*size-1;
var moves=0;
var solved=false;
var startTime=0;
var timerId=null;
var boardEl=null;
var container=null;

function fmtTime(ms){var s=Math.floor(ms/1000);var m=Math.floor(s/60);s=s%60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s}

function buildLayout(){
  boardEl=container.querySelector('.ns-board');
  boardEl.style.gridTemplateColumns='repeat('+size+',1fr)';
  boardEl.style.gridTemplateRows='repeat('+size+',1fr)';
}

function shuffle(){
  var total=size*size;
  tiles=[];
  for(var i=0;i<total;i++)tiles.push(i);
  var blank=total-1;
  var last=-1;
  var steps=total*total*8;
  for(var k=0;k<steps;k++){
    var nb=neighbors(blank).filter(function(x){return x!==last});
    if(!nb.length)continue;
    var pick=nb[Math.floor(Math.random()*nb.length)];
    tiles[blank]=tiles[pick];
    tiles[pick]=total-1;
    last=blank;
    blank=pick;
  }
  emptyIdx=blank;
  if(isSolved())shuffle();
}

function neighbors(idx){
  var r=Math.floor(idx/size),c=idx%size,res=[];
  if(r>0)res.push(idx-size);
  if(r<size-1)res.push(idx+size);
  if(c>0)res.push(idx-1);
  if(c<size-1)res.push(idx+1);
  return res;
}

function isSolved(){
  for(var i=0;i<size*size-1;i++){if(tiles[i]!==i)return false}
  return true;
}

var COLORS=['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444'];

function render(){
  var html='';
  for(var i=0;i<size*size;i++){
    var v=tiles[i];
    if(v===size*size-1){
      html+='<div class="ns-tile ns-empty" data-idx="'+i+'"></div>';
    }else{
      var ok=(v===i)?' ns-ok':'';
      var color=COLORS[v%COLORS.length];
      html+='<div class="ns-tile'+ok+'" data-idx="'+i+'" style="background:'+color+'">'+(v+1)+'</div>';
    }
  }
  boardEl.innerHTML=html;
  container.querySelector('.ns-moves').textContent=moves;
}

function tryMove(idx){
  if(solved)return;
  if(idx<0||idx>=size*size)return;
  var ok=neighbors(emptyIdx).indexOf(idx)>=0;
  if(!ok)return;
  tiles[emptyIdx]=tiles[idx];
  tiles[idx]=size*size-1;
  emptyIdx=idx;
  moves++;
  if(!startTime)startTimer();
  render();
  if(isSolved())win();
}

function startTimer(){
  startTime=Date.now();
  if(timerId)clearInterval(timerId);
  timerId=setInterval(function(){
    if(solved)return;
    container.querySelector('.ns-time').textContent=fmtTime(Date.now()-startTime);
  },250);
}

function win(){
  solved=true;
  if(timerId){clearInterval(timerId);timerId=null}
  container.querySelector('.ns-time').textContent=fmtTime(startTime?Date.now()-startTime:0);
  container.querySelector('.ns-overlay').classList.add('ns-show');
  container.querySelector('.ns-winmoves').textContent=moves;
  container.querySelector('.ns-wintime').textContent=fmtTime(startTime?Date.now()-startTime:0);
}

function reset(){
  solved=false;
  moves=0;
  startTime=0;
  if(timerId){clearInterval(timerId);timerId=null}
  container.querySelector('.ns-time').textContent='00:00';
  container.querySelector('.ns-overlay').classList.remove('ns-show');
  shuffle();
  render();
}

function onKey(e){
  if(solved)return;
  var r=Math.floor(emptyIdx/size),c=emptyIdx%size;
  var target=-1;
  if(e.key==='ArrowUp'&&r<size-1)target=emptyIdx+size;
  else if(e.key==='ArrowDown'&&r>0)target=emptyIdx-size;
  else if(e.key==='ArrowLeft'&&c<size-1)target=emptyIdx+1;
  else if(e.key==='ArrowRight'&&c>0)target=emptyIdx-1;
  if(target>=0){e.preventDefault();tryMove(target);}
}

function onBoardClick(e){
  var t=e.target.closest('.ns-tile');
  if(!t||!boardEl.contains(t))return;
  var idx=parseInt(t.getAttribute('data-idx'),10);
  if(isNaN(idx))return;
  tryMove(idx);
}

function init(root){
  container=root||document.querySelector('.ns-wrap');
  if(!container)return;
  buildLayout();
  boardEl.addEventListener('click',onBoardClick);
  var resetBtn=container.querySelector('.ns-reset');
  if(resetBtn)resetBtn.addEventListener('click',reset);
  document.addEventListener('keydown',onKey);
  reset();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){init();});
}else{
  init();
}
}