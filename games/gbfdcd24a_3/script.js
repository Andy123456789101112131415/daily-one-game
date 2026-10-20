function init_gbfdcd24a_3(container) {
container.innerHTML='<div id="g2048-root"><div class="g2048-header"><div class="g2048-title">数字拼图 2048</div><div class="g2048-scores"><div class="g2048-score"><span>SCORE</span><b id="g2048-score">0</b></div><div class="g2048-score"><span>BEST</span><b id="g2048-best">0</b></div></div></div><div class="g2048-board" id="g2048-board"></div><div class="g2048-footer"><div class="g2048-hint">方向键 / WASD 移动 · 手机可滑动</div><button class="g2048-btn" id="g2048-restart">重新开始</button></div><div class="g2048-overlay" id="g2048-overlay"><div class="g2048-msg" id="g2048-msg"></div><div class="g2048-sub" id="g2048-sub"></div><button class="g2048-btn" id="g2048-again">再来一局</button></div></div>';
  var root=container.querySelector('#g2048-root');
  var boardEl=container.querySelector('#g2048-board');
  var scoreEl=container.querySelector('#g2048-score');
  var bestEl=container.querySelector('#g2048-best');
  var overlay=container.querySelector('#g2048-overlay');
  var msgEl=container.querySelector('#g2048-msg');
  var subEl=container.querySelector('#g2048-sub');
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
    for(var k=0;k<N;k++){
      var line=[];
      var coords=[];
      for(var t=0;t<N;t++){
        if(dir==='left'){r=k;c=t;}
        else if(dir==='right'){r=k;c=N-1-t;}
        else if(dir==='up'){r=t;c=k;}
        else{r=N-1-t;c=k;}
        line.push(grid[r][c]);
        coords.push([r,c]);
      }
      var before=line.slice();
      var after=slideLine(line);
      for(var p=0;p<N;p++){
        var rr=coords[p][0];
        var cc=coords[p][1];
        if(grid[rr][cc]!==after[p]){moved=true;}
        grid[rr][cc]=after[p];
        if(after[p]!==0&&before[p]!==0&&after[p]!==before[p]){merged[rr][cc]=true;}
      }
    }
    if(moved){
      addRandom();
      scoreEl.textContent=String(score);
      if(score>best){best=score;bestEl.textContent=String(best);try{localStorage.setItem('g2048_best',String(best));}catch(e){}}
      render();
      if(won){showOverlay('恭喜达成 2048！','最终得分 '+score);over=true;return;}
      if(!canMove()){over=true;showOverlay('游戏结束','最终得分 '+score);}
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
  function keyHandler(e){
    var key=e.key;
    var handled=true;
    if(key==='ArrowLeft'||key==='a'||key==='A'){move('left');}
    else if(key==='ArrowRight'||key==='d'||key==='D'){move('right');}
    else if(key==='ArrowUp'||key==='w'||key==='W'){move('up');}
    else if(key==='ArrowDown'||key==='s'||key==='S'){move('down');}
    else{handled=false;}
    if(handled){e.preventDefault();}
  }
  var touchStartX=0;
  var touchStartY=0;
  function onTouchStart(e){
    if(e.touches.length!==1){return;}
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
  }
  function onTouchEnd(e){
    if(e.changedTouches.length!==1){return;}
    var dx=e.changedTouches[0].clientX-touchStartX;
    var dy=e.changedTouches[0].clientY-touchStartY;
    var ax=Math.abs(dx);
    var ay=Math.abs(dy);
    if(Math.max(ax,ay)<24){return;}
    if(ax>ay){move(dx>0?'right':'left');}
    else{move(dy>0?'down':'up');}
  }
  function restart(){newGrid();}
  initBoardDom();
  newGrid();
  root.addEventListener('keydown',keyHandler);
  document.addEventListener('keydown',keyHandler);
  boardEl.addEventListener('touchstart',onTouchStart,{passive:true});
  boardEl.addEventListener('touchend',onTouchEnd,{passive:true});
  container.querySelector('#g2048-restart').addEventListener('click',restart);
  container.querySelector('#g2048-again').addEventListener('click',restart);
  root.setAttribute('tabindex','0');
  root.focus();
}