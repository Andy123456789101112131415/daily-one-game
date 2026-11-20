function init_gc14ed3c8_5(container) {
var size=4,board=[],score=0,best=0,over=false,won=false;
var wrap=document.querySelector('.g2048-wrap');
var gridEl=wrap.querySelector('.g2048-grid');
var scoreEl=wrap.querySelector('.g2048-cur');
var bestEl=wrap.querySelector('.g2048-best');
var overEl=wrap.querySelector('.g2048-over');
var restartBtn=wrap.querySelector('.g2048-restart');
var overRestartBtn=overEl.querySelector('.g2048-restart');
function init(){
  board=[];
  for(var r=0;r<size;r++){var row=[];for(var c=0;c<size;c++)row.push(0);board.push(row);}
  score=0;over=false;won=false;
  overEl.classList.remove('show');
  addTile();addTile();render();
}
function addTile(){
  var empty=[];
  for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(board[r][c]===0)empty.push([r,c]);
  if(!empty.length)return;
  var p=empty[Math.floor(Math.random()*empty.length)];
  board[p[0]][p[1]]=Math.random()<0.9?2:4;
}
function render(){
  gridEl.innerHTML='';
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      var cell=document.createElement('div');
      cell.className='g2048-cell';
      var v=board[r][c];
      if(v>0){cell.setAttribute('data-v',v);cell.textContent=v;}
      else{cell.textContent='';}
      gridEl.appendChild(cell);
    }
  }
  scoreEl.textContent=score;
  if(score>best)best=score;
  bestEl.textContent=best;
}
function slide(row){
  var arr=row.filter(function(v){return v!==0;});
  var res=[];
  for(var i=0;i<arr.length;i++){
    if(i+1<arr.length&&arr[i]===arr[i+1]){res.push(arr[i]*2);score+=arr[i]*2;i++;}
    else res.push(arr[i]);
  }
  while(res.length<size)res.push(0);
  return res;
}
function move(dir){
  if(over)return false;
  var moved=false;
  for(var i=0;i<size;i++){
    var line=[];
    for(var j=0;j<size;j++){
      if(dir==='left')line.push(board[i][j]);
      else if(dir==='right')line.push(board[i][size-1-j]);
      else if(dir==='up')line.push(board[j][i]);
      else line.push(board[size-1-j][i]);
    }
    var newLine=slide(line);
    for(var j=0;j<size;j++){
      var v=newLine[j];
      if(dir==='left'){if(board[i][j]!==v)moved=true;board[i][j]=v;}
      else if(dir==='right'){if(board[i][size-1-j]!==v)moved=true;board[i][size-1-j]=v;}
      else if(dir==='up'){if(board[j][i]!==v)moved=true;board[j][i]=v;}
      else{if(board[size-1-j][i]!==v)moved=true;board[size-1-j][i]=v;}
    }
  }
  return moved;
}
function canMove(){
  for(var r=0;r<size;r++)for(var c=0;c<size;c++){
    if(board[r][c]===0)return true;
    if(c<size-1&&board[r][c]===board[r][c+1])return true;
    if(r<size-1&&board[r][c]===board[r+1][c])return true;
  }
  return false;
}
function hasWon(){
  for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(board[r][c]>=2048)return true;
  return false;
}
function step(dir){
  if(over)return;
  if(move(dir)){
    addTile();
    render();
    var cells=gridEl.querySelectorAll('.g2048-cell');
    for(var i=0;i<cells.length;i++)if(cells[i].textContent!=='')cells[i].classList.add('g2048-pop');
    if(!won&&hasWon()){
      won=true;over=true;
      overEl.querySelector('h3').textContent='恭喜达成 2048！';
      overEl.querySelector('p').textContent='得分：'+score;
      overEl.classList.add('show');
      return;
    }
    if(!canMove()){
      over=true;
      overEl.querySelector('h3').textContent='游戏结束';
      overEl.querySelector('p').textContent='最终得分：'+score;
      overEl.classList.add('show');
    }
  }
}
if(restartBtn)restartBtn.addEventListener('click',init);
if(overRestartBtn)overRestartBtn.addEventListener('click',init);
document.addEventListener('keydown',function(e){
  var k=e.key;
  if(k==='ArrowLeft'||k==='a'||k==='A'){e.preventDefault();step('left');}
  else if(k==='ArrowRight'||k==='d'||k==='D'){e.preventDefault();step('right');}
  else if(k==='ArrowUp'||k==='w'||k==='W'){e.preventDefault();step('up');}
  else if(k==='ArrowDown'||k==='s'||k==='S'){e.preventDefault();step('down');}
});
var touchStartX=0,touchStartY=0;
wrap.addEventListener('touchstart',function(e){
  if(!e.touches||!e.touches.length)return;
  touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;
},{passive:true});
wrap.addEventListener('touchend',function(e){
  if(!e.changedTouches||!e.changedTouches.length)return;
  var dx=e.changedTouches[0].clientX-touchStartX;
  var dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<20&&Math.abs(dy)<20)return;
  if(Math.abs(dx)>Math.abs(dy))step(dx>0?'right':'left');
  else step(dy>0?'down':'up');
},{passive:true});
init();
}