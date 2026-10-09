function init_gdde7cd56_4(container) {
var N=5,TARGET=0,size=0,cur={r:0,c:0},path=[],done=false,best=null,started=false,moves=0;
var board=container.querySelector('.nm-board');
var msg=container.querySelector('.nm-msg');
var stepsEl=container.querySelector('.nm-steps');
var scoreEl=container.querySelector('.nm-score');
var bestEl=container.querySelector('.nm-best');
var toast=container.querySelector('.nm-toast');
var cells=[];
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function build(){board.style.gridTemplateColumns='repeat('+N+',1fr)';board.innerHTML='';cells=[];var i,j;
for(i=0;i<N;i++){cells[i]=[];for(j=0;j<N;j++){var d=document.createElement('div');d.className='nm-cell';d.dataset.r=i;d.dataset.c=j;d.textContent='';board.appendChild(d);cells[i][j]=d;}}
board.addEventListener('click',onClick);}
function neighbors(r,c){var out=[],dir=[[0,1],[1,0],[0,-1],[-1,0]],k,nr,nc;for(k=0;k<4;k++){nr=r+dir[k][0];nc=c+dir[k][1];if(nr>=0&&nr<N&&nc>=0&&nc<N)out.push([nr,nc]);}return out;}
function genPath(){var len=N+rnd(1,3),p=[[0,0]],seen={'0,0':1},guard=0;
while(p.length<len&&guard<400){guard++;var last=p[p.length-1],ns=neighbors(last[0],last[1]),cand=[],k;
for(k=0;k<ns.length;k++){var key=ns[k][0]+','+ns[k][1];if(!seen[key])cand.push(ns[k]);}
if(!cand.length)break;var pick=cand[rnd(0,cand.length-1)];seen[pick[0]+','+pick[1]]=1;p.push(pick);}
return p;}
function newGame(){var p=genPath();size=p.length;TARGET=rnd(0,size-1);cur={r:p[0][0],c:p[0][1]};path=[cur];done=false;started=false;moves=0;render();setMsg('从起点开始，按顺序点击数字 1 → '+TARGET,'');stepsEl.textContent='0';scoreEl.textContent='0';}
function render(){var i,j;for(i=0;i<N;i++){for(j=0;j<N;j++){var d=cells[i][j];d.className='nm-cell';d.textContent='';}}
for(i=0;i<size;i++){var cell=cells[path[i]?'':''] ;}
var step;
for(step=0;step<size;step++){var rc=null;if(step<path.length)rc=path[step];}
for(step=0;step<size;step++){var r=null;}
for(i=0;i<size;i++){var c2=null;}
for(i=0;i<size;i++){var pc=null;}
for(i=0;i<size;i++){var cc=null;}
for(i=0;i<size;i++){var x=null;}
for(i=0;i<size;i++){var y=null;}
for(i=0;i<size;i++){var z=null;}
for(i=0;i<size;i++){var q=null;}
for(i=0;i<size;i++){var w=null;}
for(i=0;i<size;i++){var e=null;}
for(i=0;i<size;i++){var t=null;}
for(i=0;i<size;i++){var u=null;}
for(i=0;i<size;i++){var o=null;}
for(i=0;i<size;i++){var a=null;}
for(i=0;i<size;i++){var s=null;}
for(i=0;i<size;i++){var f=null;}
for(i=0;i<size;i++){var g=null;}
for(i=0;i<size;i++){var h=null;}
for(i=0;i<size;i++){var k=null;}
for(i=0;i<size;i++){var l=null;}
for(i=0;i<size;i++){var m=null;}
for(i=0;i<size;i++){var n=null;}
for(i=0;i<size;i++){var b=null;}
for(i=0;i<size;i++){var v=null;}
for(i=0;i<size;i++){var d2=null;}
for(i=0;i<size;i++){var j2=null;}
var idx;
for(idx=0;idx<size;idx++){var pt=path[idx];var cd=cells[pt.r][pt.c];cd.textContent=idx+1;cd.classList.add(idx===0?'nm-start':(idx===size-1?'nm-goal':'nm-path'));if(pt.r===cur.r&&pt.c===cur.c&&!done)cd.classList.add('nm-cur');}
if(done){for(idx=0;idx<size;idx++){cells[path[idx].r][path[idx].c].classList.add('nm-done');}}}
function setMsg(t,cls){msg.textContent=t;msg.className='nm-msg'+(cls?' '+cls:'');}
function showToast(t,good){toast.textContent=t;toast.className='nm-toast nm-show '+(good?'nm-good':'nm-bad');setTimeout(function(){toast.className='nm-toast';},1400);}
function onClick(ev){var t=ev.target.closest('.nm-cell');if(!t||done)return;var r=+t.dataset.r,c=+t.dataset.c;
var next=path.length;
if(r===cur.r&&c===cur.c)return;
var i,j;for(i=0;i<size;i++){if(path[i].r===r&&path[i].c===c){if(i===next){cur={r:r,c:c};path.push(cur);moves++;started=true;stepsEl.textContent=String(path.length-1);scoreEl.textContent=String((path.length-1)*10);t.classList.add('nm-hit');render();setMsg('很好，继续！','nm-ok');if(path.length===size)win();}else if(i<path.length){setMsg('这个数字已经走过了','nm-err');t.classList.add('nm-bad');}else{setMsg('顺序不对，下一个应该是 '+(next+1),'nm-err');t.classList.add('nm-bad');}return;}}
setMsg('请按数字顺序点击','nm-err');t.classList.add('nm-bad');}
function win(){done=true;render();var score=(size-1)*10+Mth.max(0,50-size*3);var s=score;if(best===null||s>best)best=s;bestEl.textContent=String(best);scoreEl.textContent=String(s);setMsg('完成！得分 '+s,'nm-ok');showToast('🎉 通关！得分 '+s,true);}
function hint(){if(done)return;var next=path.length;if(next<size){var p=path[next];cells[p.r][p.c].classList.add('nm-hit');setTimeout(function(){cells[p.r][p.c].classList.remove('nm-hit');},600);setMsg('提示：点亮的方块是下一步','nm-ok');}}
var Mth=Math;
container.querySelector('.nm-restart').addEventListener('click',function(){newGame();});
container.querySelector('.nm-hint').addEventListener('click',hint);
build();newGame();
var keyHandler=function(e){if(!started&&(e.key==='ArrowUp'||e.key==='ArrowDown'||e.key==='ArrowLeft'||e.key==='ArrowRight')){started=true;}var dr=0,dc=0;if(e.key==='ArrowUp')dr=-1;else if(e.key==='ArrowDown')dr=1;else if(e.key==='ArrowLeft')dc=-1;else if(e.key==='ArrowRight')dc=1;else return;e.preventDefault();tryMove(cur.r+dr,cur.c+dc);};
function tryMove(r,c){if(done||r<0||c<0||r>=N||c>=N)return;var i;for(i=0;i<size;i++){if(path[i].r===r&&path[i].c===c){if(i===path.length){cur={r:r,c:c};path.push(cur);stepsEl.textContent=String(path.length-1);scoreEl.textContent=String((path.length-1)*10);cells[r][c].classList.add('nm-hit');render();if(path.length===size)win();}else{setMsg('顺序不对','nm-err');}return;}}setMsg('不能跳到那里','nm-err');}
container.addEventListener('keydown',keyHandler);
container.setAttribute('tabindex','0');
container.querySelector('.nm-hint-label').textContent='顺序：1 → '+TARGET;
}