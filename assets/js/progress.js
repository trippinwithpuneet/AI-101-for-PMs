/* ============================================================
   progress.js — completion tracking in localStorage only.
   No login, no backend, no analytics: progress lives entirely in
   the reader's browser. That is a deliberate feature — it removes
   every data-handling concern and makes the site safe to share
   with anyone, no questions asked.
   ============================================================ */
var Progress = (function(){
  var CK = 'ai101.concepts';   // viewed concept ids
  var QK = 'ai101.quizzes';    // passed chapter numbers
  var TOTAL_CONCEPTS = 25;
  var TOTAL_QUIZZES = 4;
  var bars = [];               // mounted bar elements to refresh on change

  function load(key){ try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){ return []; } }
  function save(key, arr){ try{ localStorage.setItem(key, JSON.stringify(arr)); }catch(e){} }
  function addUnique(key, val){ var a=load(key); if(a.indexOf(val)===-1){ a.push(val); save(key,a); refresh(); } }

  function get(){
    return { concepts: load(CK), quizzes: load(QK),
             totalConcepts: TOTAL_CONCEPTS, totalQuizzes: TOTAL_QUIZZES };
  }

  var CH_FILE = {1:'chapters/01-ml-foundations.html', 2:'chapters/02-how-llms-work.html',
                 3:'chapters/03-evals-safety-cost.html'};
  // First concept (in course order) the reader hasn't marked done — the resume point.
  function nextConcept(){
    var doneIds = load(CK);
    var list = (window.CONCEPTS||[]).slice().sort(function(a,b){
      return (a.chapter-b.chapter) || (a.order-b.order);
    });
    for(var i=0;i<list.length;i++){ if(doneIds.indexOf(list[i].id)===-1) return list[i]; }
    return null; // all done
  }

  function markConcept(id){ if(id) addUnique(CK, id); }
  function markQuiz(ch){ if(ch) addUnique(QK, ch); }
  function reset(){ save(CK,[]); save(QK,[]); refresh(); }

  function renderBar(mount){
    mount.className = 'progress-wrap';
    bars.push(mount);
    paintBar(mount);
    return mount;
  }
  function paintBar(mount){
    var s = get();
    var cPct = Math.round(s.concepts.length / s.totalConcepts * 100);
    var chips = '';
    for(var ch=1; ch<=4; ch++){
      var done = s.quizzes.indexOf(ch) !== -1 || s.quizzes.indexOf(String(ch)) !== -1;
      chips += '<span class="chip'+(done?' done':'')+'">Ch '+ch+' quiz '+(done?'✓':'·')+'</span>';
    }
    // Resume / reset row — your progress is saved in this browser between sessions.
    var base = window.__BASE || '';
    var next = nextConcept();
    var resume = '';
    if(s.concepts.length > 0){
      var left = next
        ? '<a class="presume-link" href="'+base+CH_FILE[next.chapter]+'#'+next.id+'">Resume → '+next.title+'</a>'
        : '<span class="presume-done">✓ All '+s.totalConcepts+' concepts complete</span>';
      resume = '<div class="presume">'+left+'<button class="presume-reset" type="button">Reset progress</button></div>';
    }
    mount.innerHTML =
      '<div class="ptop"><span>Your progress · saved in this browser</span>' +
      '<span><b>'+s.concepts.length+'</b> / '+s.totalConcepts+' concepts marked “I get this”</span></div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:'+cPct+'%"></div></div>' +
      '<div class="chips">'+chips+'</div>' + resume;
    var rb = mount.querySelector('.presume-reset');
    if(rb) rb.onclick = function(){
      if(window.confirm('Reset all progress? This clears completed concepts and passed quizzes in this browser.')) reset();
    };
  }

  function renderMini(elm){
    bars.push({mini:elm});
    paintMini(elm);
  }
  function paintMini(elm){
    var s = get();
    elm.textContent = s.concepts.length + '/' + s.totalConcepts + ' concepts';
  }

  function refresh(){
    bars.forEach(function(b){
      if(b && b.mini) paintMini(b.mini);
      else if(b && b.classList) paintBar(b);
    });
  }

  return { get:get, markConcept:markConcept, markQuiz:markQuiz, reset:reset,
           nextConcept:nextConcept, renderBar:renderBar, renderMini:renderMini };
})();
