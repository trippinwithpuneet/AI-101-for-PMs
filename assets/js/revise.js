/* ============================================================
   revise.js — search index + card/flashcard logic for revise.html.
   All three revise modes (quick lookup, by chapter, everything) pull
   from the same CONCEPTS array in concepts.js — single source of truth.

   v1 ships with KEYWORD search. Semantic search via client-side
   embeddings is a planned v2 (see README) — not built yet.

   Note on widgets: the interactive widgets live in their chapter pages
   (as IIFEs). The revise cards show the full TEXT of a concept plus a
   prominent deeplink to play that concept's interactive in-context.
   ============================================================ */
var Revise = (function(){
  function all(){
    return (window.CONCEPTS||[]).slice().sort(function(a,b){
      return (a.chapter-b.chapter) || (a.order-b.order);
    });
  }
  function byChapter(n){
    return all().filter(function(c){ return c.chapter===n; });
  }
  function byId(id){
    return (window.CONCEPTS||[]).filter(function(c){ return c.id===id; })[0] || null;
  }

  var CH_NAMES = {1:'Ch 1 · ML Foundations', 2:'Ch 2 · How LLMs Work',
                  3:'Ch 3 · Evals, Safety & Cost'};
  var CH_FILE  = {1:'chapters/01-ml-foundations.html', 2:'chapters/02-how-llms-work.html',
                  3:'chapters/03-evals-safety-cost.html'};
  function chapterName(n){ return CH_NAMES[n] || ('Chapter ' + n); }

  /* Keyword search: rank by where the term hits.
     title/tag = strong, core idea = medium, prose = weak. */
  function search(q){
    q = (q||'').trim().toLowerCase();
    if(!q) return [];
    var terms = q.split(/\s+/);
    return all().map(function(c){
      var hay = {
        title: (c.title||'').toLowerCase(),
        tags:  (c.tags||[]).join(' ').toLowerCase(),
        core:  (c.coreIdea||'').toLowerCase(),
        prose: (c.prose||[]).join(' ').toLowerCase()
      };
      var score = 0;
      terms.forEach(function(t){
        if(hay.title.indexOf(t)!==-1) score += 10;
        if(hay.tags.indexOf(t)!==-1)  score += 6;
        if(hay.core.indexOf(t)!==-1)  score += 3;
        if(hay.prose.indexOf(t)!==-1) score += 1;
      });
      return { c:c, score:score };
    }).filter(function(r){ return r.score>0; })
      .sort(function(a,b){ return b.score-a.score; })
      .map(function(r){ return r.c; });
  }

  /* Full text card for a concept, with a deeplink to its live widget.
     base = '' from repo root (revise.html is at root). */
  function renderCard(concept, base){
    base = base || '';
    var sec = el('section','lesson'); sec.id = 'card-' + concept.id;
    var head = el('div','lhead');
    head.appendChild(el('div','num', concept.order));
    head.appendChild(el('h3', null, concept.title));
    sec.appendChild(head);
    sec.appendChild(el('div','core', concept.coreIdea));
    (concept.prose||[]).forEach(function(p){ sec.appendChild(el('p', null, p)); });
    if(concept.widget && CH_FILE[concept.chapter]){
      var link = el('a','btn alt', '▶ Play the interactive in ' + chapterName(concept.chapter));
      link.href = base + CH_FILE[concept.chapter] + '#' + concept.id;
      var row = el('div','btn-row'); row.appendChild(link); sec.appendChild(row);
    }
    sec.appendChild(el('div','takeaway','<b>PM takeaway:</b> ' + concept.pmTakeaway));
    sec.appendChild(el('div','interview',
      '<span class="tag">Interview line</span><q>' + concept.interviewLine + '</q>'));
    return sec;
  }

  /* Flashcard: front = title + core idea; click toggles to the full card. */
  function renderFlashcard(concept, base){
    var card = el('div','flashcard');
    var flipped = false;
    function front(){
      card.innerHTML = '';
      card.appendChild(el('div','flip-hint','tap to reveal →'));
      card.appendChild(el('div','ftag', chapterName(concept.chapter)));
      card.appendChild(el('h3', null, concept.title));
      card.appendChild(el('div', null, concept.coreIdea));
    }
    function back(){
      card.innerHTML = '';
      card.appendChild(el('div','flip-hint','tap to flip back'));
      card.appendChild(Revise.renderCard(concept, base));
    }
    card.onclick = function(e){
      if(e.target.tagName === 'A') return; // let the deeplink work
      flipped = !flipped; flipped ? back() : front();
    };
    front();
    return card;
  }

  return { all:all, byChapter:byChapter, byId:byId, chapterName:chapterName,
           search:search, renderCard:renderCard, renderFlashcard:renderFlashcard };
})();
