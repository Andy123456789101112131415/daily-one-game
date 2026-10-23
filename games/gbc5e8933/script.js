function init_gbc5e8933(container) {
const N=4;
  const COLORS=['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444'];
  container.innerHTML='';
  const wrap=document.createElement('div');
  wrap.className='pz-wrap';
  const head=document.createElement('div');
  head.className='pz-head';
  const statMoves=document.createElement('div');
  statMoves.className='pz-stat';
  statMoves.innerHTML='<b>0</b><span>步数</span>';
  const statTime=document.createElement('div');
  statTime.className='pz-stat';
  statTime.innerHTML='<b>00:00</b><span>时间</span>';
  const statBest=document.createElement('div');
  statBest.className='pz-stat';
  statBest.innerHTML='<b>--</b><span>最佳</span>';
  const btnRestart=document.createElement('button');
  btnRestart.className='pz-btn pz-primary';
  btnRestart.textContent='重来';
  head.appendChild(statMoves);
  head.appendChild(statTime);
  head.appendChild(statBest);
  head.appendChild(btnRestart);
  wrap.appendChild(head);
  const board=document.createElement('div');
  board.className='pz-board';
  const grid=document.createElement('div');
  grid.className='pz-grid';
  board.appendChild(grid);
  const overlay=document.createElement('div');
  overlay.className='pz-overlay';
  overlay.innerHTML='<h2>完成！</h2><p class="pz-msg"></p>';
  const ovBtn=document.createElement('button');
  ovBtn.className='pz-btn pz-primary';
  ovBtn.textContent='再来一局';
  overlay.appendChild(ovBtn);
  board.appendChild(overlay);
  wrap.appendChild(board);
  const foot=document.createElement('div');
  foot.className='pz-foot';
  foot.textContent='点击空格旁的方块滑动，或用方向键移动。把 1–15 按顺序排好即获胜。';
  wrap.appendChild(foot);
  container.appendChild(wrap);
  const movesEl=statMoves.querySelector('b');
  const timeEl=statTime.querySelector('b');
  const bestEl=statBest.querySelector('b');
  const msgEl=overlay.querySelector('.pz-msg');
  let tiles=[];
  let empty=15;
  let moves=0;
  let timer=null;
  let seconds=0;
  let playing=false;
  let best=null;
  try{ const s=localStorage.getItem('pz_best_moves'); if(s) best=parseInt(s,10); }catch(e){ best=null; }
  if(best&&best>0){ bestEl.textContent=best; }
  function tileColor(v){ return COLORS[(v-1)%COLORS.length]; }
  function computeSize(){
    const w=Math.min(container.clientWidth||420,420)-32;
    const size=Math.max(200,Math.min(w,380));
    return size;
  }
  function layout(){
    const size=computeSize();
    const gap=6;
    const cell=(size-gap*(N-1))/N;
    grid.style.gridTemplateColumns='repeat('+N+','+cell+'px)';
    grid.style.gridTemplateRows='repeat('+N+','+cell+'px)';
    grid.style.gap=gap+'px';
    grid.style.width=size+'px';
    grid.style.height=size+'px';
    grid.querySelectorAll('.pz-tile').forEach(function(t){
      t.style.fontSize=Math.round(cell*0.34)+'px';
    });
  }
  function solved(){
    for(let i=0;i<15;i++){ if(tiles[i]!==i+1) return false; }
    return tiles[15]===0;
  }
  function fmt(s){
    const m=Math.floor(s/60);
    const ss=s%60;
    return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss;
  }
  function startTimer(){
    if(timer) return;
    timer=setInterval(function(){
      if(!playing) return;
      seconds++;
      timeEl.textContent=fmt(seconds);
    },1000);
  }
  function stopTimer(){ if(timer){ clearInterval(timer); timer=null; } }
  function render(){
    grid.innerHTML='';
    for(let i=0;i<16;i++){
      const v=tiles[i];
      const btn=document.createElement('button');
      btn.className='pz-tile'+(v===0?' pz-empty':'');
      btn.textContent=v===0?'':String(v);
      if(v!==0){
        btn.style.background=tileColor(v);
      }
      btn.dataset.idx=String(i);
      btn.addEventListener('click',function(){ onTileClick(i); });
      grid.appendChild(btn);
    }
    layout();
  }
  function isAdjacent(a,b){
    const ra=Math.floor(a/N), ca=a%N;
    const rb=Math.floor(b/N), cb=b%N;
    return (Math.abs(ra-rb)+Math.abs(ca-cb))===1;
  }
  function onTileClick(i){
    if(!playing) return;
    if(i===empty) return;
    if(!isAdjacent(i,empty)) return;
    swap(i,empty);
    empty=i;
    afterMove();
  }
  function swap(a,b){
    const t=tiles[a]; tiles[a]=tiles[b]; tiles[b]=t;
  }
  function afterMove(){
    moves++;
    movesEl.textContent=String(moves);
    render();
    if(solved()){
      playing=false;
      stopTimer();
      const done=document.createElement('div');
      done.className='pz-pop';
      grid.appendChild(done);
      msgEl.textContent='步数 '+moves+' · 用时 '+fmt(seconds);
      overlay.classList.add('pz-show');
      if(best===null||moves<best){
        best=moves;
        bestEl.textContent=String(best);
        try{ localStorage.setItem('pz_best_moves',String(best)); }catch(e){}
        msgEl.textContent+=' · 新纪录！';
      }
    }
  }
  function moveByDir(dr,dc){
    if(!playing) return;
    const er=Math.floor(empty/N), ec=empty%N;
    const tr=er+dr, tc=ec+dc;
    if(tr<0||tr>=N||tc<0||tc>=N) return;
    const target=tr*N+tc;
    swap(target,empty);
    empty=target;
    afterMove();
  }
  function keyHandler(e){
    const map={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1],w:[-1,0],s:[1,0],a:[0,-1],d:[0,1],W:[-1,0],S:[1,0],A:[0,-1],D:[0,1]};
    const m=map[e.key];
    if(!m) return;
    e.preventDefault();
    moveByDir(m[0],m[1]);
  }
  function shuffle(){
    tiles=[];
    for(let i=1;i<N*N;i++) tiles.push(i);
    tiles.push(0);
    empty=15;
    let last=-1;
    for(let k=0;k<400;k++){
      const er=Math.floor(empty/N), ec=empty%N;
      const cand=[];
      if(er>0) cand.push(empty-N);
      if(er<N-1) cand.push(empty+N);
      if(ec>0) cand.push(empty-1);
      if(ec<N-1) cand.push(empty+1);
      const pick=cand.filter(function(x){ return x!==last; });
      const src=pick.length?pick[Math.floor(Math.random()*pick.length)]:cand[Math.floor(Math.random()*cand.length)];
      swap(src,empty);
      last=empty;
      empty=src;
    }
    if(solved()) shuffle();
  }
  function newGame(){
    stopTimer();
    shuffle();
    moves=0;
    seconds=0;
    playing=true;
    movesEl.textContent='0';
    timeEl.textContent='00:00';
    overlay.classList.remove('pz-show');
    render();
    startTimer();
  }
  btnRestart.addEventListener('click',function(e){ e.stopPropagation(); newGame(); });
  ovBtn.addEventListener('click',function(e){ e.stopPropagation(); newGame(); });
  wrap.addEventListener('keydown',keyHandler);
  wrap.tabIndex=0;
  document.addEventListener('keydown',function(e){
    if(e.key&&(e.key.indexOf('Arrow')===0||'wasdWASD'.indexOf(e.key)>=0)){
      const active=document.activeElement;
      if(active&&(active.tagName==='INPUT'||active.tagName==='TEXTAREA')) return;
      keyHandler(e);
    }
  });
  let resizeTimer=null;
  window.addEventListener('resize',function(){
    if(resizeTimer) clearTimeout(resizeTimer);
    resizeTimer=setTimeout(layout,120);
  });
  newGame();
}