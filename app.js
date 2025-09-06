// Simple state
const state = {
  cash: parseFloat(localStorage.getItem('cash')) || 100000,
  holdings: JSON.parse(localStorage.getItem('holdings')||'{}'),
  ledger: JSON.parse(localStorage.getItem('ledger')||'[]'),
  language: localStorage.getItem('lang') || 'en',
  lessons: [
    { id:'l1', title: {en:'What is a Stock?', hi:'शेयर क्या है?'}, body: {en:'A stock is a small ownership unit in a company.', hi:'शेयर किसी कंपनी में छोटा स्वामित्व भाग होता है।'}, badge:'Basics' },
    { id:'l2', title: {en:'Market Orders vs Limit Orders', hi:'मार्केट वर्सेस लिमिट आर्डर'}, body:{en:'Market executes now at best price; limit waits for your price.', hi:'मार्केट तुरंत सर्वश्रेष्ठ कीमत पर; लिमिट आपके तय दाम पर प्रतीक्षा करता है।'}, badge:'Orders' },
    { id:'l3', title: {en:'Risk & Diversification', hi:'जोखिम व विविधीकरण'}, body:{en:'Don’t put all eggs in one basket; spread across sectors/assets.', hi:'सारा पैसा एक जगह न लगाएँ; विभिन्न सेक्टर/एसेट्स में फैलाएँ।'}, badge:'Risk' },
    { id:'l4', title: {en:'Intro to Algo/HFT', hi:'एल्गो/HFT परिचय'}, body:{en:'Algorithms automate rules; HFT is ultra-fast trading. Retail must understand risks before use.', hi:'एल्गोरिद्म नियम-आधारित स्वचालन करते हैं; HFT अति-तेज़ ट्रेडिंग है। उपयोग से पहले जोखिम समझें।'}, badge:'Advanced' },
  ],
  quiz: [
    { q:'An index fund is typically…', opts:['Low-cost & diversified','A single stock','Guaranteed return','Intraday-only'], ans:0 },
    { q:'Which order gives price control?', opts:['Market','Limit','Stop-loss market','GTC'], ans:1 },
    { q:'What reduces unsystematic risk?', opts:['Leverage','Diversification','More trading','Rumours'], ans:1 },
  ]
};

// UI helpers
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

// Tabs
qsa('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
  qsa('.tab-btn').forEach(b=>b.classList.remove('active'));
  qsa('.tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  qs('#'+btn.dataset.tab).classList.add('active');
  persist();
}));

// Language
const langSelect = qs('#langSelect');
langSelect.value = state.language;
langSelect.addEventListener('change', e => {
  state.language = e.target.value;
  localStorage.setItem('lang', state.language);
  renderI18n();
  renderLessons();
});

