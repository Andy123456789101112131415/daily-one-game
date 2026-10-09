function init_gdde7cd56_4(container) {
var N=5,TARGET=0,size=0,cur={r:0,c:0},path=[],done=false,best=null,started=false,moves=0;
var board=container.querySelector('.nm-board');
var msg=container.querySelector('.nm-msg');
var stepsEl=container.querySelector('.nm-steps');
var scoreEl=container.querySelector('.nm-score');
var bestEl=container.querySelector('.nm-best');
var toast=container.querySelector('.nm-toast');
var cells=[];
var toastTimer=null;
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function showToast(text){if(!toast)return;toast.textContent=text;toast.classList.add('nm-show');if(toastTimer)clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove('nm-show');},1600);}
function setMsg(text,cls){if(!msg)return;msg.textContent=text;}
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
for(i=0;i<size;i++){var pt=path[i];if(!pt)continue;var cd=cells[pt.r][pt.c];if(!cd)continue;cd.textContent=i+1;cd.classList.add(i===0?'nm-start':(i===size-1?'nm-goal':'nm-path'));if(pt.r===cur.r&&pt.c===cur.c&&!done)cd.classList.add('nm-cur');}
if(done){for(i=0;i<size;i++){var p2=path[i];if(!p2)continue;var c2=cells[p2.r][p2.c];if(c2)c2.classList.add('nm-done');}}
if(bestEl)bestEl.textContent=best===null?'-':best;}
function onClick(e){if(done)return;var t=e.target;if(!t||!t.classList||!t.classList.contains('nm-cell'))return;var r=parseInt(t.dataset.r,10),c=parseInt(t.dataset.c,10);if(isNaN(r)||isNaN(c))return;
var next=path.length;if(next>=size)return;var want=path[next];if(!want)return;
if(r===want.r&&c===want.c){path.push({r:r,c:c});cur={r:r,c:c};moves++;started=true;stepsEl.textContent=String(moves);scoreEl.textContent=String(path.length-1);
if(path.length===size){done=true;var sc=Math.max(10,100-moves*5);scoreEl.textContent=String(sc);if(best===null||sc>best)best=sc;if(bestEl)bestEl.textContent=String(best);setMsg('完成！得分 '+sc,'');showToast('🎉 完成！得分 '+sc);}
else{setMsg('很好，继续点击 '+path.length+' → '+TARGET,'');}
render();}
else{t.classList.add('nm-wrong');setTimeout(function(){t.classList.remove('nm-wrong');},300);showToast('顺序错误，请点击 '+path.length+' → '+TARGET);}}
function reset(){newGame();showToast('已重新开始');}
build();newGame();
var resetBtn=container.querySelector('.nm-reset');
if(resetBtn)resetBtn.addEventListener('click',reset);
var newBtn=container.querySelector('.nm-new');
if(newBtn)newBtn.addEventListener('click',reset);
if(typeof window!=='undefined'){window.addEventListener('keydown',function(e){if(e.key==='r'||e.key==='R'){reset();}});}
}