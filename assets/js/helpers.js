/* ============================================================
   helpers.js — shared rendering + UI primitives
   The low-level primitives (el, cv, slider, tabs) are ported
   verbatim from the original single-file field notes so every
   widget keeps working unchanged. The renderers (renderConcept,
   renderQuiz) are new: they build cards and quizzes from the
   structured data in concepts.js, so content lives in one place.
   ============================================================ */

/* ---------- CSS-variable colour cache ----------
   Read once at load. Because the per-chapter accent is set via a
   body class BEFORE scripts run, C.accent already holds this
   chapter's colour — canvas widgets use C.accent for their primary
   stroke and recolour per chapter for free. */
var __cs = getComputedStyle(document.documentElement);
function __v(n){ return (__cs.getPropertyValue(n) || '').trim(); }
var C = {
  ink:    __v('--ink')    || '#ece9f5',
  grid:   __v('--line')   || '#2d2840',
  muted:  __v('--muted')  || '#a39bbd',
  panel:  __v('--panel')  || '#1a1726',
  accent: (getComputedStyle(document.body).getPropertyValue('--accent') || '').trim() || __v('--accent') || '#a78bfa',
  green:  __v('--green')  || '#34d399',
  amber:  __v('--amber')  || '#fbbf24',
  red:    __v('--red')    || '#f472b6'
};

/* ---------- DOM + canvas primitives (ported verbatim) ---------- */
function el(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }
function cv(mount, w, h){ var c=document.createElement('canvas'); var dpr=window.devicePixelRatio||1;
  c.width=w*dpr; c.height=h*dpr; c.style.width='100%'; c.style.maxWidth=w+'px'; c.style.height='auto';
  var ctx=c.getContext('2d'); ctx.scale(dpr,dpr); mount.appendChild(c); return {c:c,x:ctx,w:w,h:h}; }
function tabs(mount, names, cb){ var bar=el('div','tabs'); var btns=[];
  names.forEach(function(n,i){ var b=el('div','tab'+(i===0?' active':''),n);
    b.onclick=function(){ btns.forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); cb(i); };
    btns.push(b); bar.appendChild(b); });
  mount.appendChild(bar); return btns; }
function slider(mount, label, min, max, val, step, cb){ var row=el('div','ctrl');
  row.appendChild(el('label',null,label)); var r=document.createElement('input'); r.type='range';
  r.min=min; r.max=max; r.value=val; r.step=step||1; var out=el('span','readout',val);
  r.oninput=function(){ out.textContent=(+r.value).toFixed(step&&step<1?2:0); cb(+r.value); };
  row.appendChild(r); row.appendChild(out); mount.appendChild(row); return r; }

/* "Zepto example" marker for domain-specific instances */
function egTag(){ return '<span class="eg-tag">Zepto example</span>'; }

/* ---------- Concept card renderer (data -> DOM) ----------
   Returns a <section class="lesson"> built entirely from a concept
   object. The viz panel contains an empty <div id="{widget}-mount">
   that the chapter's widget function later finds and draws into. No
   card prose is ever duplicated in the page HTML. */
function renderConcept(concept){
  var sec = el('section','lesson'); sec.id = concept.id;
  var head = el('div','lhead');
  head.appendChild(el('div','num', concept.order));
  head.appendChild(el('h3', null, concept.title));
  sec.appendChild(head);

  sec.appendChild(el('div','core', concept.coreIdea));
  (concept.prose || []).forEach(function(p){ sec.appendChild(el('p', null, p)); });

  if(concept.widget){
    var viz = el('div','viz');
    viz.appendChild(el('div','vtitle', concept.vizTitle || 'Interactive'));
    viz.appendChild(el('div', null, '')).id = concept.widget + '-mount';
    if(concept.vizHint) viz.appendChild(el('p','hint', concept.vizHint));
    sec.appendChild(viz);
  }

  sec.appendChild(el('div','takeaway','<b>PM takeaway:</b> ' + concept.pmTakeaway));
  // Interview line is rehearsal content, not first-read — collapsed by default
  // (progressive disclosure) so each card carries less at a glance.
  var iv = el('details','interview');
  iv.innerHTML = '<summary>Interview-ready line</summary><q>' + concept.interviewLine + '</q>';
  sec.appendChild(iv);

  // Explicit completion control. The reader confirms understanding rather
  // than progress being inferred from scrolling. buildChapter wires it.
  var doneRow = el('div','card-done');
  var btn = el('button','btn done-btn','I get this — next ▸');
  btn.setAttribute('data-concept', concept.id);
  doneRow.appendChild(btn);
  sec.appendChild(doneRow);
  return sec;
}