// I18n dictionary (small prototype set)
const I18N = {
  en: {
    home_title:'Welcome to Nivesh Saathi',
    home_desc:'An interactive learning app for retail investors: tutorials, risk assessment, quizzes, and a safe virtual trading sandbox using delayed market data.',
    card_learn_title:'Bite-sized Lessons', card_learn_desc:'Understand market basics, risk, diversification, and the idea of algorithmic trading/HFT.',
    card_quiz_title:'Practice with Quizzes', card_quiz_desc:'Reinforce learning and track progress, earn badges on mastery.',
    card_trade_title:'Virtual Trading', card_trade_desc:'Try strategies on delayed data with no real money risk.',
    card_lang_title:'Vernacular First', card_lang_desc:'Translate & summarize official materials for better access.',
    learn_title:'Learn',
    risk_title:'Risk Profiling',
    risk_q1:'Investment horizon?',
    risk_q2:'How do you feel about a 20% drop?',
    risk_q2_a1:'I would sell immediately',
    risk_q2_a2:'I would hold',
    risk_q2_a3:'I would buy more',
    risk_q3:'Main goal?',
    risk_q3_a1:'Capital preservation',
    risk_q3_a2:'Balanced growth',
    risk_q3_a3:'Aggressive growth',
    btn_calc_score:'Calculate Score',
    quiz_title:'Quizzes',
    btn_submit_quiz:'Submit Answers',
    trade_title:'Virtual Trading (Delayed Data)',
    trade_symbol:'Symbol',
    trade_qty:'Quantity',
    btn_buy:'Buy',
    btn_sell:'Sell',
    trade_portfolio:'Portfolio',
    trade_ledger:'Ledger',
    sum_title:'Translate & Summarize (Prototype)',
    sum_desc:'Paste text from official sources (e.g., SEBI/NISM). This prototype creates a quick summary and attempts simple EN↔HI translation for key terms.',
    btn_summarize:'Summarize',
    btn_translate:'Translate',
    sum_output:'Output',
    prog_title:'My Progress',
    btn_reset:'Reset All Data'
  },
  hi: {
    home_title:'निवेश साथी में आपका स्वागत है',
    home_desc:'खुदरा निवेशकों के लिए इंटरएक्टिव लर्निंग ऐप: ट्यूटोरियल, जोखिम आकलन, क्विज़ और विलंबित डाटा पर वर्चुअल ट्रेडिंग सैंडबॉक्स।',
    card_learn_title:'छोटे-छोटे पाठ', card_learn_desc:'बाजार मूल बातें, जोखिम, विविधीकरण और एल्गो/HFT का विचार समझें।',
    card_quiz_title:'क्विज़ से अभ्यास', card_quiz_desc:'सीख को मजबूत करें और बैज पाएं।',
    card_trade_title:'वर्चुअल ट्रेडिंग', card_trade_desc:'बिना वास्तविक धन जोखिम के विलंबित डेटा पर रणनीतियाँ आज़माएँ।',
    card_lang_title:'स्थानीय भाषा प्राथमिकता', card_lang_desc:'सरकारी सामग्री का अनुवाद व सार आसान पहुँच हेतु।',
    learn_title:'सीखें',
    risk_title:'जोखिम प्रोफाइलिंग',
    risk_q1:'निवेश अवधि?',
    risk_q2:'20% गिरावट पर आपकी भावना?',
    risk_q2_a1:'तुरंत बेच दूँगा/दूँगी',
    risk_q2_a2:'होल्ड करूँगा/करूँगी',
    risk_q2_a3:'और खरीदूँगा/खरीदूँगी',
    risk_q3:'मुख्य लक्ष्य?',
    risk_q3_a1:'पूँजी सुरक्षित रखना',
    risk_q3_a2:'संतुलित वृद्धि',
    risk_q3_a3:'आक्रामक वृद्धि',
    btn_calc_score:'स्कोर निकालें',
    quiz_title:'क्विज़',
    btn_submit_quiz:'उत्तर सबमिट करें',
    trade_title:'वर्चुअल ट्रेडिंग (विलंबित डाटा)',
    trade_symbol:'सिम्बल',
    trade_qty:'मात्रा',
    btn_buy:'खरीदें',
    btn_sell:'बेचें',
    trade_portfolio:'पोर्टफोलियो',
    trade_ledger:'लेजर',
    sum_title:'अनुवाद व सार (प्रोटोटाइप)',
    sum_desc:'आधिकारिक स्रोतों (जैसे SEBI/NISM) से पाठ चिपकाएँ। यह प्रोटोटाइप त्वरित सार बनाता है और सरल EN↔HI शब्द-अनुवाद करने की कोशिश करता है।',
    btn_summarize:'सार बनाएं',
    btn_translate:'अनुवाद करें',
    sum_output:'आउटपुट',
    prog_title:'मेरी प्रगति',
    btn_reset:'सारा डाटा रीसेट करें'
  }
};

function renderI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const dict = I18N[state.language] || I18N.en;
    if (dict[key]) el.textContent = dict[key];
  });
}

