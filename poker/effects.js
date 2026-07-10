(()=>{'use strict';
const STORAGE_KEY='river-room-sound';
const AudioEngine=window.AudioContext||window.webkitAudioContext;
const button=document.getElementById('sound');
const board=document.getElementById('board');
const seats=document.getElementById('seats');
const logbox=document.getElementById('log');
const potValue=document.getElementById('pot');
const handValue=document.getElementById('hands');
const statusValue=document.getElementById('status');
const felt=document.querySelector('.felt');

let enabled=true;
try{enabled=localStorage.getItem(STORAGE_KEY)!=='off'}catch(_){enabled=true}
let context=null;
let master=null;
let noiseBuffer=null;
let lastBoardCount=countBoardCards();
let lastHand=readHand();
let lastLogCount=logbox?.children.length||0;
let lastLogText=latestLog();
let lastPot=potValue?.textContent||'';
let lastStatus=statusValue?.textContent||'';
let holeTimer=0;
let suppressLogUntil=0;

function english(){return window.PokerI18n?.language==='en'}
function updateButton(){
  if(!button)return;
  if(!AudioEngine){
    button.textContent='🔇';
    button.disabled=true;
    button.dataset.sound='unsupported';
    const label=english()?'Sound is not supported':'当前浏览器不支持音效';
    button.title=label;
    button.setAttribute('aria-label',label);
    return;
  }
  button.disabled=false;
  button.textContent=enabled?'🔊':'🔇';
  button.dataset.sound=enabled?'on':'off';
  const label=enabled
    ?(english()?'Mute sound':'关闭音效')
    :(english()?'Turn sound on':'开启音效');
  button.title=label;
  button.setAttribute('aria-label',label);
  button.setAttribute('aria-pressed',String(!enabled));
}

function ensureAudio(){
  if(!AudioEngine)return null;
  if(!context){
    context=new AudioEngine();
    master=context.createGain();
    master.gain.value=enabled?.5:0;
    master.connect(context.destination);
    noiseBuffer=context.createBuffer(1,Math.ceil(context.sampleRate*.3),context.sampleRate);
    const data=noiseBuffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
  }
  return context;
}

function unlock(){
  if(!enabled)return;
  const ctx=ensureAudio();
  if(ctx?.state==='suspended')ctx.resume().catch(()=>{});
}

function setMaster(value){
  if(!master||!context)return;
  const now=context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setTargetAtTime(value,now,.012);
}

function tone(freq,at,duration,volume=.08,type='sine',endFreq=freq){
  if(!context||!master)return;
  const osc=context.createOscillator();
  const gain=context.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(Math.max(30,freq),at);
  if(endFreq!==freq)osc.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),at+duration);
  gain.gain.setValueAtTime(.0001,at);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.006);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at+duration+.025);
}

function noise(at,duration,volume=.035,filterType='highpass',frequency=1500){
  if(!context||!master||!noiseBuffer)return;
  const source=context.createBufferSource();
  const filter=context.createBiquadFilter();
  const gain=context.createGain();
  source.buffer=noiseBuffer;
  filter.type=filterType;
  filter.frequency.setValueAtTime(frequency,at);
  gain.gain.setValueAtTime(.0001,at);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.004);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  source.connect(filter).connect(gain).connect(master);
  source.start(at);
  source.stop(at+duration+.02);
}

function play(kind){
  if(!enabled||!AudioEngine)return;
  const ctx=ensureAudio();
  if(!ctx)return;
  if(ctx.state!=='running')return;
  const now=ctx.currentTime+.008;
  if(kind==='card'){
    noise(now,.075,.026,'highpass',1800);
    tone(780,now,.045,.045,'triangle',520);
  }else if(kind==='chips'){
    [0,.042,.086].forEach((delay,index)=>{
      tone([1260,1640,1430][index],now+delay,.045,.042,'triangle',[920,1180,1020][index]);
      noise(now+delay,.03,.012,'highpass',2600);
    });
  }else if(kind==='fold'){
    noise(now,.13,.035,'lowpass',900);
    tone(230,now,.15,.045,'sine',120);
  }else if(kind==='turn'){
    tone(660,now,.08,.04,'sine',820);
    tone(990,now+.07,.11,.035,'sine',990);
  }else if(kind==='showdown'){
    tone(196,now,.22,.055,'sawtooth',330);
    tone(392,now+.14,.2,.045,'triangle',520);
  }else if(kind==='win'){
    [523.25,659.25,783.99,1046.5].forEach((freq,index)=>tone(freq,now+index*.085,.19,.05,'triangle',freq*1.01));
  }else if(kind==='toggle'){
    tone(660,now,.07,.04,'sine',880);
    tone(990,now+.055,.1,.035,'sine',990);
  }
}

function countBoardCards(){
  return board?[...board.querySelectorAll('.card:not(.empty)')].length:0;
}

function readHand(){
  const raw=(handValue?.textContent||'').replace(/,/g,'').trim();
  return /^\d+$/.test(raw)?raw:'';
}

