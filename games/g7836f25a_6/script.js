function init_g7836f25a_6(container) {
const size=4;let grid=[],score=0,best=0,over=false,won=false;
const scoreEl=container.querySelector('.m24-score-cur');
const bestEl=container.querySelector('.m24-score-best');
const gridEl=container.querySelector('.m24-grid');
const overEl=container.querySelector('.m24-over');
const overTitle=overEl.querySelector('h3');
const overMsg=overEl.querySelector('p');
try{best=parseInt(localStorage.getItem('m24best')||'0',10)||0}catch(e){best=0}
function emptyGrid(){return Array.from({length:size},()=>Array(size).fill(0))}
function addRandom(){const cells=[];for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(grid[r][c]===0)cells.push([r,c]);if(!cells.length)return false;const[r,c]=cells[Math.floor(Math.random()*cells.length)];grid[r][c]=Math.random()<0.9?2:4;return true}
function render(newPos,mergePos){gridEl.innerHTML='';for(let r=0;r<size;r++){for(let c=0;c<size;c++){const v=grid[r][c];const d=document.createElement('div');d.className='m24-cell';if(v){d.classList.add('m24-t'+v);d.textContent=v;if(newPos&&newPos.some(p=>p[0]===r&&p[1]===c))d.classList.add('m24-new');if(mergePos&&mergePos.some(p=>p[0]===r&&p[1]===c))d.classList.add('m24-merge')}gridEl.appendChild(d)}}scoreEl.textContent=score;if(score>best){best=score;try{localStorage.setItem('m24best',String(best))}catch(e){}}bestEl.textContent=best}
function slide(row){let arr=row.filter(v=>v!==0);let merged=false;const out=[];for(let i=0;i<arr.length;i++){if(i<arr.length-1&&arr[i]===arr[i+1]){out.push(arr[i]*2);score+=arr[i]*2;if(arr[i]*2===2048)won=true;merged=true;i++}else out.push(arr[i])}while(out.length<size)out.push(0);return{row:out,merged}}
function move(dir){if(over)return;const before=JSON.stringify(grid);const mergePos=[];const newGrid=emptyGrid();if(dir==='left'||dir==='right'){for(let r=0;r<size;r++){let line=grid[r].slice();if(dir==='right')line.reverse();const res=slide(line);let out=res.row;if(dir==='right')out.reverse();newGrid[r]=out;if(res.merged){for(let c=0;c<size;c++){if(dir==='left'&&c>0&&out[c]!==0&&out[c-1]===out[c]&&grid[r][c]!==0)mergePos.push([r,c]);if(dir==='right'&&c<size-1&&out[c]!==0&&out[c+1]===out[c]&&grid[r][c]!==0)mergePos.push([r,c])}}}}}else{for(let c=0;c<size;c++){let line=[];for(let r=0;r<size;r++)line.push(grid[r][c]);if(dir==='down')line.reverse();const res=slide(line);let out=res.row;if(dir==='down')out.reverse();for(let r=0;r<size;r++)newGrid[r][c]=out[r];if(res.merged){for(let r=0;r<size;r++){if(dir==='up'&&r>0&&out[r]!==0&&out[r-1]===out[r]&&grid[r][c]!==0)mergePos.push([r,c]);if(dir==='down'&&r<size-1&&out[r]!==0&&out[r+1]===out[r]&&grid[r][c]!==0)mergePos.push([r,c])}}}}}grid=newGrid;if(JSON.stringify(grid)!==before){const nr=addRandom();const newPos=[];for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(grid[r][c]!==0&&JSON.parse(before)[r][c]===0)newPos.push([r,c]);render(newPos,mergePos);checkEnd()}}
function canMove(){for(let r=0;r<size;r++)for(let c=0;c<size;c++){if(grid[r][c]===0)return true;if(c<size-1&&grid[r][c]===grid[r][c+1])return true;if(r<size-1&&grid[r][c]===grid[r+1][c])return true}return false}
function checkEnd(){if(won){over=true;overTitle.textContent='达成 2048!';overMsg.textContent='分数 '+score+' · 继续挑战更高分';showOver();won=false;return}if(!canMove()){over=true;overTitle.textContent='游戏结束';overMsg.textContent='最终分数 '+score+' · 点击重新开始';showOver()}}
function showOver(){overEl.classList.add('m24-show')}
function hideOver(){overEl.classList.remove('m24-show')}
function restart(){grid=emptyGrid();score=0;over=false;won=false;addRandom();addRandom();render([],[]);hideOver()}
function onKey(e){const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down',A:'left',D:'right',W:'up',S:'down'};const dir=map[e.key];if(dir){e.preventDefault();move(dir)}}
let touchStart=null;
function onTouchStart(e){if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}}
function onTouchEnd(e){if(!touchStart)return;const t=e.changedTouches[0];const dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;if(Math.abs(dx)<24&&Math.abs(dy)<24)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');touchStart=null}
container.querySelector('.m24-restart').addEventListener('click',restart);
overEl.querySelector('.m24-btn').addEventListener('click',restart);
container.querySelector('.m24-board').addEventListener('touchstart',onTouchStart,{passive:true});
container.querySelector('.m24-board').addEventListener('touchend',onTouchEnd,{passive:true});
container.addEventListener('keydown',onKey);
container.tabIndex=0;
restart()
}