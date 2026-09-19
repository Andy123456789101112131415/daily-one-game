function init_gdde7cd56_2(container) {
var size=5;var grid=[];var pos={r:0,c:0};var targetVal=0;var score=0;var steps=0;var maxSteps=0;var gameOver=false;var gridEl=null;var msgEl=null;var scoreEl=null;var stepsEl=null;var levelEl=null;var level=1;var overlayEl=null;

function rnd(n){return Math.floor(Math.random()*n)}

function getNeighbors(r,c){
  var res=[];
  if(r>0)res.push({r:r-1,c:c});
  if(r<size-1)res.push({r:r+1,c:c});
  if(c>0)res.push({r:r,c:c-1});
  if(c<size-1)res.push({r:r,c:c+1});
  return res;
}

function genLevel(){
  level=1+Math.floor(score/3);
  size=4+Math.min(level,3);
  gameOver=false;steps=0;
  maxSteps=size*size;
  grid=[];
  var total=size*size;
  var nums=[];
  for(var i=1;i<=total;i++)nums.push(i);
  for(var i=nums.length-1;i>0;i--){var j=rnd(i+1);var t=nums[i];nums[i]=nums[j];nums[j]=t;}
  var idx=0;
  for(var r=0;r<size;r++){grid[r]=[];for(var c=0;c<size;c++){grid[r][c]=nums[idx++];}}
  var startIdx=rnd(total);
  pos.r=Math.floor(startIdx/size);pos.c=startIdx%size;
  var neighbors=getNeighbors(pos.r,pos.c);
  var n1=neighbors[rnd(neighbors.length)];
  grid[n1.r][n1.c]=1;
  grid[pos.r][pos.c]=2;
  targetVal=2;
  if(overlayEl){overlayEl.parentNode.removeChild(overlayEl);overlayEl=null;}
  updateMsg('从 2 开始，按顺序点击相邻数字','nm-info');
  render();
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
  if(r<0||r>=size||c<0||c>=size)return;
  var dr=Math.abs(r-pos.r);var dc=Math.abs(c-pos.c);
  if(dr+dc!==1)return;
  var v=grid[r][c];
  if(v===targetVal+1){
    pos.r=r;pos.c=c;targetVal=v;steps++;score+=1;
    if(targetVal===size*size){win();return;}
    render();
    updateMsg('很好！继续寻找 '+(targetVal+1),'nm-info');
  }else if(v<=targetVal){
    pos.r=r;pos.c=c;steps++;render();
    updateMsg('已访问的数字，继续寻找 '+(targetVal+1),'nm-info');
    if(steps>=maxSteps){lose();return;}
  }else{
    steps++;render();
    updateMsg('不能跳到 '+v+'，需要 '+(targetVal+1),'nm-lose');
    if(steps>=maxSteps){lose();return;}
  }
}

function updateMsg(text,cls){
  if(!msgEl)return;
  msgEl.textContent=text;
  msgEl.className='nm-msg '+(cls||'');
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

function showOverlay(cls,title,desc){
  if(overlayEl){overlayEl.parentNode.removeChild(overlayEl);overlayEl=null;}
  overlayEl=document.createElement('div');
  overlayEl.className='nm-overlay';
  var h=document.createElement('h2');h.textContent=title;
  var p=document.createElement('p');p.textContent=desc;
  var btn=document.createElement('button');btn.className='nm-btn';btn.textContent='🔄 重来';
  btn.addEventListener('click',function(){genLevel();});
  overlayEl.appendChild(h);overlayEl.appendChild(p);overlayEl.appendChild(btn);
  document.querySelector('.nm-wrap').appendChild(overlayEl);
}

function resetGame(){
  score=0;level=1;genLevel();
}

function init(){
  gridEl=document.getElementById('nm-grid');
  msgEl=document.getElementById('nm-msg');
  scoreEl=document.getElementById('nm-score');
  stepsEl=document.getElementById('nm-steps');
  levelEl=document.getElementById('nm-level');
  var resetBtn=document.getElementById('nm-reset');
  if(resetBtn)resetBtn.addEventListener('click',resetGame);
  genLevel();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
}