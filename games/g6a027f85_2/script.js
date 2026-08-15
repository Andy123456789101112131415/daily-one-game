function init_g6a027f85_2(container) {
function(container){
  // 游戏状态
  let score=0;
  let targetColor='';
  let colorOptions=[];
  let gameActive=true;
  let correctIndex=-1;
  
  // 颜色池（鲜艳且易于区分）
  const colors=['#ef4444','#f59e0b','#10b981','#06b6d4','#7c3aed','#ec4899','#f97316','#84cc16','#14b8a6','#6366f1'];
  
  // DOM 引用（在container内查找，避免全局id冲突）
  const targetEl=container.querySelector('.cm-target-color');
  const optionsEl=container.querySelector('.cm-options');
  const scoreEl=container.querySelector('.cm-score');
  const msgEl=container.querySelector('.cm-msg');
  const btn=container.querySelector('.cm-btn');
  
  // 初始化游戏
  function init(){
    score=0;
    gameActive=true;
    scoreEl.textContent='得分: 0';
    msgEl.textContent='';
    btn.style.display='none';
    newRound();
  }
  
  // 新一局
  function newRound(){
    // 从颜色池中随机选3个不同颜色作为选项
    const shuffled=[...colors].sort(()=>Math.random()-0.5);
    colorOptions=shuffled.slice(0,3);
    // 随机选一个作为目标（确保正确索引）
    correctIndex=Math.floor(Math.random()*3);
    targetColor=colorOptions[correctIndex];
    
    // 渲染目标色块
    targetEl.style.backgroundColor=targetColor;
    
    // 渲染选项
    optionsEl.innerHTML='';
    colorOptions.forEach((color,index)=>{
      const opt=document.createElement('div');
      opt.className='cm-option';
      opt.style.backgroundColor=color;
      opt.dataset.index=index;
      opt.addEventListener('click',()=>handleClick(index,opt));
      optionsEl.appendChild(opt);
    });
  }
  
  // 处理点击
  function handleClick(index,el){
    if(!gameActive) return;
    if(index===correctIndex){
      // 正确
      score++;
      scoreEl.textContent='得分: '+score;
      msgEl.textContent='✓ 正确!';
      msgEl.style.color='#10b981';
      optionsEl.querySelectorAll('.cm-option').forEach(o=>o.removeEventListener('click',handleClick)); // 防止重复点击？实际是解绑所有，但简单起见用gameActive控制
      // 庆祝动画
      el.classList.add('cm-celebrate');
      el.addEventListener('animationend',()=>{
        el.classList.remove('cm-celebrate');
        newRound();
      },{once:true});
    }else{
      // 错误
      gameActive=false;
      msgEl.textContent='✗ 错误，游戏结束!';
      msgEl.style.color='#ef4444';
      el.classList.add('cm-fail');
      optionsEl.querySelectorAll('.cm-option').forEach(o=>o.style.pointerEvents='none');
      btn.style.display='block';
    }
  }
  
  // 重来按钮
  btn.addEventListener('click',init);
  
  // 初始化
  init();
}
}