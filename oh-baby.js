{

const stage=document.getElementById('dl-screen'),button=document.querySelector('.wordmark-sound');
const sound=new Audio('./OhBaby.mp3');
const image=new Image();
const crops=[[900,116,108,142],[1006,91,96,170],[1101,117,111,150],[1212,134,79,122],[1291,100,92,166],[1381,117,82,158],[1459,202,25,39],[1486,202,27,39],[1514,202,27,39]];
const assets=[];
const shapes=[
 'M49 15 C18 6 4 38 8 77 C9 112 27 135 50 124 C76 113 87 81 80 48 C76 29 65 17 49 15 Z M47 29 C64 29 70 51 67 77 C65 102 52 115 39 110 C22 105 19 79 24 55 C28 37 36 28 47 29 Z',
 'M15 8 L29 5 L34 62 Q52 35 68 48 Q81 58 77 91 L75 126 L61 128 L64 86 Q67 58 53 63 Q38 69 36 91 L38 130 L23 132 Z',
 'M17 12 Q65 -1 78 24 Q87 43 65 58 Q94 65 87 94 Q82 125 24 135 Z M32 25 L35 54 Q67 46 64 32 Q61 20 32 25 Z M37 70 L41 116 Q73 106 73 87 Q72 68 37 70 Z',
 'M15 48 Q39 27 59 43 Q69 53 68 79 L72 123 L59 127 L56 116 Q36 137 18 123 Q1 109 14 90 Q25 74 53 75 Q54 54 40 54 Q30 53 22 61 Z M53 90 Q24 88 24 105 Q24 121 43 110 Q57 102 53 90 Z',
 'M14 7 L28 5 L32 60 Q51 37 67 48 Q87 61 77 92 Q69 122 24 132 Z M35 77 L39 114 Q66 102 64 80 Q62 61 49 69 Z',
 'M9 45 L24 39 L42 79 L59 34 L74 39 L48 106 Q37 138 13 143 L7 130 Q26 125 32 104 Z',
 'M20 106 C7 107 7 125 19 125 C33 125 34 106 20 106 Z',
 'M20 106 C7 107 7 125 19 125 C33 125 34 106 20 106 Z'
];
shapes.push(shapes[7]);
for(let i=0;i<shapes.length;i++){
 const c=document.createElement('canvas');
 c.width=crops[i][2];c.height=crops[i][3];
 const ctx=c.getContext('2d');
 ctx.scale(c.width/94,c.height/150);
 ctx.strokeStyle='#000';ctx.lineWidth=3.5;
 ctx.lineJoin='round';ctx.lineCap='round';
 const path=new Path2D(shapes[i]);
 if(i>5){
 const rings=[
  'M64 118 C65 129 55 138 44 136 C33 135 26 127 28 116 C29 105 39 99 49 101 C59 102 65 109 64 118 Z',
  'M65 116 C68 126 60 136 49 137 C37 138 28 131 27 120 C26 109 35 100 46 100 C56 99 63 106 65 116 Z',
  'M63 111 C70 120 63 132 53 136 C42 140 31 134 28 124 C24 113 32 103 42 101 C51 98 59 103 63 111 Z'
 ];
 ctx.lineWidth=4.1;
 ctx.stroke(new Path2D(rings[i-6]));
}else ctx.stroke(path);
 assets.push(c.toDataURL());
}
let pending,endedAt=Infinity,run=0;
button.onclick=()=>{
 run++;
 clearTimeout(pending);stage.querySelectorAll('.oh-baby-letter').forEach(node=>node.remove());
 sound.pause();sound.currentTime=0;endedAt=Infinity;
 sound.play().then(()=>pending=setTimeout(reveal,1070)).catch(()=>{});
};
sound.onended=()=>endedAt=performance.now();
let resizeTimer;
window.addEventListener('resize',()=>{
 clearTimeout(resizeTimer);
 resizeTimer=setTimeout(()=>{
  if(sound.paused)return;
  run++;
  clearTimeout(pending);
  stage.querySelectorAll('.oh-baby-letter').forEach(node=>node.remove());
  if(sound.currentTime>=1.07)reveal();
  else pending=setTimeout(reveal,(1.07-sound.currentTime)*1000);
 },80);
});
function reveal(){
 const bounds=button.getBoundingClientRect();
 const x=bounds.left+bounds.width/2,y=bounds.top+bounds.height*.25;
 const fontSize=parseFloat(getComputedStyle(button).fontSize);
 const unit=fontSize/94;
 const available=innerWidth-x-24*unit;
 const scale=Math.min(.29*unit,available/850);
 const fit=scale/.29;
 let advance=0;
 const id=run;
 const started=performance.now();
 const pieces=crops.map((crop,i)=>{
  if(i===2)advance+=12*fit;
  const node=document.createElement('img');node.className='oh-baby-letter';node.src=assets[i];
  const finalScale=scale*(.82+i*.04);
  node.style.width=crop[2]*finalScale+'px';
  stage.append(node);
  const result={node,dx:advance+43*fit+3,dy:(i>=6?-38-5*8+28-(i-6)*2.5:-38-i*8)*fit+5,delay:i*67};
  advance+=crop[2]*finalScale*.92;
  return result;
 });
 function draw(now){
  if(id!==run)return;
  const elapsed=now-started;
  const fade=now>endedAt?Math.max(0,1-(now-endedAt)/500):1;
  for(const [i,p] of pieces.entries()){
   const t=Math.max(0,Math.min(1,(elapsed-p.delay)/650));
   const travel=1-(1-t)**3;
   p.node.style.opacity=Math.min(1,t*3)*fade;
   p.node.style.left=x+p.dx*travel+'px';
   p.node.style.top=y+p.dy*travel+Math.sin(elapsed/90+i)*1.4*fit+'px';
   p.node.style.transform='scale('+(.65+.35*travel)+') rotate('+Math.sin(elapsed/120+i)*2+'deg)';
  }
  if(fade>0)requestAnimationFrame(draw);else pieces.forEach(p=>p.node.remove());
 }
 requestAnimationFrame(draw);
}

}
