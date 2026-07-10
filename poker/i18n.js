(()=>{'use strict';
const STORAGE_KEY='river-room-language';
const TEXT_NODE=3;
let language='zh';
try{language=localStorage.getItem(STORAGE_KEY)==='en'?'en':'zh'}catch(_){language='zh'}

const exact=new Map([
  ['德州扑克 · 单机锦标赛','Texas Hold’em · Solo Tournament'],
  ['手数','Hands'],['盲注','Blinds'],['你的筹码','Your Stack'],
  ['规则','Rules'],['重开','Restart'],['准备开局','Ready'],['底池','Pot'],
  ['正在洗牌…','Shuffling…'],['你的牌','Your Hand'],['等待发牌','Waiting for cards'],
  ['游戏开始后可在这里操作。','Your actions will appear here once the hand begins.'],
  ['下注至','Bet to'],['½ 底池','½ Pot'],['⅔ 底池','⅔ Pot'],['满池','Pot'],
  ['全下','All-in'],['弃牌','Fold'],['过牌','Check'],['下一手牌','Next Hand'],
  ['行动记录','Action Log'],
  ['仅使用虚拟筹码，不涉及真实货币。请理性娱乐。','Virtual chips only. No real-money wagering.'],
  ['关闭','Close'],['德州扑克规则','Texas Hold’em Rules'],
  ['每人 2 张底牌，与 5 张公共牌组合，选择最强的 5 张牌。下注依次经历翻牌前、翻牌、转牌和河牌；仍未弃牌的玩家最终摊牌。','Each player receives two hole cards. Combine them with five community cards to make the best five-card hand. Betting proceeds through preflop, flop, turn, and river, followed by showdown.'],
  ['1 皇家同花顺','1 Royal Flush'],['2 同花顺','2 Straight Flush'],['3 四条','3 Four of a Kind'],
  ['4 葫芦','4 Full House'],['5 同花','5 Flush'],['6 顺子','6 Straight'],
  ['7 三条','7 Three of a Kind'],['8 两对','8 Two Pair'],['9 一对','9 One Pair'],['10 高牌','10 High Card'],
  ['翻牌前 · PREFLOP','PREFLOP'],['翻牌 · FLOP','FLOP'],['转牌 · TURN','TURN'],
  ['河牌 · RIVER','RIVER'],['摊牌 · SHOWDOWN','SHOWDOWN'],['本手结束','HAND COMPLETE'],
  ['发牌中…','Dealing…'],['整理筹码…','Collecting chips…'],
  ['查看结果后开始下一手。','Review the result, then start the next hand.'],
  ['锦标赛结束。','Tournament over.'],
  ['你已弃牌，等待本手结束。','You folded. Waiting for the hand to finish.'],
  ['你已全下，等待摊牌。','You are all-in. Waiting for showdown.'],
  ['可过牌，也可选择下注。','You may check or bet.'],['牌局进行中。','Hand in progress.'],
  ['已弃牌','Folded'],['无法加注','Cannot raise'],['已出局','Out'],['摊牌','Showdown'],
  ['玩家已全下，自动发完公共牌。','Players are all-in. Running out the board.'],
  ['欢迎来到 River Room。每位玩家获得 2,000 虚拟筹码。','Welcome to River Room. Each player starts with 2,000 virtual chips.'],
  ['冠军！你赢下了全部筹码。','Champion! You won all the chips.'],
  ['你已出局。点击“重开”再来一局。','You are out. Select “Restart” to play again.'],
  ['确定重开牌局吗？','Restart the tournament?'],['你','You']
]);

const originals=new WeakMap();
let observer;

function names(text){
  return text.replace(/你/g,'You').replace(/、/g,', ');
}

function hand(text){
  const rules=[
    [/^皇家同花顺$/,'Royal Flush'],
    [/^([AJQK\d]+) 高同花顺$/,'$1-high Straight Flush'],
    [/^四条 ([AJQK\d]+)$/,'Four of a Kind, $1s'],
    [/^葫芦 ([AJQK\d]+) 带 ([AJQK\d]+)$/,'Full House, $1s over $2s'],
    [/^([AJQK\d]+) 高同花$/,'$1-high Flush'],
    [/^([AJQK\d]+) 高顺子$/,'$1-high Straight'],
    [/^三条 ([AJQK\d]+)$/,'Three of a Kind, $1s'],
    [/^两对 ([AJQK\d]+) \/ ([AJQK\d]+)$/,'Two Pair, $1s and $2s'],
    [/^一对 ([AJQK\d]+)$/,'Pair of $1s'],
    [/^([AJQK\d]+) 高牌$/,'$1-high']
  ];
  for(const [pattern,replacement] of rules){
    if(pattern.test(text))return text.replace(pattern,replacement);
  }
  return text;
}

function translateCore(text){
  if(exact.has(text))return exact.get(text);
  let match;
  if((match=text.match(/^第\s*([\d,]+)\s*手\s*·\s*翻牌前$/)))return `Hand ${match[1]} · Preflop`;
  if((match=text.match(/^(.+?) 投入小盲 ([\d,]+)。$/)))return `${names(match[1])} posts small blind ${match[2]}.`;
  if((match=text.match(/^(.+?) 投入大盲 ([\d,]+)。$/)))return `${names(match[1])} posts big blind ${match[2]}.`;
  if((match=text.match(/^翻牌：(.*)$/)))return `Flop: ${match[1]}`;
  if((match=text.match(/^转牌：(.*)$/)))return `Turn: ${match[1]}`;
  if((match=text.match(/^河牌：(.*)$/)))return `River: ${match[1]}`;
  if((match=text.match(/^(.+?) 无需摊牌赢得底池 ([\d,]+)。$/)))return `${names(match[1])} wins the ${match[2]} pot without showdown.`;
  if((match=text.match(/^(.+?) 以 (.+?) 赢得(主池|边池) ([\d,]+)。$/))){
    const potName=match[3]==='主池'?'main pot':'side pot';
    return `${names(match[1])} wins the ${potName} of ${match[4]} with ${hand(match[2])}.`;
  }
  if((match=text.match(/^(.+?) 赢得 ([\d,]+)$/)))return `${names(match[1])} wins ${match[2]}`;
  if((match=text.match(/^(.+?) 弃牌。$/)))return `${names(match[1])} folds.`;
  if((match=text.match(/^(.+?) 过牌。$/)))return `${names(match[1])} checks.`;
  if((match=text.match(/^(.+?) 全下跟注 ([\d,]+)。$/)))return `${names(match[1])} calls all-in for ${match[2]}.`;
  if((match=text.match(/^(.+?) 跟注 ([\d,]+)。$/)))return `${names(match[1])} calls ${match[2]}.`;
  if((match=text.match(/^(.+?) 全下至 ([\d,]+)。$/)))return `${names(match[1])} is all-in to ${match[2]}.`;
  if((match=text.match(/^(.+?) 加注至 ([\d,]+)。$/)))return `${names(match[1])} raises to ${match[2]}.`;
  if((match=text.match(/^(.+?) 下注 ([\d,]+)。$/)))return `${names(match[1])} bets ${match[2]}.`;
  if((match=text.match(/^小盲 ([\d,]+)$/)))return `SB ${match[1]}`;
  if((match=text.match(/^大盲 ([\d,]+)$/)))return `BB ${match[1]}`;
  if((match=text.match(/^全下跟注 ([\d,]+)$/)))return `All-in call ${match[1]}`;
  if((match=text.match(/^跟注 ([\d,]+)$/)))return `Call ${match[1]}`;
  if((match=text.match(/^全下至 ([\d,]+)$/)))return `All-in to ${match[1]}`;
  if((match=text.match(/^全下 ([\d,]+)$/)))return `All-in ${match[1]}`;
  if((match=text.match(/^加注至 ([\d,]+)$/)))return `Raise to ${match[1]}`;
  if((match=text.match(/^下注 ([\d,]+)$/)))return `Bet ${match[1]}`;
  if((match=text.match(/^跟注 · ([\d,]+)$/)))return `Call · ${match[1]}`;
  if((match=text.match(/^轮到你 · 跟注 ([\d,]+)$/)))return `Your turn · Call ${match[1]}`;
  if(text==='轮到你 · 可过牌或下注')return 'Your turn · Check or bet';
  if((match=text.match(/^(.+?) 正在思考…$/)))return `${names(match[1])} is thinking…`;
  if((match=text.match(/^需跟注 ([\d,]+) · 底池赔率 ([\d]+)%$/)))return `Call ${match[1]} · Pot odds ${match[2]}%`;
  if((match=text.match(/^等待 (.+?) 行动。$/)))return `Waiting for ${names(match[1])}.`;
  if((match=text.match(/^([AJQK\d]+)-([AJQK\d]+) · 同花$/)))return `${match[1]}-${match[2]} · Suited`;
  const translatedHand=hand(text);
  return translatedHand!==text?translatedHand:text;
}

function translate(text){
  const match=text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if(!match)return text;
  return `${match[1]}${translateCore(match[2])}${match[3]}`;
}

function eligible(node){
  const parent=node.parentElement;
  return !parent||!parent.closest('script,style,noscript,textarea');
}

function applyText(node,refreshOriginal=false){
  if(!eligible(node))return;
  if(refreshOriginal||!originals.has(node))originals.set(node,node.nodeValue);
  const source=originals.get(node);
  const next=language==='en'?translate(source):source;
  if(node.nodeValue!==next)node.nodeValue=next;
}

function scan(root,refreshOriginal=false){
  if(root.nodeType===TEXT_NODE){applyText(root,refreshOriginal);return}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode()))applyText(node,refreshOriginal);
}

