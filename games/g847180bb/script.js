function init_g847180bb(container) {
const COLS=4, ROWS=4, TOTAL=COLS*ROWS;
let numbers=[], selected=[], currentStep=0, score=0, timeLeft=60, timer=null, gameActive=false;
const container=document.querySelector('.nm-wrap');
const boardEl=container.querySelector('.nm-board');
const scoreEl=container.querySelector('.nm-score');
const timeEl=container.querySelector('.nm-time');
const msgEl=container.querySelector('.nm-msg');
const restartBtn=container.querySelector('.nm-restart');
const newGameBtn=container.querySelector('.nm-new');

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function generateNumbers(){
  const base=[];
  for(let i=1;i<=TOTAL;i++) base.push(i);
  return shuffle(base);
}

function renderBoard(){
  boardEl.innerHTML='';
  for(let i=0;i<TOTAL;i++){
    const cell=document.createElement('div');
    cell.className='nm-cell';
    cell.dataset.index=i;
    if(numbers[i]===null || numbers[i]===undefined){
      cell.classList.add('empty');
    }else{
      cell.textContent=numbers[i];
    }
    cell.addEventListener('click',()=>handleCellClick(i));
    boardEl.appendChild(cell);
  }
  updateHighlights();
}

function updateHighlights(){
  const cells=boardEl.querySelectorAll('.nm-cell');
  cells.forEach((cell,i)=>{
    cell.classList.remove('selected','path','visited');
    if(selected.includes(i)){
      cell.classList.add('selected');
    }else if(numbers[i]!==null && numbers[i]!==undefined && numbers[i]<currentStep+1){
      cell.classList.add('visited');
    }
  });
}

function handleCellClick(index){
  if(!gameActive) return;
  if(numbers[index]===null || numbers[index]===undefined) return;
  if(selected.includes(index)) return;
  const num=numbers[index];
  if(num===currentStep+1){
    selected.push(index);
    currentStep++;
    score+=10;
    updateScore();
    updateHighlights();
    if(currentStep===TOTAL){
      endGame(true);
    }
  }else{
    score=Math.max(0,score-5);
    updateScore();
    msgEl.textContent='顺序错误！-5分';
    msgEl.className='nm-msg lose';
    setTimeout(()=>{
      if(gameActive && msgEl.classList.contains('lose')){
        msgEl.textContent='';
        msgEl.className='nm-msg';
      }
    },800);
  }
}

function updateScore(){ scoreEl.textContent=score; }

function updateTime(){
  timeEl.textContent=timeLeft;
}

function startTimer(){
  if(timer){ clearInterval(timer); timer=null; }
  timer=setInterval(()=>{
    if(!gameActive) return;
    timeLeft--;
    updateTime();
    if(timeLeft<=0){
      endGame(false);
    }
  },1000);
}

function endGame(win){
  if(!gameActive) return;
  gameActive=false;
  if(timer){ clearInterval(timer); timer=null; }
  if(win){
    msgEl.textContent='🎉 恭喜通关！得分：'+score;
    msgEl.className='nm-msg win';
  }else{
    msgEl.textContent='⏰ 时间到！得分：'+score;
    msgEl.className='nm-msg lose';
  }
}

function newGame(){
  if(timer){ clearInterval(timer); timer=null; }
  numbers=generateNumbers();
  selected=[];
  currentStep=0;
  score=0;
  timeLeft=60;
  gameActive=true;
  msgEl.textContent='';
  msgEl.className='nm-msg';
  updateScore();
  updateTime();
  renderBoard();
  startTimer();
}

restartBtn.addEventListener('click',newGame);
newGameBtn.addEventListener('click',newGame);
newGame();
}