/* Build every concept of a chapter into `mount`, sorted by order,
   and mark each viewed once it scrolls into view. */
function buildChapter(chapterNum, mount){
  var list = (window.CONCEPTS||[])
    .filter(function(c){ return c.chapter===chapterNum; })
    .sort(function(a,b){ return a.order-b.order; });
  list.forEach(function(c){ mount.appendChild(renderConcept(c)); });

  // Explicit completion: the reader clicks "I get this" to mark a concept
  // done and advance. Progress is never inferred from scrolling.
  var done = (window.Progress ? Progress.get().concepts : []);
  list.forEach(function(c, i){
    var card = document.getElementById(c.id);
    if(!card) return;
    var btn = card.querySelector('.done-btn');
    if(!btn) return;
    var isLast = (i === list.length - 1);
    if(isLast) btn.textContent = 'I get this — take the quiz ▸';
    function markDoneState(){
      btn.classList.add('is-done');
      btn.innerHTML = isLast ? '✓ Got it — take the quiz ▸' : '✓ Got it — next ▸';
    }
    if(done.indexOf(c.id) !== -1) markDoneState();
    btn.onclick = function(){
      if(window.Progress) Progress.markConcept(c.id);
      markDoneState();
      var target = isLast ? document.getElementById('quiz')
                          : document.getElementById(list[i+1].id);
      if(target) target.scrollIntoView({ behavior:'smooth', block:'start' });
    };
  });
  return list;
}

/* Collect a chapter's quiz questions, each tagged with its source
   concept so a failed quiz can link back to the right card. */
function chapterQuestions(chapterNum){
  var qs = [];
  (window.CONCEPTS||[])
    .filter(function(c){ return c.chapter===chapterNum; })
    .sort(function(a,b){ return a.order-b.order; })
    .forEach(function(c){
      (c.quizQuestions||[]).forEach(function(q){
        qs.push({ q:q.q, options:q.options, correctIndex:q.correctIndex,
                  explanation:q.explanation, conceptId:c.id, conceptTitle:c.title });
      });
    });
  return qs;
}

/* ---------- Quiz renderer ----------
   questions: array of {q, options[4], correctIndex, explanation, conceptId, conceptTitle}
   opts: { passPct (default 80), reviewBase ('' or '../'), onPass(fn), title }
   Reveals a one-line explanation after each answer, scores live, and
   on a failing run lists deeplinks to the specific cards to review. */
