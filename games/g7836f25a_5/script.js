function init_g7836f25a_5(container) {
var SIZE=4;
var state={grid:[],score:0,best:0,over:false,won:false,keepGoing:false};
var bestKey='mg2048best';
try{state.best=parseInt(localStorage.getItem(bestKey)||'0',10)||0;}catch(e){state.best=0;}

container.innerHTML='';
var wrap=document.createElement('div');
wrap.className='mg-wrap';

var head=document.createElement('div');
head.className='mg-head';
var title=document.createElement('div');
title.className='mg-title';
title.textContent='数字合并';
var tools=document.createElement('div');
tools.className='mg-tools';
var restartBtn=document.createElement('button');
restartBtn.className='mg-btn';
restartBtn.textContent='\uD83D\uDD04 重来';
tools.appendChild(restartBtn);

var scores=document.createElement('div');
scores.className='mg-scores';
var scoreBox=document.createElement('div');
scoreBox.className='mg-score';
scoreBox.innerHTML='<span>分数</span><b>0</b>';
var bestBox=document.createElement('div');
bestBox.className='mg-score mg-best';
bestBox.innerHTML='<span>最高</span><b>0</b>';
scores.appendChild(scoreBox);
scores.appendChild(bestBox);

head.appendChild(title);
head.appendChild(scores);
head.appendChild(tools);
wrap.appendChild(head);

var board=document.createElement('div');
board.className='mg-board';
var gridEl=document.createElement('div');
gridEl.className='mg-grid';
board.appendChild(gridEl);

var overlay=document.createElement('div');
overlay.className='mg-overlay';
var oTitle=document.createElement('h3');
var oText=document.createElement('p');
var oBtn=document.createElement('button');
oBtn.className='mg-btn';
overlay.appendChild(oTitle);
overlay.appendChild(oText);
overlay.appendChild(oBtn);
board.appendChild(overlay);
wrap.appendChild(board);

var hint=document.createElement('div');
hint.className='mg-hint';
hint.textContent='使用方向键 / WASD 滑动方块，相同数字合并，目标 2048！';
wrap.appendChild(hint);

container.appendChild(wrap);

var cells=[];
for(var i=0;i<SIZE*SIZE;i++){
  var c=document.createElement('div');
  c.className='mg-cell';
  gridEl.appendChild(c);
  cells.push(c);
}

var scoreVal=scoreBox.querySelector('b');
var bestVal=bestBox.querySelector('b');

function emptyGrid(){
  var g=[];
  for(var r=0;r<SIZE;r++){
    var row=[];
    for(var cc=0;cc<SIZE;cc++){row.push(0);}
    g.push(row);
  }
  return g;
}

function emptyCells(){
  var list=[];
  for(var r=0;r<SIZE;r++){
    for(var cc=0;cc<SIZE;cc++){
      if(state.grid[r][cc]===0){list.push([r,cc]);}
    }
  }
  return list;
}

function addRandom(){
  var list=emptyCells();
  if(list.length===0){return;}
  var pick=list[Math.floor(Math.random()*list.length)];
  state.grid[pick[0]][pick[1]]=Math.random()<0.9?2:4;
}

function render(){
  for(var r=0;r<SIZE;r++){
    for(var cc=0;cc<SIZE;cc++){
      var cell=cells[r*SIZE+cc];
      var v=state.grid[r][cc];
      cell.className='mg-cell';
      cell.textContent='';
      if(v>0){
        cell.classList.add('mg-v'+v);
        cell.textContent=String(v);
      }
    }
  }
  scoreVal.textContent=String(state.score);
  bestVal.textContent=String(state.best);
}

function updateBest(){
  if(state.score>state.best){
    state.best=state.score;
    try{localStorage.setItem(bestKey,String(state.best));}catch(e){}
  }
}

function canMove(){
  for(var r=0;r<SIZE;r++){
    for(var cc=0;cc<SIZE;cc++){
      var v=state.grid[r][cc];
      if(v===0){return true;}
      if(cc+1<SIZE && state.grid[r][cc+1]===v){return true;}
      if(r+1<SIZE && state.grid[r+1][cc]===v){return true;}
    }
  }
  return false;
}

function hasWon(){
  for(var r=0;r<SIZE;r++){
    for(var cc=0;cc<SIZE;cc++){
      if(state.grid[r][cc]>=2048){return true;}
    }
  }
  return false;
}

function showOverlay(titleText,textText,btnText,action){
  oTitle.textContent=titleText;
  oText.textContent=textText;
  oBtn.textContent=btnText;
  oBtn.onclick=action;
  overlay.classList.add('mg-show');
}

function hideOverlay(){
  overlay.classList.remove('mg-show');
  oBtn.onclick=null;
}

function slideLine(line){
  var arr=line.filter(function(x){return x!==0;});
  var result=[];
  var gained=0;
  for(var i=0;i<arr.length;i++){
    if(i+1<arr.length && arr[i]===arr[i+1]){
      var merged=arr[i]*2;
      result.push(merged);
      gained+=merged;
      i++;
    }else{
      result.push(arr[i]);
    }
  }
  while(result.length<SIZE){result.push(0);}
  return {line:result,gained:gained};
}

function move(dir){
  if(state.over){return;}
  if(state.won && !state.keepGoing){return;}
  var moved=false;
  var gainedTotal=0;
  var g=state.grid;
  var r,cc;
  for(var i=0;i<SIZE;i++){
    var line=[];
    for(var j=0;j<SIZE;j++){
      if(dir==='left'){line.push(g[i][j]);}
      else if(dir==='right'){line.push(g[i][SIZE-1-j]);}
      else if(dir==='up'){line.push(g[j][i]);}
      else if(dir==='down'){line.push(g[SIZE-1-j][i]);}
    }
    var res=slideLine(line);
    gainedTotal+=res.gained;
    for(var k=0;k<SIZE;k++){
      if(dir==='left'){g[i][k]=res.line[k];}
      else if(dir==='right'){g[i][SIZE-1-k]=res.line[k];}
      else if(dir==='up'){g[k][i]=res.line[k];}
      else if(dir==='down'){g[SIZE-1-k][i]=res.line[k];}
    }
    for(var m=0;m<SIZE;m++){
      var orig;
      if(dir==='left'){orig=line[m];}
      else if(dir==='right'){orig=line[m];}
      else if(dir==='up'){orig=line[m];}
      else {orig=line[m];}
      var now;
      if(dir==='left'){now=res.line[m];}
      else if(dir==='right'){now=res.line[m];}
      else if(dir==='up'){now=res.line[m];}
      else {now=res.line[m];}
      if(orig!==now){moved=true;}
    }
  }
  if(!moved){return;}
  state.score+=gainedTotal;
  updateBest();
  addRandom();
  render();
  if(!state.won && hasWon()){
    state.won=true;
    showOverlay('\uD83C\uDF89 达成 2048！','继续挑战更高分数吧！','继续游戏',function(){
      state.keepGoing=true;
      hideOverlay();
    });
    return;
  }
  if(!canMove()){
    state.over=true;
    showOverlay('\uD83D\uDE15 游戏结束','最终分数：'+state.score,'再来一局',function(){
      resetGame();
    });
  }
}

function resetGame(){
  state.grid=emptyGrid();
  state.score=0;
  state.over=false;
  state.won=false;
  state.keepGoing=false;
  hideOverlay();
  addRandom();
  addRandom();
  render();
}

function handleKey(e){
  var key=e.key;
  var dir=null;
  if(key==='ArrowLeft'||key==='a'||key==='A'){dir='left';}
  else if(key==='ArrowRight'||key==='d'||key==='D'){dir='right';}
  else if(key==='ArrowUp'||key==='w'||key==='W'){dir='up';}
  else if(key==='ArrowDown'||key==='s'||key==='S'){dir='down';}
  if(dir){
    e.preventDefault();
    move(dir);
  }
}

var touchStartX=0,touchStartY=0,touching=false;
function onTouchStart(e){
  if(!e.touches || e.touches.length===0){return;}
  touching=true;
  touchStartX=e.touches[0].clientX;
  touchStartY=e.touches[0].clientY;
}
function onTouchEnd(e){
  if(!touching){return;}
  touching=false;
  if(!e.changedTouches || e.changedTouches.length===0){return;}
  var dx=e.changedTouches[0].clientX-touchStartX;
  var dy=e.changedTouches[0].clientY-touchStartY;
  var ax=Math.abs(dx),ay=Math.abs(dy);
  if(Math.max(ax,ay)<24){return;}
  if(ax>ay){move(dx>0?'right':'left');}
  else{move(dy>0?'down':'up');}
}

restartBtn.addEventListener('click',resetGame);
document.addEventListener('keydown',handleKey);
board.addEventListener('touchstart',onTouchStart,{passive:true});
board.addEventListener('touchend',onTouchEnd,{passive:true});

resetGame();
}