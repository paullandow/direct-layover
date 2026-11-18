{
 const root=document.getElementById('dl-screen');
 const trigger=root.querySelector('.beat-details');
 const copy=root.querySelector('.beat-copy');
 const privateProject=root.querySelector('.private-project');
 const canvas=root.querySelector('.beat-letters');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 let animated=[];
 let hiding,returning=false;
 const invite=root.querySelector('.beat-invite');
 const note=root.querySelector('.beat-invite-note');
 invite.onclick=()=>{
  if(copy.classList.contains('assembling') || returning)return;
  stop();
  note.hidden=false;
  invite.setAttribute('aria-expanded','true');
  if(!motion.matches)assemble([note],true);
 };
 async function closeDetails(event){
  if(copy.hidden)return;
  event.stopImmediatePropagation();
  if(returning)return;
  returning=true;
  hiding?.cancel();
  privateProject.hidden=true;
  if(!motion.matches){
   const fade=node=>node.animate([{opacity:1},{opacity:0}],{duration:760,fill:'both'}).finished;
   await Promise.all([fade(copy),fade(canvas)]);
  }
  copy.hidden=true;
  stop();
  for(const node of [copy,canvas,privateProject])node.getAnimations().forEach(animation=>animation.cancel());
  privateProject.hidden=false;
  privateProject.contentWindow.postMessage('play-private-label',location.origin);
  if(!motion.matches){
   privateProject.animate([{opacity:0},{opacity:1}],{duration:980,easing:'ease-in-out'});
  }
  note.hidden=true;
  invite.setAttribute('aria-expanded','false');
  returning=false;
  trigger.focus({preventScroll:true});
 }
 root.querySelector('.return').addEventListener('click',closeDetails,true);
 root.addEventListener('keydown',event=>{if(event.key==='Escape')void closeDetails(event);},true);
 function stop(){
  cancelAnimationFrame(frame);
  canvas.hidden=true;
  copy.classList.remove('assembling');
  animated.forEach(element=>element.classList.remove('letter-assembling'));
  animated=[];
 }
 new MutationObserver(()=>{if(copy.hidden) stop();}).observe(copy,{attributes:true,attributeFilter:['hidden']});
 trigger.addEventListener('click',event=>{
  if(!copy.hidden){void closeDetails(event);return;}
  hiding?.cancel();
  if(!privateProject.hidden&&!motion.matches){
   hiding=privateProject.animate([{opacity:1},{opacity:0}],{duration:1050,fill:'forwards'});
   hiding.finished.then(()=>{privateProject.hidden=true;hiding.cancel();}).catch(()=>{});
  }else privateProject.hidden=true;
  copy.hidden=false;
  trigger.setAttribute('aria-expanded','true');
  if(motion.matches)return;
  assemble([...copy.querySelectorAll('p'),invite]);
 });
 function assemble(elements,fast=false){
  const bounds=root.getBoundingClientRect();
  const ctx=canvas.getContext('2d');
  const ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.ceil(bounds.width*ratio);
  canvas.height=Math.ceil(bounds.height*ratio);
  ctx.scale(ratio,ratio);
  ctx.fillStyle='#fff';
  ctx.textBaseline='alphabetic';
  const letters=[];
  const edgeOffset=Math.floor(Math.random()*4);
  const range=document.createRange();
  const total=fast?(4200+Math.random()*1300)/3:4200+Math.random()*1300;
  for(const paragraph of elements){
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
    const side=(letters.length+edgeOffset)%4;
    const extra=18+Math.random()*90;
    const startX=side===0?-extra:side===1?bounds.width+extra:Math.random()*bounds.width;
    const startY=side===2?-extra:side===3?bounds.height+extra:Math.random()*bounds.height;
    const duration=total*(fast?(.50+Math.random()*.48):(.85+Math.random()*.13));
    letters.push({char,font,x,y,dx:startX-x,dy:startY-y,delay:Math.random()*(total-duration),duration});
   }
  }
  animated=elements;
  if(elements.includes(invite))copy.classList.add('assembling');
  elements.forEach(element=>element.classList.add('letter-assembling'));
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
 }
 new MutationObserver(()=>{
  if(copy.hidden)trigger.setAttribute('aria-expanded','false');
 }).observe(copy,{attributes:true,attributeFilter:['hidden']});
}





