{
 const root=document.getElementById('dl-screen');
 const trigger=root.querySelector('.beat-details');
 const copy=root.querySelector('.beat-copy');
 const privateProject=root.querySelector('.private-project');
 const canvas=root.querySelector('.beat-letters');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 let hiding;
 function stop(){
  cancelAnimationFrame(frame);
  canvas.hidden=true;
  copy.classList.remove('assembling');
 }
 new MutationObserver(()=>{if(copy.hidden) stop();}).observe(copy,{attributes:true,attributeFilter:['hidden']});
 trigger.addEventListener('click',()=>{
  if(!copy.hidden)return;
  hiding?.cancel();
  if(!privateProject.hidden&&!motion.matches){
   hiding=privateProject.animate([{opacity:1},{opacity:0}],{duration:350,fill:'forwards'});
   hiding.finished.then(()=>{privateProject.hidden=true;hiding.cancel();}).catch(()=>{});
  }else privateProject.hidden=true;
  copy.hidden=false;
  trigger.setAttribute('aria-expanded','true');
  if(motion.matches)return;
  const bounds=root.getBoundingClientRect();
  const ctx=canvas.getContext('2d');
  const ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.ceil(bounds.width*ratio);
  canvas.height=Math.ceil(bounds.height*ratio);
  ctx.scale(ratio,ratio);
  ctx.fillStyle='#fff';
  ctx.textBaseline='alphabetic';
  const letters=[];
  const range=document.createRange();
  const total=3000+Math.random()*1500;
  for(const paragraph of copy.querySelectorAll('p')){
   const node=paragraph.firstChild;
   const style=getComputedStyle(paragraph);
   const font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
   ctx.font=font;
   const metrics=ctx.measureText('Mg');
   for(let i=0;i<node.length;i++){
    const char=node.data[i];
    if(/\s/.test(char))continue;
    range.setStart(node,i);range.setEnd(node,i+1);
    const rect=range.getBoundingClientRect();
    const x=rect.left-bounds.left;
    const y=rect.top-bounds.top+(rect.height-metrics.fontBoundingBoxAscent-metrics.fontBoundingBoxDescent)/2+metrics.fontBoundingBoxAscent;
    const angle=Math.random()*Math.PI*2;
    const distance=(.25+Math.random()*.8)*Math.max(bounds.width,bounds.height);
    const duration=total*(.44+Math.random()*.53);
    letters.push({char,font,x,y,dx:Math.cos(angle)*distance,dy:Math.sin(angle)*distance,delay:Math.random()*(total-duration),duration});
   }
  }
  copy.classList.add('assembling');
  canvas.hidden=false;
  const started=performance.now();
  function draw(now){
   if(copy.hidden){stop();return;}
   const elapsed=now-started;
   if(elapsed>=total){stop();return;}
   ctx.clearRect(0,0,bounds.width,bounds.height);
   ctx.globalCompositeOperation='xor';
   for(const letter of letters){
    if(elapsed<letter.delay)continue;
    const progress=Math.min(1,(elapsed-letter.delay)/letter.duration);
    const remaining=(1-progress)**2.35;
    ctx.font=letter.font;
    ctx.fillText(letter.char,letter.x+letter.dx*remaining,letter.y+letter.dy*remaining);
   }
   frame=requestAnimationFrame(draw);
  }
  frame=requestAnimationFrame(draw);
 });
 new MutationObserver(()=>{
  if(copy.hidden)trigger.setAttribute('aria-expanded','false');
 }).observe(copy,{attributes:true,attributeFilter:['hidden']});
}