function latestLog(){
  return logbox?.lastElementChild?.textContent?.trim()||'';
}

function animateBoard(){
  if(!board)return;
  const cards=[...board.querySelectorAll('.card:not(.empty)')];
  const count=cards.length;
  if(count>lastBoardCount){
    cards.slice(lastBoardCount).forEach((card,index)=>{
      card.classList.add('fx-board-reveal');
      card.style.setProperty('--fx-delay',`${index*78}ms`);
      window.setTimeout(()=>play('card'),45+index*78);
    });
  }
  lastBoardCount=count;
}

function animateHoleCards(){
  if(!seats)return;
  const table=document.querySelector('.felt');
  const tableRect=table?.getBoundingClientRect();
  const staged=[];
  seats.querySelectorAll('.seat').forEach((seat,seatIndex)=>{
    seat.querySelectorAll('.holes .card').forEach((card,cardIndex)=>staged.push({card,seatIndex,cardIndex}));
  });
  staged.sort((a,b)=>a.cardIndex-b.cardIndex||a.seatIndex-b.seatIndex);
  staged.forEach(({card,seatIndex,cardIndex},order)=>{
    const rect=card.getBoundingClientRect();
    const x=tableRect?tableRect.left+tableRect.width/2-(rect.left+rect.width/2):0;
    const y=tableRect?tableRect.top+tableRect.height/2-(rect.top+rect.height/2):0;
    card.style.setProperty('--fx-x',`${Math.round(x)}px`);
    card.style.setProperty('--fx-y',`${Math.round(y)}px`);
    card.style.setProperty('--fx-rotate',`${seatIndex%2?-7:7}deg`);
    card.style.setProperty('--fx-delay',`${cardIndex*142+seatIndex*20}ms`);
    card.classList.add('fx-hole-deal');
    window.setTimeout(()=>play('card'),35+order*22);
  });
}

function scheduleHoleCards(){
  window.clearTimeout(holeTimer);
  holeTimer=window.setTimeout(()=>requestAnimationFrame(animateHoleCards),24);
}

function popPot(){
  const wrapper=potValue?.closest('.pot');
  if(!wrapper)return;
  wrapper.classList.remove('fx-pot-pop');
  void wrapper.offsetWidth;
  wrapper.classList.add('fx-pot-pop');
}

function shimmer(){
  if(!felt)return;
  felt.classList.remove('fx-showdown');
  void felt.offsetWidth;
  felt.classList.add('fx-showdown');
  window.setTimeout(()=>felt.classList.remove('fx-showdown'),900);
}

function soundForLog(text){
  const value=text.toLowerCase();
  if(/赢得|wins|champion/.test(value)){play('win');return}
  if(/摊牌|showdown/.test(value)){play('showdown');shimmer();return}
  if(/弃牌|folds/.test(value)){play('fold');return}
  if(/投入|跟注|加注|下注|全下|posts|calls|raises|bets|all-in/.test(value))play('chips');
}

function handleChanges(){
  animateBoard();

  const hand=readHand();
  if(hand&&hand!==lastHand)scheduleHoleCards();
  lastHand=hand;

  const pot=potValue?.textContent||'';
  if(pot!==lastPot){popPot();lastPot=pot}

  const status=statusValue?.textContent?.trim()||'';
  const isHeroTurn=/轮到你|your turn/i.test(status);
  const wasHeroTurn=/轮到你|your turn/i.test(lastStatus);
  if(isHeroTurn&&!wasHeroTurn)play('turn');
  lastStatus=status;

  const count=logbox?.children.length||0;
  const newest=latestLog();
  const logChanged=count>lastLogCount||(count===70&&newest!==lastLogText);
  if(logChanged&&performance.now()>suppressLogUntil)soundForLog(newest);
  lastLogCount=count;
  lastLogText=newest;
}

button?.addEventListener('click',()=>{
  enabled=!enabled;
  try{localStorage.setItem(STORAGE_KEY,enabled?'on':'off')}catch(_){}
  const ctx=enabled?ensureAudio():context;
  if(enabled){
    if(ctx?.state==='suspended')ctx.resume().then(()=>{setMaster(.5);play('toggle')}).catch(()=>{});
    else{setMaster(.5);play('toggle')}
  }else setMaster(0);
  updateButton();
});

document.getElementById('lang')?.addEventListener('click',()=>{
  suppressLogUntil=performance.now()+250;
  window.setTimeout(updateButton,0);
});
document.addEventListener('pointerdown',unlock,{capture:true,once:true});
document.addEventListener('keydown',unlock,{capture:true,once:true});

const observer=new MutationObserver(()=>handleChanges());
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
window.PokerEffects={
  get enabled(){return enabled},
  setEnabled(value){enabled=Boolean(value);try{localStorage.setItem(STORAGE_KEY,enabled?'on':'off')}catch(_){};if(enabled){ensureAudio();setMaster(.5)}else setMaster(0);updateButton()},
  play
};
updateButton();
})();
