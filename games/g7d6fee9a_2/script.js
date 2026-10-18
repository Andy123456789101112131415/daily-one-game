function init_g7d6fee9a_2(container) {
var size=4;var board=[];var score=0;var best=0;var over=false;var won=false;var tiles=[];var tileId=0;var container=arguments[0];var boardEl,gridEl,tilesEl,scoreEl,bestEl,overlayEl,addBtn;
function initDOM(){
  container.innerHTML='';
  var wrap=document.createElement('div');wrap.className='g2048-wrap';
  var top=document.createElement('div');top.className='g2048-top';
  var scores=document.createElement('div');scores.className='g2048-scores';
  var sb1=document.createElement('div');sb1.className='g2048-score-box';
  sb1.innerHTML='<div class="g2048-score-label">Score</div><div class="g2048-score-val" id="g2048-score">0</div>';
  var sb2=document.createElement('div');sb2.className='g2048-score-box';
  sb2.innerHTML='<div class="g2048-score-label">Best</div><div class="g2048-score-val" id="g2048-best">0</div>';
  scores.appendChild(sb1);scores.appendChild(sb2);
  addBtn=document.createElement('button');addBtn.className='g2048-btn';addBtn.textContent='\uD83D\uDD04 重来';
  top.appendChild(scores);top.appendChild(addBtn);
  boardEl=document.createElement('div');boardEl.className='g2048-board';
  gridEl=document.createElement('div');gridEl.className='g2048-grid';
  for(var i=0;i<size*size;i++){var c=document.createElement('div');c.className='g2048-cell';gridEl.appendChild(c);}
  tilesEl=document.createElement('div');tilesEl.className='g2048-tiles';
  boardEl.appendChild(gridEl);boardEl.appendChild(tilesEl);
  var hint=document.createElement('div');hint.className='g2048-hint';hint.textContent='方向键 / WASD 滑动，或触摸滑动合并数字';
  wrap.appendChild(top);wrap.appendChild(boardEl);wrap.appendChild(hint);
  container.appendChild(wrap);
  scoreEl=container.querySelector('#g2048-score');
  bestEl=container.querySelector('#g2048-best');
  addBtn.addEventListener('click',newGame);
  document.addEventListener('keydown',onKey);
  boardEl.addEventListener('touchstart',onTouchStart,{passive:true});
  boardEl.addEventListener('touchend',onTouchEnd,{passive:true});
}
function newGame(){
  board=[];for(var r=0;r<size;r++){board.push([]);for(var c=0;c<size;c++)board[r].push(0);}
  score=0;over=false;won=false;tiles=[];tileId=0;
  if(overlayEl&&overlayEl.parentNode)overlayEl.parentNode.removeChild(overlayEl);
  overlayEl=null;
  addRandom();addRandom();
  render();updateScore(0);
}
function addRandom(){
  var empty=[];
  for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(board[r][c]===0)empty.push([r,c]);
  if(empty.length===0)return false;
  var p=empty[Math.floor(Math.random()*empty.length)];
  board[p[0]][p[1]]=Math.random()<0.9?2:4;
  return true;
}
function colorFor(v){
  var map={2:['#eef1f7','#1e293b'],4:['#e2e8f0','#1e293b'],8:['#06b6d4','#fff'],16:['#0891b2','#fff'],32:['#10b981','#fff'],64:['#059669','#fff'],128:['#f59e0b','#fff'],256:['#d97706','#fff'],512:['#ef4444','#fff'],1024:['#dc2626','#fff'],2048:['#7c3aed','#fff']};
  return map[v]||['#7c3aed','#fff'];
}
function render(){
  var gap=size===4?10:7;
  var boardRect=boardEl.getBoundingClientRect();
  var inner=boardRect.width-2*(gap);
  var cell=(inner-(size-1)*gap)/size;
  tilesEl.innerHTML='';
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      var v=board[r][c];
      if(v===0)continue;
      var t=document.createElement('div');
      t.className='g2048-tile';
      var col=colorFor(v);
      t.style.background=col[0];t.style.color=col[1];
      t.style.width=cell+'px';t.style.height=cell+'px';
      t.style.left=(c*(cell+gap))+'px';
      t.style.top=(r*(cell+gap))+'px';
      var fs=cell*(v>=1000?0.28:v>=100?0.34:0.42);
      t.style.fontSize=Math.max(11,fs)+'px';
      t.textContent=v;
      tilesEl.appendChild(t);
    }
  }
}
function updateScore(add){
  scoreEl.textContent=score;
  if(score>best)best=score;
  bestEl.textContent=best;
  if(add>0){scoreEl.classList.remove('add');void scoreEl.offsetWidth;scoreEl.classList.add('add');}
}
function slide(dir){
  if(over||won)return;
  var moved=false;var gained=0;
  var old=board.map(function(row){return row.slice();});
  var rows=[];
  for(var i=0;i<size;i++){
    var line=[];
    for(var j=0;j<size;j++){
      var r,c;
      if(dir==='left'){r=i;c=j;}
      else if(dir==='right'){r=i;c=size-1-j;}
      else if(dir==='up'){r=j;c=i;}
      else{r=size-1-j;c=i;}
      line.push(board[r][c]);
    }
    var filtered=line.filter(function(x){return x!==0;});
    var merged=[];
    for(var k=0;k<filtered.length;k++){
      if(k+1<filtered.length&&filtered[k]===filtered[k+1]){
        var nv=filtered[k]*2;merged.push(nv);gained+=nv;k++;
      }else{merged.push(filtered[k]);}
    }
    while(merged.length<size)merged.push(0);
    for(var j2=0;j2<size;j2++){
      var rr,cc;
      if(dir==='left'){rr=i;cc=j2;}
      else if(dir==='right'){rr=i;cc=size-1-j2;}
      else if(dir==='up'){rr=j2;cc=i;}
      else{rr=size-1-j2;cc=i;}
      board[rr][cc]=merged[j2];
      if(old[rr][cc]!==merged[j2])moved=true;
    }
  }
  if(!moved)return;
  score+=gained;
  addRandom();
  render();updateScore(gained);
  checkState();
}
function checkState(){
  for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(board[r][c]===2048){won=true;showOverlay('win');return;}
  if(!canMove()){over=true;showOverlay('lose');}
}
function canMove(){
  for(var r=0;r<size;r++)for(var c=0;c<size;c++){
    if(board[r][c]===0)return true;
    if(c+1<size&&board[r][c]===board[r][c+1])return true;
    if(r+1<size&&board[r][c]===board[r+1][c])return true;
  }
  return false;
}
function showOverlay(type){
  if(overlayEl&&overlayEl.parentNode)overlayEl.parentNode.removeChild(overlayEl);
  overlayEl=document.createElement('div');overlayEl.className='g2048-overlay';
  var title=document.createElement('div');
  title.className='g2048-overlay-title '+(type==='win'?'win':'lose');
  title.textContent=type==='win'?'\uD83C\uDF89 达成 2048！':'\uD83D\uDE15 游戏结束';
  var sub=document.createElement('div');sub.className='g2048-overlay-sub';
  sub.textContent='得分：'+score;
  var btn=document.createElement('button');btn.className='g2048-btn';btn.textContent='再来一局';
  btn.addEventListener('click',newGame);
  overlayEl.appendChild(title);overlayEl.appendChild(sub);overlayEl.appendChild(btn);
  boardEl.appendChild(overlayEl);
}
var touchX=0,touchY=0;
function onTouchStart(e){var t=e.touches[0];touchX=t.clientX;touchY=t.clientY;}
function onTouchEnd(e){
  var t=e.changedTouches[0];
  var dx=t.clientX-touchX,dy=t.clientY-touchY;
  if(Math.abs(dx)<24&&Math.abs(dy)<24)return;
  if(Math.abs(dx)>Math.abs(dy))slide(dx>0?'right':'left');
  else slide(dy>0?'down':'up');
}
function onKey(e){
  var k=e.key;
  var map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down',A:'left',D:'right',W:'up',S:'down'};
  if(map[k]){e.preventDefault();slide(map[k]);}
}
initDOM();newGame();
window.addEventListener('resize',function(){if(!over&&!won)render();});
}