// Lessons
function renderLessons(){
  const list = document.getElementById('lessonList');
  list.innerHTML = '';
  state.lessons.forEach(ls => {
    const card = document.createElement('div');
    card.className = 'lesson';
    const title = ls.title[state.language] || ls.title.en;
    const body = ls.body[state.language] || ls.body.en;
    card.innerHTML = \`
      <h4>\${title} <span class="badge">\${ls.badge}</span></h4>
      <p>\${body}</p>
      <button class="secondary" data-id="\${ls.id}">Mark Complete</button>
    \`;
    card.querySelector('button').addEventListener('click', () => {
      const completed = JSON.parse(localStorage.getItem('completedLessons')||'[]');
      if (!completed.includes(ls.id)) completed.push(ls.id);
      localStorage.setItem('completedLessons', JSON.stringify(completed));
      renderProgress();
    });
    list.appendChild(card);
  });
}

// Risk profiling
document.getElementById('riskForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const horizon = parseInt(f.get('horizon'),10);
  const vol = parseInt(f.get('vol'),10);
  const goal = parseInt(f.get('goal'),10);
  const score = horizon + vol + goal; // 3–16
  let bucket='Conservative', alloc={equity:30, debt:60, other:10};
  if (score>=9 && score<12){ bucket='Balanced'; alloc={equity:50, debt:45, other:5}; }
  if (score>=12){ bucket='Aggressive'; alloc={equity:70, debt:25, other:5}; }
  const msg = \`Score: \${score} → \${bucket}. Suggested allocation: Equity \${alloc.equity}%, Debt \${alloc.debt}%, Other \${alloc.other}%.\`;
  document.getElementById('riskResult').textContent = msg;
  localStorage.setItem('riskProfile', JSON.stringify({score,bucket,alloc,ts:Date.now()}));
  renderProgress();
});

// Quiz
function renderQuiz(){
  const box = document.getElementById('quizContainer');
  box.innerHTML = '';
  state.quiz.forEach((q,i) => {
    const div = document.createElement('div');
    div.className = 'lesson';
    div.innerHTML = \`<p><strong>Q\${i+1}.</strong> \${q.q}</p>\`;
    q.opts.forEach((opt, j) => {
      const id = \`q\${i}_\${j}\`;
      div.innerHTML += \`
        <label class="row">
          <input type="radio" name="q\${i}" value="\${j}" id="\${id}"/>
          <span>\${opt}</span>
        </label>
      \`;
    });
    box.appendChild(div);
  });
}
document.getElementById('submitQuiz').addEventListener('click', () => {
  let correct=0;
  state.quiz.forEach((q,i)=>{
    const sel = document.querySelector('input[name="q'+i+'"]:checked');
    if (sel && parseInt(sel.value,10)===q.ans) correct++;
  });
  const msg = \`You scored \${correct}/\${state.quiz.length}.\`;
  document.getElementById('quizResult').textContent = msg;
  const history = JSON.parse(localStorage.getItem('quizHistory')||'[]');
  history.push({ts:Date.now(), correct, total: state.quiz.length});
  localStorage.setItem('quizHistory', JSON.stringify(history));
  renderProgress();
});

// Trading
let prices = {};
fetch('data/delayed_prices.json').then(r=>r.json()).then(d=>{
  prices = d;
  const select = document.getElementById('symbolSelect');
  Object.keys(prices).forEach(sym => {
    const o = document.createElement('option');
    o.value = sym; o.textContent = sym;
    select.appendChild(o);
  });
  renderPricePanel();
  select.addEventListener('change', renderPricePanel);
});

function renderPricePanel(){
  const sym = document.getElementById('symbolSelect').value || Object.keys(prices)[0];
  const p = prices[sym] || [];
  const last = p[p.length-1] || 0;
  document.getElementById('pricePanel').innerHTML = \`
    <div>Last (delayed): <strong>\${last.toFixed(2)}</strong></div>
    <div>Sample series: \${p.slice(-10).map(x=>x.toFixed(2)).join(', ')}</div>
    <div>Cash: <strong>\${state.cash.toFixed(2)}</strong></div>
  \`;
  renderPortfolio();
}

function trade(side){
  const sym = document.getElementById('symbolSelect').value || Object.keys(prices)[0];
  const qty = Math.max(1, parseInt(document.getElementById('orderQty').value,10)||1);
  const p = prices[sym] || [];
  const px = p[p.length-1] || 0;
  if (side==='BUY'){
    const cost = px*qty;
    if (state.cash < cost){ alert('Insufficient cash'); return; }
    state.cash -= cost;
    state.holdings[sym] = (state.holdings[sym]||0) + qty;
  } else {
    const have = state.holdings[sym]||0;
    if (have < qty){ alert('Not enough quantity'); return; }
    state.holdings[sym] = have - qty;
    state.cash += px*qty;
  }
  state.ledger.push({ts:Date.now(), side, sym, qty, px});
  persist();
  renderPricePanel();
  renderPortfolio();
}

document.getElementById('buyBtn').addEventListener('click', ()=>trade('BUY'));
document.getElementById('sellBtn').addEventListener('click', ()=>trade('SELL'));

function renderPortfolio(){
  const symList = Object.keys(state.holdings);
  const lines = [`Cash: ${state.cash.toFixed(2)}`];
  symList.forEach(sym => {
    const qty = state.holdings[sym];
    const last = (prices[sym]||[]).slice(-1)[0]||0;
    lines.push(`${sym}: ${qty} @ last ${last.toFixed(2)} = ${(qty*last).toFixed(2)}`);
  });
  document.getElementById('portfolioView').textContent = lines.join('\n');
  document.getElementById('ledgerView').textContent = state.ledger.slice(-10).map(e=>`${new Date(e.ts).toLocaleString()} ${e.side} ${e.sym} ${e.qty} @ ${e.px}`).join('\n');
}

// Translate & Summarize (prototype heuristics)
const HI_DICT = {
  'investor':'निवेशक','risk':'जोखिम','equity':'इक्विटी','debt':'ऋण','diversification':'विविधीकरण','market':'बाज़ार','stock':'शेयर','index':'सूचकांक','mutual fund':'म्यूचुअल फंड','order':'आर्डर','limit':'लिमिट','price':'कीमत','broker':'ब्रोकर'
};

function summarize(text){
  // naive frequency-based summarizer (demo only)
  const sents = text.split(/[.!?\n]+/).map(s=>s.trim()).filter(Boolean);
  if (sents.length<=3) return text;
  const words = text.toLowerCase().match(/[a-zA-Zऀ-ॿ]+/g) || [];
  const freq = {};
  words.forEach(w=>{ freq[w]=(freq[w]||0)+1; });
  const scored = sents.map(s=>({s, score:(s.toLowerCase().match(/[a-zA-Zऀ-ॿ]+/g)||[]).reduce((a,w)=>a+(freq[w]||0),0)}));
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0,Math.min(3, scored.length)).map(o=>o.s).join('. ') + '.';
}

qs('#btnSummarize').addEventListener('click', ()=>{
  const txt = qs('#sumInput').value.trim();
  if (!txt){ qs('#sumOutput').textContent = 'Paste some text first.'; return; }
  qs('#sumOutput').textContent = summarize(txt);
});

qs('#btnTranslate').addEventListener('click', ()=>{
  const txt = qs('#sumInput').value;
  if (!txt){ qs('#sumOutput').textContent = 'Paste some text first.'; return; }
  let out = txt;
  if (state.language==='hi'){
    Object.entries(HI_DICT).forEach(([en,hi])=>{
      const re = new RegExp('\\b'+en+'\\b','gi');
      out = out.replace(re, hi);
    });
  } else {
    Object.entries(HI_DICT).forEach(([en,hi])=>{
      const re = new RegExp(hi,'g');
      out = out.replace(re, en);
    });
  }
  qs('#sumOutput').textContent = out;
});

// Progress
function renderProgress(){
  const view = qs('#progressView');
  const completed = JSON.parse(localStorage.getItem('completedLessons')||'[]');
  const quizHistory = JSON.parse(localStorage.getItem('quizHistory')||'[]');
  const risk = JSON.parse(localStorage.getItem('riskProfile')||'null');
  view.innerHTML = \`
    <div class="cards">
      <div class="card"><h3>Lessons</h3><p>\${completed.length}/\${state.lessons.length} completed</p></div>
      <div class="card"><h3>Quiz</h3><p>Attempts: \${quizHistory.length} | Last Score: \${quizHistory.slice(-1)[0]?.correct ?? 0}/\${state.quiz.length}</p></div>
      <div class="card"><h3>Risk</h3><p>\${risk ? risk.bucket+' (score '+risk.score+')' : 'Not assessed'}</p></div>
      <div class="card"><h3>Portfolio</h3><p>Cash: \${state.cash.toFixed(2)} | Holdings: \${Object.keys(state.holdings).length}</p></div>
    </div>
  \`;
}

document.getElementById('resetBtn').addEventListener('click', ()=>{
  if (!confirm('This will clear all saved data. Continue?')) return;
  localStorage.clear();
  location.reload();
});

function persist(){
  localStorage.setItem('cash', state.cash);
  localStorage.setItem('holdings', JSON.stringify(state.holdings));
  localStorage.setItem('ledger', JSON.stringify(state.ledger));
}

// Init
renderI18n();
renderLessons();
renderQuiz();
renderProgress();
