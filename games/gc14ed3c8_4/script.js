function init_gc14ed3c8_4(container) {
var size=4;
var board=[];
var score=0;
var best=0;
var over=false;
var won=false;
var tileId=0;
var tileEls={};
var boardEl=null;
var tilesEl=null;
var msgEl=null;
var scoreEl=null;
var bestEl=null;
var gap=8;

function tileColor(v){
  var map={2:'#eee',4:'#e6e2f5',8:'#c7b3f0',16:'#a78bfa',32:'#8b5cf6',64:'#7c3aed',128:'#06b6d4',256:'#0ea5b7',512:'#10b981',1024:'#f59e0b',2048:'#ef4444'};
  return map[v]||'#7c3aed';
}
function tileTextColor(v){
  return v<=4?'#1e293b':(v<=8?'#1e293b':'#ffffff');
}
function emptyCells(){
  var arr=[];
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      if(board[r][c]===0)arr.push({r:r,c:c});
    }
  }
  return arr;
}
function spawn(){
  var empt=emptyCells();
  if(empt.length===0)return;
  var cell=empt[Math.floor(Math.random()*empt.length)];
  board[cell.r][cell.c]=Math.random()<0.9?2:4;
}
function newGame(){
  board=[];
  for(var r=0;r<size;r++){
    board.push([]);
    for(var c=0;c<size;c++)board[r].push(0);
  }
  score=0;
  over=false;
  won=false;
  tileEls={};
  spawn();
  spawn();
  if(msgEl)msgEl.classList.remove('show');
  render();
}
function cellSize(){
  var w=boardEl.clientWidth-16;
  return (w-(size-1)*gap)/size;
}
function render(){
  if(!tilesEl)return;
  var cs=cellSize();
  var used={};
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      var v=board[r][c];
      if(v===0)continue;
      var key=r+'-'+c;
      used[key]=true;
      var el=tileEls[key];
      if(!el){
        el=document.createElement('div');
        el.className='g2048-tile';
        tilesEl.appendChild(el);
        tileEls[key]=el;
        el.classList.add('g2048-pop');
      }
      el.style.width=cs+'px';
      el.style.height=cs+'px';
      el.style.left=(c*(cs+gap))+'px';
      el.style.top=(r*(cs+gap))+'px';
      el.style.background=tileColor(v);
      el.style.color=tileTextColor(v);
      el.style.fontSize=Math.max(14,Math.round(cs*0.42))+'px';
      el.textContent=v;
    }
  }
  for(var k in tileEls){
    if(!used[k]){
      tilesEl.removeChild(tileEls[k]);
      delete tileEls[k];
    }
  }
  if(scoreEl)scoreEl.textContent=score;
  if(bestEl)bestEl.textContent=best;
}
function slide(row){
  var arr=row.filter(function(x){return x!==0;});
  var res=[];
  var gained=0;
  for(var i=0;i<arr.length;i++){
    if(i<arr.length-1&&arr[i]===arr[i+1]){
      var nv=arr[i]*2;
      res.push(nv);
      gained+=nv;
      if(nv===2048)won=true;
      i++;
    }else{
      res.push(arr[i]);
    }
  }
  while(res.length<size)res.push(0);
  return {row:res,gained:gained};
}
function move(dir){
  if(over||won)return;
  var moved=false;
  var gained=0;
  var r,c;
  if(dir==='left'||dir==='right'){
    for(r=0;r<size;r++){
      var row=board[r].slice();
      if(dir==='right')row.reverse();
      var out=slide(row);
      if(dir==='right')out.row.reverse();
      for(c=0;c<size;c++){
        if(board[r][c]!==out.row[c])moved=true;
        board[r][c]=out.row[c];
      }
      gained+=out.gained;
    }
  }else{
    for(c=0;c<size;c++){
      var col=[];
      for(r=0;r<size;r++)col.push(board[r][c]);
      if(dir==='down')col.reverse();
      var o=slide(col);
      if(dir==='down')o.row.reverse();
      for(r=0;r<size;r++){
        if(board[r][c]!==o.row[r])moved=true;
        board[r][c]=o.row[r];
      }
      gained+=o.gained;
    }
  }
  if(moved){
    score+=gained;
    if(score>best)best=score;
    spawn();
    render();
    if(won){
      showMsg('获胜！','继续挑战更高分数');
    }else if(!canMove()){
      over=true;
      showMsg('游戏结束','得分 '+score);
    }
  }
}
function canMove(){
  if(emptyCells().length>0)return true;
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      var v=board[r][c];
      if(c<size-1&&board[r][c+1]===v)return true;
      if(r<size-1&&board[r+1][c]===v)return true;
    }
  }
  return false;
}
function showMsg(title,sub){
  if(!msgEl)return;
  msgEl.innerHTML='<div>'+title+'</div><div class="g2048-sub">'+sub+'</div><button class="g2048-btn" id="g2048-again">再来一局</button>';
  msgEl.classList.add('show');
  var btn=msgEl.querySelector('#g2048-again');
  if(btn)btn.addEventListener('click',function(){
    newGame();
  });
}
function handleKey(e){
  var k=e.key;
  var map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down',A:'left',D:'right',W:'up',S:'down'};
  var dir=map[k];
  if(dir){
    e.preventDefault();
    move(dir);
  }
}
function buildUI(){
  container.innerHTML='';
  var wrap=document.createElement('div');
  wrap.id='g2048-wrap';
  wrap.tabIndex=0;
  wrap.innerHTML='<div class="g2048-top"><div class="g2048-scores"><div class="g2048-score"><span>得分</span><b id="g2048-score">0</b></div><div class="g2048-score"><span>最高</span><b id="g2048-best">0</b></div></div><button class="g2048-btn" id="g2048-reset">重来</button></div><div class="g2048-board"><div class="g2048-grid" id="g2048-grid"></div><div class="g2048-tiles" id="g2048-tiles"></div><div class="g2048-msg" id="g2048-msg"></div></div><div class="g2048-hint">方向键 / WASD 移动方块</div>';
  container.appendChild(wrap);
  boardEl=wrap.querySelector('.g2048-board');
  tilesEl=wrap.querySelector('#g2048-tiles');
  msgEl=wrap.querySelector('#g2048-msg');
  scoreEl=wrap.querySelector('#g2048-score');
  bestEl=wrap.querySelector('#g2048-best');
  var grid=wrap.querySelector('#g2048-grid');
  for(var i=0;i<size*size;i++){
    var cell=document.createElement('div');
    cell.className='g2048-cell';
    grid.appendChild(cell);
  }
  var resetBtn=wrap.querySelector('#g2048-reset');
  resetBtn.addEventListener('click',function(){
    newGame();
    wrap.focus();
  });
  wrap.addEventListener('keydown',handleKey);
  var touchStartX=0,touchStartY=0;
  wrap.addEventListener('touchstart',function(e){
    if(e.touches.length===1){
      touchStartX=e.touches[0].clientX;
      touchStartY=e.touches[0].clientY;
    }
  },{passive:true});
  wrap.addEventListener('touchend',function(e){
    if(e.changedTouches.length!==1)return;
    var dx=e.changedTouches[0].clientX-touchStartX;
    var dy=e.changedTouches[0].clientY-touchStartY;
    if(Math.abs(dx)<24&&Math.abs(dy)<24)return;
    if(Math.abs(dx)>Math.abs(dy)){
      move(dx>0?'right':'left');
    }else{
      move(dy>0?'down':'up');
    }
  },{passive:true});
  window.addEventListener('resize',function(){
    if(boardEl)render();
  });
  newGame();
  wrap.focus();
}
buildUI();
}