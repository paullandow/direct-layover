{

const stage=document.getElementById('dl-screen');
const dot=document.querySelector('.dot');
const letter=document.querySelector('.target-i');
const baseline=document.querySelector('.baseline');
let shot;
const oldDot=document.querySelector(".i-ball");
function aim(){
 const bounds=stage.getBoundingClientRect();
 const ball=dot.getBoundingClientRect();
 const glyph=letter.getBoundingClientRect();
 const radius=ball.width/2;
 const start={x:ball.left-bounds.left+radius,y:ball.top-bounds.top+radius};
 const style=getComputedStyle(letter);
 const sample=document.createElement('canvas');
 const size=parseFloat(style.fontSize);
 sample.width=Math.ceil(size*2);
 sample.height=Math.ceil(size*2);
 const ctx=sample.getContext('2d');
 ctx.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
 const inkBaseline=Math.ceil(size*1.25);
 ctx.fillText('i',0,inkBaseline);
 const {data}=ctx.getImageData(0,0,sample.width,sample.height);
 let x1=sample.width,x2=0,y1=sample.height,y2=0;
 for(let y=0;y<inkBaseline;y++){
  let row=false;
  for(let x=0;x<sample.width;x++){
   if(data[(y*sample.width+x)*4+3]<100) continue;
   row=true;
   x1=Math.min(x1,x); x2=Math.max(x2,x);
  }
  if(row){y1=Math.min(y1,y);y2=y;}
  else if(y2>0) break;
 }
 const target={
  x:glyph.left-bounds.left+(x1+x2)/2,
  y:baseline.getBoundingClientRect().top-bounds.top-inkBaseline+(y1+y2)/2
 };
 const dotRadius=(x2-x1+1)/2;
 const clipBottom=baseline.getBoundingClientRect().top-inkBaseline+y2+1;
 letter.style.clipPath='inset('+Math.max(0,clipBottom-glyph.top)+'px -2px -3px -2px)';
 oldDot.style.width=oldDot.style.height=2*dotRadius+'px';
 oldDot.style.left=(target.x-dotRadius)+'px';
 oldDot.style.top=(target.y-dotRadius)+'px';
 const width=bounds.width-2*radius,height=bounds.height-2*radius;
 const local={x:start.x-radius,y:start.y-radius};
 const goal={x:target.x-radius,y:target.y-radius};
 const candidates=[];
 for(let tx=-3;tx<=3;tx++)for(let ty=-3;ty<=3;ty++){
  if(tx===0&&ty===0)continue;
  const image={x:tx*width+(Math.abs(tx)%2?width-goal.x:goal.x),y:ty*height+(Math.abs(ty)%2?height-goal.y:goal.y)};
  const dx=image.x-local.x,dy=image.y-local.y;
  const hits=[];
  for(let k=-4;k<=4;k++){
   if(dx){const t=(k*width-local.x)/dx;if(t>0&&t<1)hits.push({t,axis:'x'});}
   if(dy){const t=(k*height-local.y)/dy;if(t>0&&t<1)hits.push({t,axis:'y'});}
  }
  hits.sort((a,b)=>a.t-b.t);
  if(hits.length<1||hits.length>4||hits.some((hit,i)=>i&&hit.t-hits[i-1].t<.015))continue;
  const fold=(value,span)=>{const phase=((value%(2*span))+2*span)%(2*span);return phase>span?2*span-phase:phase;};
  const banks=hits.map(hit=>({x:radius+fold(local.x+dx*hit.t,width),y:radius+fold(local.y+dy*hit.t,height)}));
  candidates.push({banks,angle:Math.atan2(dy,dx)});
 }
 const route=candidates[Math.floor(Math.random()*candidates.length)];
 const bank=route.banks.at(-1);
 const distance=Math.hypot(target.x-bank.x,target.y-bank.y);
 const direction={x:(target.x-bank.x)/distance,y:(target.y-bank.y)/distance};
 const impact={x:target.x-direction.x*(radius+dotRadius),y:target.y-direction.y*(radius+dotRadius)};
 dot.style.setProperty('--cue-angle',route.angle+'rad');
 shot={start,target,bank,banks:route.banks,impact,direction,radius,dotRadius};

}
const moving=document.querySelector('.ball');
const cue=document.querySelector('.cue');
const sounds=['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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xTE6oPEEDsXDCRlaAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=','SUQzBAAAAAAAf1RYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAG1wNDFpc29tAFRTU0UAAAAOAAADTGF2ZjYzLjEuMTAyAAAAAAAAAAAAAAD/+1TAAAAAAAAAAAAAAAAAAAAAAABYaW5nAAAADwAAAAYAAAhwACIiIiIiIiIiIiIiIiIiIiJxcXFxcXFxcXFxcXFxcXFxcba2tra2tra2tra2tra2trbY2NjY2NjY2NjY2NjY2NjY2PT09PT09PT09PT09PT09PT0/////////////////////wAAAABMYXZjNjMuMS4AAAAAAAAAAAAAAAAkBRAAAAAAAAAIcKp3LvcAAAAAAAAAAAAAAAAAAAD/+xTEAAPAAAH+AAAAIAAAP8AAAATBv5aAAASzO8zN2zMQACFkEwJgDgHBuDcMMo9r+556QIEDFo2MggQIGIAAAANjIMDxwevJShcABwQgEHDEx5jyR/DC8VTMMajEgID/+8TEJYAFNFkXNMSAJCEpaLc7tIDIwMjiWgzrKGzEIWQcdxgqCZgAAhwuARn4MQGCYDCmgEQCGiGJuoWVjBgwgyRe7BDSCQx4GAx2IgBHQoAqFp+BmREYMIGFjIOAIwwCbV/DlOv8EgyeBl46YUIGKBzNqrXG5xzmdvX3zY30ypWMXlj2Ow75MPMiIGaWmUXnTmZZOS+B+U8jsmw2YRTGJCxkaCYCEGll5qqfH3rt1Z6flkvi+GffztiAOMhBgwkkiwDECzBIBP9LICimde9e/vf73//2Yw840Ay5/ozPRqWvdP81j////////////20GwZAwbNP///9KTVJBQgFwJydgGUL2UXGY5BAA84YjWyvPNok2qazDvlM6x02enDb5SOKU80kCBRCGAAeaPHJkJGGNRuMIYy2NzFIICGo1cHMuGB6FMrUQimCocYeSKdgQfMKEzFRuRvyYqBkheZRYGApBgh8fOjG6qZu54I4EMRQYHDAO+BQOmAEQCbTKxMUAmul8TIQESEEvlyNDa0ut1C0Q8OMqjj3QyCgUwsFbMn01BoywhiYgXnMBAGWhYKZeLAJagWBVvjQAGChaBAYnA0qSuklANCCCEiD2OKpMpUfXvDS2ZfA9pRV3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mva0tkTZdqSs0sHI20xdSzOUNKVprr3QfGt11crfKXf/+5TE8gAO9VdV9YQAJG64afc3kgk2kLttc0vDMNpKUYLLI1rm9Sd+6VWB0HAp+XvW7hpmiEeGARBcKKocIxgKgAYMu0gPWGL6LuishaK0B9mZQPeZ4RBUQVXb8iUSAVJUDJ1XJPlEgotDSJFXOFZXU80RqTM6tKhtsfPz1VWbhqoksvZjUvjUlJiVUAh1Eu3j/5YigUFJPy4K6KheJo5N+2gWoiAAzEADXIWaY+ragFcx+qVW5ragsCukuGQGGBNSKUlkTVSlJE9WCJmtVg0rkASZrseTOQY6FKN8Y6VWCs9xLUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3TE3YANwQdP/YQAKasfaD2DDe1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xTE9oPIlJsnrCRtYAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='].map(data=>new Audio('data:audio/mp3;base64,'+data));
let busy=false;
dot.addEventListener('click',async()=>{
 if(busy||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 busy=true;
 aim();
 const {start,target,bank,banks,impact:contact,direction,radius,dotRadius}=shot;
 const position=point=>'translate('+(point.x-radius)+'px,'+(point.y-radius)+'px)';
 const cueAt=offset=>'translateY(-50%) rotate(var(--cue-angle)) translateX(calc(-.075em - '+offset+'px))';
 const play=(index,volume)=>{
  sounds[index].volume=volume;
  sounds[index].currentTime=0;
  sounds[index].play().catch(()=>{});
 };
 let audioContext,buffers;
 try{
  audioContext=new AudioContext();
  await audioContext.resume();
  buffers=Promise.all(sounds.map(async sound=>{
   const response=await fetch(sound.src);
   return audioContext.decodeAudioData(await response.arrayBuffer());
  })).catch(()=>null);
 }catch{}
 async function impact(index,volume){
  const decoded=await buffers;
  if(!decoded || audioContext.state!=='running'){play(index,volume);return;}
  const source=audioContext.createBufferSource();
  source.buffer=decoded[index];
  const gain=audioContext.createGain();
  gain.gain.value=volume;
  source.connect(gain).connect(audioContext.destination);
  source.start();
 }
 const stroke=(frames,duration)=>cue.animate(frames,{duration,fill:'forwards'});
 stage.classList.add('lining');
 try{
  await stroke([{transform:cueAt(82),opacity:0},{transform:cueAt(62),opacity:1,easing:'ease-out'}],450).finished;
  for(const [near,far,length] of [[12,39,560],[8,34,480],[5,46,530]]){
   await stroke([
    {transform:cueAt(length===560?62:length===480?39:34),opacity:1,easing:'cubic-bezier(.42,0,.35,1)'},
    {transform:cueAt(near),offset:.52,easing:'cubic-bezier(.35,0,.58,1)'},
    {transform:cueAt(far),opacity:1}
   ],length).finished;
  }
  await stroke([{transform:cueAt(46),easing:'ease-in'},{transform:cueAt(0),opacity:1}],105).finished;
  void impact(0,.88);
  moving.style.width=moving.style.height=2*radius+'px';
  moving.hidden=false;
  stage.classList.add('shooting');
  let previous=start;
  for(let index=0;index<banks.length;index++){
   const next=banks[index];
   const distance=Math.hypot(next.x-previous.x,next.y-previous.y);
   const duration=Math.max(100,distance/(2.7-index*.35));
   await moving.animate([{transform:position(previous)},{transform:position(next)}],{duration,easing:'linear',fill:'forwards'}).finished;
   void impact(1,Math.max(.4,.76-index*.09));
   previous=next;
  }
  moving.getAnimations().forEach(animation=>animation.cancel());
  moving.style.transform=position(bank);
  let roll;
  const distance=Math.hypot(target.x-bank.x,target.y-bank.y);
  const touch=Math.hypot(contact.x-bank.x,contact.y-bank.y)/distance;
  const duration=1900;
  const slowdownAt=.56;
  const extraTime=430;
  await new Promise(resolve=>{
   let startTime;
   function rollFrame(now){
    startTime??=now;
    const elapsed=now-startTime;
    let lo=0,hi=1;
    for(let j=0;j<16;j++){
     const midpoint=(lo+hi)/2;
     const late=Math.max(0,(midpoint-slowdownAt)/(1-slowdownAt));
     if(duration*midpoint+extraTime*late*late<elapsed) lo=midpoint;
     else hi=midpoint;
    }
    const t=elapsed>=duration+extraTime?1:(lo+hi)/2;
    const travel=1-(1-t)**2.65;
    if(!roll&&travel>=touch){
     void impact(2,.92);
     roll=oldDot.animate([
      {transform:'translate(0,0)'},
      {transform:'translate('+direction.x*23+'px,'+direction.y*23+'px)'}
     ],{duration:720,easing:'cubic-bezier(.22,.55,.30,1)',fill:'forwards'});
    }
    const progress=Math.max(0,(travel-touch)/(1-touch));
    const size=radius+(dotRadius-radius)*progress*progress;
    const x=bank.x+(target.x-bank.x)*travel;
    const y=bank.y+(target.y-bank.y)*travel;
    moving.style.width=moving.style.height=2*size+'px';
    moving.style.transform='translate('+(x-size)+'px,'+(y-size)+'px)';

    if(t<1) requestAnimationFrame(rollFrame);
    else resolve();
   }
   requestAnimationFrame(rollFrame);
  });
  await roll.finished;
  await oldDot.animate([{opacity:1},{opacity:0}],{duration:190,fill:'forwards'}).finished;
  await new Promise(resolve=>setTimeout(resolve,220));
 }finally{
  oldDot.getAnimations().forEach(animation=>animation.cancel());
  moving.hidden=true;
  moving.getAnimations().forEach(animation=>animation.cancel());
  cue.getAnimations().forEach(animation=>animation.cancel());
  stage.classList.remove('shooting','lining');
  dot.animate([{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'});
  busy=false;
  if(audioContext) setTimeout(()=>void audioContext.close(),250);
 }
});
document.addEventListener('dl-brand-aligned',aim);
new ResizeObserver(aim).observe(stage);
document.fonts.ready.then(aim);
aim();

}