function observe(){
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}

function updateButton(){
  const button=document.getElementById('lang');
  if(!button)return;
  const english=language==='en';
  button.textContent=english?'中文':'EN';
  button.setAttribute('aria-label',english?'切换到中文':'Switch to English');
  button.title=english?'切换到中文':'Switch to English';
}

function render(root=document.body){
  observer.disconnect();
  document.documentElement.lang=language==='en'?'en':'zh-CN';
  document.title=language==='en'?'River Room · Texas Hold’em':'River Room · 德州扑克';
  scan(root);
  updateButton();
  observe();
}

observer=new MutationObserver(records=>{
  observer.disconnect();
  const roots=new Set();
  for(const record of records){
    if(record.type==='characterData'){
      originals.set(record.target,record.target.nodeValue);
      roots.add(record.target);
    }else{
      for(const node of record.addedNodes)roots.add(node);
    }
  }
  for(const root of roots)scan(root);
  updateButton();
  observe();
});

const nativeAlert=window.alert.bind(window);
const nativeConfirm=window.confirm.bind(window);
window.alert=message=>nativeAlert(language==='en'?translate(String(message)):message);
window.confirm=message=>nativeConfirm(language==='en'?translate(String(message)):message);

document.getElementById('lang')?.addEventListener('click',()=>{
  language=language==='en'?'zh':'en';
  try{localStorage.setItem(STORAGE_KEY,language)}catch(_){}
  render();
});

window.PokerI18n={
  get language(){return language},
  setLanguage(value){if(value!=='zh'&&value!=='en')return;language=value;try{localStorage.setItem(STORAGE_KEY,language)}catch(_){}render()},
  translate
};

render();
})();
