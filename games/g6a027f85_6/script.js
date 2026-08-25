function init_g6a027f85_6(container) {
function(container){
  var colors=['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444'];
  var colorNames=['紫色','青色','绿色','金色','红色'];
  var score=0;
  var currentColorIndex=-1;
  var correctIndex=-1;
  var gameOver=false;
  var wordEl, optionsEl, scoreEl, msgEl, btnEl;
  function init(){
    container.innerHTML='<div class="cm-card"><h2 class="cm-title">颜色匹配</h2><div class="cm-score">得分: <span id="cm-score">0</span></div><div class="cm-word" id="cm-word">紫色</div><div class="cm-options" id="cm-options"></div><button class="cm-btn" id="cm-restart">重新开始</button><div class="cm-msg" id="cm-msg"></div></div>';
    wordEl=container.querySelector('#cm-word');
    optionsEl=container.querySelector('#cm-options');
    scoreEl=container.querySelector('#cm-score');
    msgEl=container.querySelector('#cm-msg');
    btnEl=container.querySelector('#cm-restart');
    btnEl.addEventListener('click',restart);
    restart();
    document.addEventListener('keydown',keyHandler);
  }
  function restart(){
    score=0;
    gameOver=false;
    updateScore();
    msgEl.textContent='';
    msgEl.className='cm-msg';
    newRound();
  }
  function newRound(){
    if(gameOver) return;
    // 随机选择显示的颜色名称（文字），但文字颜色随机选一个，文字内容随机选另一个，保证至少有2种不同？为了好玩，可能相同，但概率低。
    currentColorIndex=Math.floor(Math.random()*colors.length);
    var textIndex=Math.floor(Math.random()*colors.length);
    // 确保文字颜色和文字内容不同？不一定，可能相同，但可以接受。
    var textColor=colors[currentColorIndex];
    var textContent=colorNames[textIndex];
    wordEl.textContent=textContent;
    wordEl.style.color=textColor;
    // 生成4个选项，其中一个正确（匹配文字内容对应的颜色）
    var correctColorIndex=textIndex; // 需要点击的颜色是文字内容对应的颜色
    var options=[];
    // 确保4个选项包含正确颜色，且不重复
    options.push(correctColorIndex);
    while(options.length<4){
      var rand=Math.floor(Math.random()*colors.length);
      if(options.indexOf(rand)===-1) options.push(rand);
    }
    // 打乱顺序
    for(var i=options.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var temp=options[i];options[i]=options[j];options[j]=temp;
    }
    // 渲染选项
    optionsEl.innerHTML='';
    for(var k=0;k<options.length;k++){
      var idx=options[k];
      var btn=document.createElement('button');
      btn.className='cm-option';
      btn.style.backgroundColor=colors[idx];
      btn.textContent=colorNames[idx];
      btn.dataset.colorIndex=idx;
      btn.addEventListener('click',function(e){handleClick(e.currentTarget);});
      optionsEl.appendChild(btn);
    }
    // 禁用？不，每次点击后判断
  }
  function handleClick(btn){
    if(gameOver) return;
    var clickedIndex=parseInt(btn.dataset.colorIndex);
    var textContent=wordEl.textContent;
    var correctIdx=colorNames.indexOf(textContent); // 文字对应的颜色索引
    if(clickedIndex===correctIdx){
      // 正确
      score+=10;
      updateScore();
      msgEl.textContent='正确！+10分';
      msgEl.className='cm-msg cm-correct';
      // 添加庆祝动画
      wordEl.classList.add('cm-celebrate');
      setTimeout(function(){wordEl.classList.remove('cm-celebrate');},500);
      // 下一轮
      setTimeout(newRound,400);
    }else{
      // 错误
      gameOver=true;
      msgEl.textContent='游戏结束！最终得分：'+score+' 分';
      msgEl.className='cm-msg cm-wrong';
      // 禁用所有选项
      var buttons=optionsEl.querySelectorAll('.cm-option');
      for(var i=0;i<buttons.length;i++){
        buttons[i].disabled=true;
      }
    }
  }
  function updateScore(){
    scoreEl.textContent=score;
  }
  function keyHandler(e){
    if(gameOver) return;
    var key=parseInt(e.key);
    if(key>=1 && key<=4){
      var buttons=optionsEl.querySelectorAll('.cm-option');
      if(buttons.length>=key){
        handleClick(buttons[key-1]);
      }
    }
  }
  init();
}
}