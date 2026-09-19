function init_gdde7cd56_2(container) {
var size=5;var grid=[];var pos={r:0,c:0};var targetVal=0;var score=0;var steps=0;var maxSteps=0;var gameOver=false;var gridEl=null;var msgEl=null;var scoreEl=null;var stepsEl=null;var levelEl=null;var level=1;

function rnd(n){return Math.floor(Math.random()*n)}

function genLevel(){
  level=1+Math.floor(score/3);
  size=4+Math.min(level,3);
  targetVal=0;gameOver=false;steps=0;
  maxSteps=size*size;
  grid=[];
  var nums=[];
  var total=size*size;
  for(var i=1;i<=total;i++)nums.push(i);
  for(var i=nums.length-1;i>0;i--){var j=rnd(i+1);var t=nums[i];nums[i]=nums[j];nums[j]=t;}
  var idx=0;
  for(var r=0;r<size;r++){grid[r]=[];for(var c=0;c<size;c++){grid[r][c]=nums[idx++];}}
  var startIdx=rnd(total);
  pos.r=Math.floor(startIdx/size);pos.c=startIdx%size;
  targetVal=grid[pos.r][pos.c];
  // ensure solvable: place 1 adjacent to start
  var neighbors=getNeighbors(pos.r,pos.c);
  var n1=neighbors[rnd(neighbors.length)];
  grid[n1.r][n1.c]=1;
  grid[pos.r][pos.c]=targetVal===1?2:targetVal;
  if(grid[pos.r][pos.c]===1)grid[pos.r][pos.c]=2;
  targetVal=grid[pos.r][pos.c];
  render();
}

function getNeighbors(r,c){
  var res=[];
  if(r>0)res.push({r:r-1,c:c});
  if(r<size-1)res.push({r:r+1,c:c});
  if(c>0)res.push({r:r,c:c-1});
  if(c<size-1)res.push({r:r,c:c+1});
  return res;
}

function render(){
  if(!gridEl)return;
  gridEl.style.gridTemplateColumns='repeat('+size+',1fr)';
  gridEl.innerHTML='';
  for(var r=0;r<size;r++){
    for(var c=0;c<size;c++){
      var cell=document.createElement('div');
      cell.className='nm-cell';
      var v=grid[r][c];
      cell.textContent=v;
      if(r===pos.r&&c===pos.c){cell.classList.add('nm-current');}
      else if(v===targetVal+1){cell.classList.add('nm-next');}
      else if(v<=targetVal){cell.classList.add('nm-visited');}
      else{cell.classList.add('nm-empty');}
      (function(rr,cc){cell.addEventListener('click',function(){tryMove(rr,cc);});})(r,c);
      gridEl.appendChild(cell);
    }
  }
  if(scoreEl)scoreEl.textContent=score;
  if(stepsEl)stepsEl.textContent=steps+'/'+maxSteps;
  if(levelEl)levelEl.textContent=level;
}

function tryMove(r,c){
  if(gameOver)return;
  var dr=Math.abs(r-pos.r);var dc=Math.abs(c-pos.c);
  if(dr+dc!==1)return;
  var v=grid[r][c];
  if(v===targetVal+1){
    pos.r=r;pos.c=c;targetVal=v;steps++;score+=1;
    if(targetVal===size*size){win();return;}
    render();
  }else if(v<=targetVal){
    pos.r=r;pos.c=c;steps++;render();
    updateMsg('已访问的数字，继续寻找 '+(targetVal+1),'nm-info');
  }else{
    steps++;render();
    updateMsg('不能跳到 '+v+'，需要 '+(targetVal+1),'nm-lose');
    if(steps>=maxSteps){lose();return;}
  }
}

function updateMsg(text,cls){
  if(!msgEl)return;
  msgEl.textContent=text;
  msgEl.className='nm-msg '+cls;
}

function win(){
  gameOver=true;score+=5;render();
  updateMsg('通关！得分 +5','nm-win');
  showOverlay('nm-win','完成！','得分 +5  总分 '+score);
}

function lose(){
  gameOver=true;
  updateMsg('步数用尽，游戏结束','nm-lose');
  showOverlay('nm-lose','失败','总分 '+score);
}

function showOverlay(cls,title,sub){
  var ov=document.createElement('div');
  ov.className='nm-overlay';
  var t=document.createElement('div');t.className='nm-overlay-title '+cls;t.textContent=title;
  var s=document.createElement('div');s.className='nm-overlay-sub';s.textContent=sub;
  var b=document.createElement('button');b.className='nm-btn';b.textContent='🔄 再来一局';
  b.addEventListener('click',function(){ov.remove();newGame();});
  ov.appendChild(t);ov.appendChild(s);ov.appendChild(b);
  container.appendChild(ov);
}

function newGame(){
  score=0;level=1;steps=0;gameOver=false;
  genLevel();
  updateMsg('从起点开始，按 1,2,3... 顺序走','nm-info');
}

function init(){
  container.innerHTML='';
  var wrap=document.createElement('div');wrap.className='nm-wrap';
  var h=document.createElement('div');h.className='nm-header';
  var title=document.createElement('div');title.className='nm-title';title.textContent='数字迷宫';
  var stats=document.createElement('div');stats.className='nm-stats';
  stats.innerHTML='<span>关卡 <b class="nm-stat-val" id="nm-level">1</b></span><span>得分 <b class="nm-stat-val" id="nm-score">0</b></span><span>步数 <b class="nm-stat-val" id="nm-steps">0/0</b></span>';
  h.appendChild(title);h.appendChild(stats);
  gridEl=document.createElement('div');gridEl.className='nm-grid';
  msgEl=document.createElement('div');msgEl.className='nm-msg nm-info';
  var footer=document.createElement('div');footer.className='nm-footer';
  var hint=document.createElement('div');hint.className='nm-hint';hint.textContent='点击相邻格子，按数字顺序前进';
  var btn=document.createElement('button');btn.className='nm-btn';btn.textContent='🔄 重来';
  btn.addEventListener('click',function(){newGame();});
  footer.appendChild(hint);footer.appendChild(btn);
  wrap.appendChild(h);wrap.appendChild(gridEl);wrap.appendChild(msgEl);wrap.appendChild(footer);
  container.appendChild(wrap);
  scoreEl=container.querySelector('#nm-score');
  stepsEl=container.querySelector('#nm-steps');
  levelEl=container.querySelector('#nm-level');
  newGame();
}
init();
}