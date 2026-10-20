function init_gbfdcd24a_3(container) {
container.innerHTML='<div id="g2048-root"><div class="g2048-header"><div class="g2048-title">数字拼图 2048</div><div class="g2048-scores"><div class="g2048-score"><span>SCORE</span><b id="g2048-score">0</b></div><div class="g2048-score"><span>BEST</span><b id="g2048-best">0</b></div></div></div><div class="g2048-board" id="g2048-board"></div><div class="g2048-footer"><div class="g2048-hint">方向键 / WASD 移动 · 手机可滑动</div><button class="g2048-btn" id="g2048-restart">重新开始</button></div><div class="g2048-overlay" id="g2048-overlay"><div class="g2048-msg" id="g2048-msg"></div><div class="g2048-sub" id="g2048-sub"></div><button class="g2048-btn" id="g2048-again">再来一局</button></div></div>';
var root=container.querySelector('#g2048-root');
var boardEl=container.querySelector('#g2048-board');
var scoreEl=container.querySelector('#g2048-score');
var bestEl=container.querySelector('#g2048-best');
var overlay=container.querySelector('#g2048-overlay');
var msgEl=container.querySelector('#g2048-msg');
var subEl=container.querySelector('#g2048-sub');
var restartBtn=container.querySelector('#g2048-restart');
var againBtn=container.querySelector('#g2048-again');
var N=4;
var grid=[];
var score=0;
var best=0;
var merged=[];
var over=false;
var won=false;
var cells=[];
try{best=parseInt(localStorage.getItem('g2048_best')||'0',10)||0;}catch(e){best=0;}
bestEl.textContent=best;
function initBoardDom(){
  boardEl.innerHTML='';
  cells=[];
  for(var i=0;i<N*N;i++){
    var d=document.createElement('div');
    d.className='g2048-cell';
    boardEl.appendChild(d);
    cells.push(d);
  }
}
function newGrid(){
  grid=[];
  for(var r=0;r<N;r++){
    var row=[];
    for(var c=0;c<N;c++){row.push(0);}
    grid.push(row);
  }
  merged=[];
  for(var m=0;m<N;m++){var mrow=[];for(var n=0;n<N;n++){mrow.push(false);}merged.push(mrow);}
  score=0;
  over=false;
  won=false;
  scoreEl.textContent='0';
  overlay.classList.remove('g2048-show');
  addRandom();
  addRandom();
  render();
}
function addRandom(){
  var empty=[];
  for(var r=0;r<N;r++){for(var c=0;c<N;c++){if(grid[r][c]===0){empty.push([r,c]);}}}
  if(empty.length===0){return;}
  var pick=empty[Math.floor(Math.random()*empty.length)];
  grid[pick[0]][pick[1]]=Math.random()<0.9?2:4;
}
function render(){
  for(var r=0;r<N;r++){
    for(var c=0;c<N;c++){
      var v=grid[r][c];
      var el=cells[r*N+c];
      var cls='g2048-cell';
      if(v>0){cls+=' g2048-t'+v;}
      if(merged[r][c]){cls+=' g2048-merge';}
      el.className=cls;
      el.textContent=v>0?String(v):'';
    }
  }
  scoreEl.textContent=String(score);
  if(score>best){best=score;bestEl.textContent=String(best);try{localStorage.setItem('g2048_best',String(best));}catch(e){}}
}
function resetMerged(){
  for(var r=0;r<N;r++){for(var c=0;c<N;c++){merged[r][c]=false;}}
}
function slideLine(line){
  var arr=line.filter(function(x){return x!==0;});
  var res=[];
  var i=0;
  while(i<arr.length){
    if(i+1<arr.length&&arr[i]===arr[i+1]){
      var nv=arr[i]*2;
      res.push(nv);
      score+=nv;
      if(nv===2048){won=true;}
      i+=2;
    }else{
      res.push(arr[i]);
      i+=1;
    }
  }
  while(res.length<N){res.push(0);}
  return res;
}
function move(dir){
  if(over){return;}
  resetMerged();
  var moved=false;
  var r,c;
  if(dir==='left'||dir==='right'){
    for(r=0;r<N;r++){
      var line=[];
      for(c=0;c<N;c++){line.push(grid[r][c]);}
      if(dir==='right'){line.reverse();}
      var res=slideLine(line);
      if(dir==='right'){res.reverse();}
      for(c=0;c<N;c++){
        if(grid[r][c]!==res[c]){moved=true;}
        grid[r][c]=res[c];
      }
    }
  }else if(dir==='up'||dir==='down'){
    for(c=0;c<N;c++){
      var col=[];
      for(r=0;r<N;r++){col.push(grid[r][c]);}
      if(dir==='down'){col.reverse();}
      var res2=slideLine(col);
      if(dir==='down'){res2.reverse();}
      for(r=0;r<N;r++){
        if(grid[r][c]!==res2[r]){moved=true;}
        grid[r][c]=res2[r];
      }
    }
  }
  if(moved){
    addRandom();
    render();
    if(won){showOverlay('你赢了！','达到 2048，继续挑战更高分吧');won=false;}
    else if(!canMove()){over=true;showOverlay('游戏结束','没有可移动的方向了');}
  }
}
function canMove(){
  for(var r=0;r<N;r++){
    for(var c=0;c<N;c++){
      if(grid[r][c]===0){return true;}
      if(c+1<N&&grid[r][c]===grid[r][c+1]){return true;}
      if(r+1<N&&grid[r][c]===grid[r+1][c]){return true;}
    }
  }
  return false;
}
function showOverlay(msg,sub){
  msgEl.textContent=msg;
  subEl.textContent=sub;
  overlay.classList.add('g2048-show');
}
function onKey(e){
  var k=e.key;
  var handled=true;
  if(k==='ArrowLeft'||k==='a'||k==='A'){move('left');}
  else if(k==='ArrowRight'||k==='d'||k==='D'){move('right');}
  else if(k==='ArrowUp'||k==='w'||k==='W'){move('up');}
  else if(k==='ArrowDown'||k==='s'||k==='S'){move('down');}
  else{handled=false;}
  if(handled){e.preventDefault();}
}
var touchStartX=0,touchStartY=0,touching=false;
function onTouchStart(e){
  if(!e.touches||e.touches.length===0){return;}
  touching=true;
  touchStartX=e.touches[0].clientX;
  touchStartY=e.touches[0].clientY;
}
function onTouchEnd(e){
  if(!touching){return;}
  touching=false;
  if(!e.changedTouches||e.changedTouches.length===0){return;}
  var dx=e.changedTouches[0].clientX-touchStartX;
  var dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<24&&Math.abs(dy)<24){return;}
  if(Math.abs(dx)>Math.abs(dy)){move(dx>0?'right':'left');}
  else{move(dy>0?'down':'up');}
}
function restart(){
  newGrid();
}
document.addEventListener('keydown',onKey);
boardEl.addEventListener('touchstart',onTouchStart,{passive:true});
boardEl.addEventListener('touchend',onTouchEnd,{passive:true});
restartBtn.addEventListener('click',restart);
againBtn.addEventListener('click',restart);
initBoardDom();
newGrid();
}