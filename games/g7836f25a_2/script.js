function init_g7836f25a_2(container) {
var size=4;
var board=[];
var score=0;
var best=0;
var won=false;
var over=false;
var animating=false;
var tileEls=[];
var wrap=container.querySelector('.m2048-wrap');
var tilesLayer=container.querySelector('.m2048-tiles');
var scoreEl=container.querySelector('.m2048-score-val');
var bestEl=container.querySelector('.m2048-best-val');
var overlay=container.querySelector('.m2048-overlay');
var overlayTitle=container.querySelector('.m2048-overlay-title');
var overlayMsg=container.querySelector('.m2048-overlay-msg');
var restartBtn=container.querySelector('.m2048-btn');
var overlayBtn=container.querySelector('.m2048-overlay-btn');
var boardEl=container.querySelector('.m2048-board');

var colors={
  2:['#f8f9fc','#1e293b'],4:['#ede9fe','#5b21b6'],8:['#cffafe','#0e7490'],
  16:['#a5f3fc','#0e7490'],32:['#bbf7d0','#047857'],64:['#6ee7b7','#065f46'],
  128:['#fde68a','#92400e'],256:['#fcd34d','#92400e'],512:['#fbbf24','#7c2d12'],
  1024:['#f59e0b','#ffffff'],2048:['#7c3aed','#ffffff']
};

function getColor(v){
  if(colors[v])return colors[v];
  return ['#4c1d95','#ffffff'];
}

function tileSize(){
  var w=tilesLayer.clientWidth||400;
  return (w-8*3)/4;
}

function posXY(r,c){
  var s=tileSize();
  return {x:c*(s+8),y:r*(s+8),s:s};
}

function render(){
  tilesLayer.innerHTML='';
  var s=tileSize();
  var fs=Math.max(14,s*0.42);
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      var v=board[r][c];
      if(!v)continue;
      var d=document.createElement('div');
      d.className='m2048-tile';
      var col=getColor(v);
      d.style.background=col[0];
      d.style.color=col[1];
      d.style.width=s+'px';
      d.style.height=s+'px';
      d.style.fontSize=fs+'px';
      var p=posXY(r,c);
      d.style.transform='translate('+p.x+'px,'+p.y+'px)';
      d.textContent=v;
      tilesLayer.appendChild(d);
    }
  }
  scoreEl.textContent=score;
  if(score>best){best=score;}
  bestEl.textContent=best;
}

function addRandom(){
  var empty=[];
  for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(!board[r][c])empty.push([r,c]);
  if(!empty.length)return;
  var pick=empty[Math.floor(Math.random()*empty.length)];
  board[pick[0]][pick[1]]=Math.random()<0.9?2:4;
}

function canMove(){
  for(var r=0;r<size;r++)for(var c=0;c<size;c++){
    if(!board[r][c])return true;
    if(c<size-1&&board[r][c]===board[r][c+1])return true;
    if(r<size-1&&board[r][c]===board[r+1][c])return true;
  }
  return false;
}

function slideRow(row){
  var arr=row.filter(function(v){return v;});
  var res=[];
  var gained=0;
  for(var i=0;i<arr.length;i++){
    if(i<arr.length-1&&arr[i]===arr[i+1]){
      var merged=arr[i]*2;
      res.push(merged);
      gained+=merged;
      if(merged===2048)won=true;
      i++;
    }else{
      res.push(arr[i]);
    }
  }
  while(res.length<size)res.push(0);
  return {row:res,gained:gained};
}

function rotate(m){
  var n=[];
  for(var r=0;r<size;r++){
    n.push([]);
    for(var c=0;c<size;c++)n[r].push(m[c][size-1-r]);
  }
  return n;
}

function move(dir){
  if(over||animating)return;
  var old=JSON.stringify(board);
  var gained=0;
  var times=dir==='up'?1:dir==='right'?2:dir==='down'?3:0;
  for(var i=0;i<times;i++)board=rotate(board);
  for(var r=0;r<size;r++){
    var res=slideRow(board[r]);
    board[r]=res.row;
    gained+=res.gained;
  }
  for(var j=0;j<(4-times)%4;j++)board=rotate(board);
  if(JSON.stringify(board)===old)return;
  score+=gained;
  addRandom();
  render();
  if(won&&!over){
    showOverlay('win','🎉 达成 2048！','继续挑战更高分','继续');
    won=false;
    return;
  }
  if(!canMove()){
    over=true;
    showOverlay('lose','游戏结束','最终得分：'+score,'再来一局');
  }
}

function showOverlay(type,title,msg,btn){
  overlayTitle.textContent=title;
  overlayTitle.className='m2048-overlay-title '+type;
  overlayMsg.textContent=msg;
  overlayBtn.textContent=btn;
  overlay.classList.add('show');
}

function hideOverlay(){
  overlay.classList.remove('show');
}

function newGame(){
  board=[];
  for(var r=0;r<size;r++){
    board.push([]);
    for(var c=0;c<size;c++)board[r].push(0);
  }
  score=0;
  won=false;
  over=false;
  animating=false;
  addRandom();
  addRandom();
  hideOverlay();
  render();
}

function onKey(e){
  var k=e.key;
  var handled=false;
  if(k==='ArrowUp'||k==='w'||k==='W'){move('up');handled=true;}
  else if(k==='ArrowDown'||k==='s'||k==='S'){move('down');handled=true;}
  else if(k==='ArrowLeft'||k==='a'||k==='A'){move('left');handled=true;}
  else if(k==='ArrowRight'||k==='d'||k==='D'){move('right');handled=true;}
  if(handled)e.preventDefault();
}

var touchStartX=0,touchStartY=0,touching=false;
function onTouchStart(e){
  if(e.touches.length!==1)return;
  touchStartX=e.touches[0].clientX;
  touchStartY=e.touches[0].clientY;
  touching=true;
}
function onTouchEnd(e){
  if(!touching)return;
  touching=false;
  if(!e.changedTouches.length)return;
  var dx=e.changedTouches[0].clientX-touchStartX;
  var dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<24&&Math.abs(dy)<24)return;
  if(Math.abs(dx)>Math.abs(dy)){
    move(dx>0?'right':'left');
  }else{
    move(dy>0?'down':'up');
  }
}

restartBtn.addEventListener('click',newGame);
overlayBtn.addEventListener('click',function(){
  if(over||!overlay.classList.contains('show')){newGame();}
  else{hideOverlay();}
});
container.addEventListener('keydown',onKey);
container.setAttribute('tabindex','0');
boardEl.addEventListener('touchstart',onTouchStart,{passive:true});
boardEl.addEventListener('touchend',onTouchEnd,{passive:true});
var mobBtns=container.querySelectorAll('.m2048-mobile button');
for(var b=0;b<mobBtns.length;b++){
  (function(btn){
    btn.addEventListener('click',function(){
      var d=btn.getAttribute('data-dir');
      move(d);
    });
  })(mobBtns[b]);
}
window.addEventListener('resize',function(){render();});
newGame();
container.focus();
}