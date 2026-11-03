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
        cell.textContent=v===0?'':String(v);
        if(v>0){cell.classList.add('mg-v'+v);}
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

  function hasMoves(){
    if(emptyCells().length>0){return true;}
    for(var r=0;r<SIZE;r++){
      for(var cc=0;cc<SIZE;cc++){
        var v=state.grid[r][cc];
        if(cc+1<SIZE && state.grid[r][cc+1]===v){return true;}
        if(r+1<SIZE && state.grid[r+1][cc]===v){return true;}
      }
    }
    return false;
  }

  function slideRow(row){
    var arr=[];
    var i;
    for(i=0;i<SIZE;i++){if(row[i]!==0){arr.push(row[i]);}}
    var out=[];
    var gained=0;
    for(i=0;i<arr.length;i++){
      if(i+1<arr.length && arr[i]===arr[i+1]){
        out.push(arr[i]*2);
        gained+=arr[i]*2;
        i++;
      }else{
        out.push(arr[i]);
      }
    }
    while(out.length<SIZE){out.push(0);}
    return {row:out,gained:gained};
  }

  function move(dir){
    if(state.over){return;}
    var moved=false;
    var gainedTotal=0;
    var r,cc;
    for(var step=0;step<SIZE;step++){
      var line=[];
      for(cc=0;cc<SIZE;cc++){
        var rr,cc2;
        if(dir==='left'){rr=step;cc2=cc;}
        else if(dir==='right'){rr=step;cc2=SIZE-1-cc;}
        else if(dir==='up'){rr=cc;cc2=step;}
        else{rr=SIZE-1-cc;cc2=step;}
        line.push(state.grid[rr][cc2]);
      }
      var res=slideRow(line);
      gainedTotal+=res.gained;
      for(cc=0;cc<SIZE;cc++){
        var rr2,cc3;
        if(dir==='left'){rr2=step;cc3=cc;}
        else if(dir==='right'){rr2=step;cc3=SIZE-1-cc;}
        else if(dir==='up'){rr2=cc;cc3=step;}
        else{rr2=SIZE-1-cc;cc3=step;}
        if(state.grid[rr2][cc3]!==res.row[cc]){moved=true;}
        state.grid[rr2][cc3]=res.row[cc];
      }
    }
    if(!moved){return;}
    state.score+=gainedTotal;
    updateBest();
    addRandom();
    render();
    pulse();
    if(!state.won){
      for(r=0;r<SIZE;r++){
        for(cc=0;cc<SIZE;cc++){
          if(state.grid[r][cc]===2048){state.won=true;showWin();return;}
        }
      }
    }
    if(!hasMoves()){
      state.over=true;
      showOver();
    }
  }

  function pulse(){
    board.classList.remove('mg-pop');
    void board.offsetWidth;
    board.classList.add('mg-pop');
  }

  function showWin(){
    board.classList.add('mg-win-anim');
    oTitle.textContent='\uD83C\uDF89 达成 2048！';
    oText.textContent='继续挑战更高分数吧';
    oBtn.textContent='继续游戏';
    oBtn.onclick=function(){
      overlay.classList.remove('mg-show');
      state.keepGoing=true;
    };
    overlay.classList.add('mg-show');
  }

  function showOver(){
    oTitle.textContent='游戏结束';
    oText.textContent='最终得分 '+state.score;
    oBtn.textContent='再来一局';
    oBtn.onclick=function(){newGame();};
    overlay.classList.add('mg-show');
  }

  function newGame(){
    state.grid=emptyGrid();
    state.score=0;
    state.over=false;
    state.won=false;
    state.keepGoing=false;
    overlay.classList.remove('mg-show');
    board.classList.remove('mg-win-anim');
    addRandom();
    addRandom();
    render();
  }

  function onKey(e){
    var k=e.key;
    var dir=null;
    if(k==='ArrowLeft'||k==='a'||k==='A'){dir='left';}
    else if(k==='ArrowRight'||k==='d'||k==='D'){dir='right';}
    else if(k==='ArrowUp'||k==='w'||k==='W'){dir='up';}
    else if(k==='ArrowDown'||k==='s'||k==='S'){dir='down';}
    if(dir){
      e.preventDefault();
      move(dir);
    }
  }

  var touchStartX=0,touchStartY=0,touching=false;
  board.addEventListener('touchstart',function(e){
    if(e.touches.length!==1){return;}
    touching=true;
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
  },{passive:true});
  board.addEventListener('touchend',function(e){
    if(!touching){return;}
    touching=false;
    var t=e.changedTouches[0];
    var dx=t.clientX-touchStartX;
    var dy=t.clientY-touchStartY;
    if(Math.abs(dx)<24 && Math.abs(dy)<24){return;}
    if(Math.abs(dx)>Math.abs(dy)){
      move(dx>0?'right':'left');
    }else{
      move(dy>0?'down':'up');
    }
  },{passive:true});

  restartBtn.addEventListener('click',function(){newGame();});

  container.addEventListener('keydown',onKey);
  container.setAttribute('tabindex','0');

  newGame();
}