function renderQuiz(mount, questions, opts){
  opts = opts || {};
  var passPct = opts.passPct || 80;
  var reviewBase = opts.reviewBase || '';
  var answered = new Array(questions.length); // ORIGINAL option index chosen, or undefined
  // Options are shuffled at render so the correct answer isn't always in the
  // same slot (the source data clusters on B/C). Buttons carry their original
  // index so grading stays correct regardless of display order.
  function shuffled(n){ var a=[]; for(var i=0;i<n;i++)a.push(i);
    for(var j=a.length-1;j>0;j--){ var k=Math.floor(Math.random()*(j+1)); var t=a[j];a[j]=a[k];a[k]=t; } return a; }
  var box = el('div', null, '');
  questions.forEach(function(q, qi){
    var block = el('div','qblock');
    block.appendChild(el('div','qq', '<b>Q'+(qi+1)+'.</b> ' + q.q));
    var exp = el('div','qexp', q.explanation);
    var btns = [];
    shuffled(q.options.length).forEach(function(oi){   // oi = original index, in shuffled display order
      var b = el('button','qopt', q.options[oi]);
      b.__oi = oi;
      b.onclick = function(){
        if(answered[qi]!==undefined) return;
        answered[qi] = oi;
        btns.forEach(function(bb){
          bb.disabled = true;
          if(bb.__oi===q.correctIndex) bb.classList.add('correct');
          else if(bb.__oi===oi) bb.classList.add('wrong');
        });
        exp.classList.add('show');
        grade();
      };
      btns.push(b); block.appendChild(b);
    });
    block.appendChild(exp);
    box.appendChild(block);
  });
  mount.appendChild(box);
  var result = el('div', null, ''); mount.appendChild(result);

  function grade(){
    var done = answered.filter(function(a){ return a!==undefined; }).length;
    if(done < questions.length) return;
    var correct = 0, missed = {};
    questions.forEach(function(q, qi){
      if(answered[qi]===q.correctIndex) correct++;
      else missed[q.conceptId] = q.conceptTitle;
    });
    var pct = Math.round(correct/questions.length*100);
    var pass = pct >= passPct;
    result.className = 'quiz-result ' + (pass ? 'pass' : 'fail');
    if(pass){
      result.innerHTML = '✅ ' + correct + '/' + questions.length + ' (' + pct + '%) — passed. This chapter is marked complete.';
      if(opts.chapter && window.Progress) Progress.markQuiz(opts.chapter);
      if(opts.onPass) opts.onPass(pct);
    } else {
      // (review links built below)
      var links = Object.keys(missed).map(function(id){
        return '<a href="'+reviewBase+'revise.html#'+id+'">'+missed[id]+'</a>';
      }).join(' ');
      result.innerHTML = '⛔ ' + correct + '/' + questions.length + ' (' + pct + '%) — ' + passPct +
        '% needed to pass.<span class="review">Review then retry: ' + (links||'—') + '</span>';
    }
    if(opts.onComplete) opts.onComplete(pct, pass, correct, questions.length);
  }
}

/* ---------- Shared site nav ----------
   Nav.mount({ here:'ch1', base:'' | '../' }) injects the top bar. */
var Nav = {
  mount: function(o){
    o = o || {}; var base = o.base || '';
    window.__BASE = base; // so Progress can build correct resume links from any page
    var links = [
      ['home',  base + 'index.html',                 'Home'],
      ['ch1',   base + 'chapters/01-ml-foundations.html',   'Ch 1'],
      ['ch2',   base + 'chapters/02-how-llms-work.html',    'Ch 2'],
      ['ch3',   base + 'chapters/03-evals-safety-cost.html','Ch 3'],
      ['ch4',   base + 'chapters/04-watch-apply.html',      'Ch 4'],
      ['revise',base + 'revise.html',                'Revise'],
      ['assess',base + 'assess.html',                'Assess'],
      ['about', base + 'about.html',                 'About']
    ];
    var bar = el('nav','sitenav');
    var inner = el('div','inner');
    var brand = el('a','brand','AI 101 <span>for PMs</span>'); brand.href = base + 'index.html';
    inner.appendChild(brand);
    links.forEach(function(l){
      var a = el('a','navlink'+(l[0]===o.here?' here':''), l[2]); a.href = l[1]; inner.appendChild(a);
    });
    inner.appendChild(el('div','spacer'));
    var mini = el('div','progmini',''); mini.id='nav-progmini'; inner.appendChild(mini);
    // Theme toggle. Dark is the default; the choice persists in localStorage
    // and a head script applies it before paint. Reload on switch so the
    // canvas widgets (which cache colours at load) repaint in the new theme.
    var curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    var toggle = el('button','theme-toggle', curTheme==='light' ? '☾' : '☀');
    toggle.title = 'Switch light / dark';
    toggle.setAttribute('aria-label','Toggle light or dark theme');
    toggle.onclick = function(){
      var next = (document.documentElement.getAttribute('data-theme')==='light') ? 'dark' : 'light';
      try{ localStorage.setItem('ai101.theme', next); }catch(e){}
      location.reload();
    };
    inner.appendChild(toggle);
    bar.appendChild(inner);
    document.body.insertBefore(bar, document.body.firstChild);
    if(window.Progress) Progress.renderMini(mini);
  }
};
