/* ============================================================
   community.js — community suggestion board.
   The ONLY networked feature besides the Chapter 4 videos.

   Talks directly to a Supabase REST endpoint using the public
   "anon" key (safe to expose — every write is constrained by
   Row-Level Security + triggers on the server). Voting is
   anonymous: a random id kept in localStorage (ai101.voterId)
   is the only thing tying a person's votes together. No account,
   no personal data unless someone chooses to add their name.

   Until SUPA_URL / SUPA_KEY are filled in below, the board stays
   dormant — it shows a friendly note and makes zero network calls.
   ============================================================ */
var Community = (function(){

  /* ---------- CONFIG — paste your Supabase values here ----------
     Project URL + anon (public) key from Supabase → Settings → API. */
  var SUPA_URL = "https://wrqysaqgqhkicirueory.supabase.co";        // e.g. https://abcd1234.supabase.co
  var SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndycXlzYXFncWhraWNpcnVlb3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTMwNDEsImV4cCI6MjA5NzY4OTA0MX0.K4a6Lm4wOwKpaiMlhl6qUy4BT5G_yJElpO4SYLuke8g";   // anon / public key (safe to expose)

  var CONFIGURED = SUPA_URL.indexOf("http") === 0 && SUPA_KEY.indexOf("__") !== 0;
  var REST = SUPA_URL.replace(/\/+$/, "") + "/rest/v1";

  var boardEl = null;
  var DATA = [];          // suggestions in memory
  var SORT = "top";       // 'top' | 'new'
  var FILTER = "all";     // 'all' | 'open' | 'shipped'
  var voterId = null;

  /* ---------- localStorage (same ai101.* convention as progress.js) ---------- */
  function getVoterId(){
    var id = null;
    try { id = localStorage.getItem("ai101.voterId"); } catch(e){}
    if(!id){
      id = "v-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { localStorage.setItem("ai101.voterId", id); } catch(e){}
    }
    return id;
  }
  function getVotes(){ try { return JSON.parse(localStorage.getItem("ai101.votes")) || {}; } catch(e){ return {}; } }
  function setVote(id, val){
    var m = getVotes();
    if(val === 0) delete m[id]; else m[id] = val;
    try { localStorage.setItem("ai101.votes", JSON.stringify(m)); } catch(e){}
  }

  /* ---------- tiny utilities ---------- */
  function escapeHtml(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function relTime(iso){
    var t = new Date(iso).getTime();
    if(!t) return "";
    var diff = (Date.now() - t) / 1000;
    if(diff < 60) return "just now";
    if(diff < 3600) return Math.floor(diff/60) + "m ago";
    if(diff < 86400) return Math.floor(diff/3600) + "h ago";
    return Math.floor(diff/86400) + "d ago";
  }
  function toast(text){
    var t = el("div","toast", escapeHtml(text));
    document.body.appendChild(t);
    setTimeout(function(){ t.classList.add("show"); }, 10);
    setTimeout(function(){
      t.classList.remove("show");
      setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 2600);
  }
  function formMsg(text, ok){
    var m = document.getElementById("form-msg");
    if(!m) return;
    m.className = "form-msg" + (ok ? " ok" : "");
    m.textContent = text || "";
  }

  /* ---------- network ---------- */
  function api(path, opts){
    opts = opts || {};
    var h = { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY };
    if(opts.headers) for(var k in opts.headers) h[k] = opts.headers[k];
    opts.headers = h;
    return fetch(REST + path, opts);
  }
  function loadSuggestions(){
    return api("/suggestions?select=*&order=score.desc.nullslast,created_at.desc")
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); });
  }
  function submit(payload){
    return api("/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify({
        title: payload.title,
        detail: payload.detail || null,
        author_name: payload.author_name || null
      })
    }).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); });
  }
  function castVote(suggestionId, value){
    // Votes are written through SECURITY DEFINER RPCs, not the votes table
    // directly: casting/changing a vote is an upsert, which under RLS would
    // require SELECT on votes (anon deliberately has none). The RPCs do the
    // upsert/delete server-side and keep individual votes unreadable.
    if(value === 0){
      return api("/rpc/remove_vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p_suggestion: suggestionId, p_voter: voterId })
      }).then(function(r){ if(!r.ok) throw new Error(r.status); });
    }
    return api("/rpc/cast_vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p_suggestion: suggestionId, p_voter: voterId, p_value: value })
    }).then(function(r){ if(!r.ok) throw new Error(r.status); });
  }

  /* ---------- rendering ---------- */
  function statusBadge(status){
    var map = { open:["Open","open"], planned:["Planned","planned"],
                in_progress:["In progress","in_progress"], shipped:["Shipped","shipped"],
                declined:["Not planned","declined"] };
    var s = map[status] || map.open;
    return '<span class="status-badge ' + s[1] + '">' + s[0] + '</span>';
  }
  function applyLocalDelta(s, from, to){
    if(from === 1)  s.upvotes   = Math.max(0, (s.upvotes||0)   - 1);
    if(from === -1) s.downvotes = Math.max(0, (s.downvotes||0) - 1);
    if(to === 1)    s.upvotes   = (s.upvotes||0)   + 1;
    if(to === -1)   s.downvotes = (s.downvotes||0) + 1;
    s.score = (s.upvotes||0) - (s.downvotes||0);
  }
  function card(s){
    var wrap = el("div","idea");

    var voteCol = el("div","vote");
    var up   = el("button","vbtn up","▲");   up.title = "Upvote";
    var sc   = el("div","vscore","0");
    var down = el("button","vbtn down","▼"); down.title = "Downvote";
    voteCol.appendChild(up); voteCol.appendChild(sc); voteCol.appendChild(down);

    var body = el("div","idea-body");
    body.appendChild(el("div","idea-head",
      statusBadge(s.status) + '<span class="idea-time">' + relTime(s.created_at) + '</span>'));
    body.appendChild(el("h3","idea-title", escapeHtml(s.title)));
    if(s.detail) body.appendChild(el("p","idea-detail", escapeHtml(s.detail)));
    var meta = el("div","idea-meta","");
    body.appendChild(meta);

    wrap.appendChild(voteCol); wrap.appendChild(body);

    function paintVoteState(){
      var mine = getVotes()[s.id] || 0;
      up.className   = "vbtn up"   + (mine === 1  ? " active" : "");
      down.className = "vbtn down" + (mine === -1 ? " active" : "");
      var net = (s.upvotes||0) - (s.downvotes||0);
      sc.textContent = (net > 0 ? "+" : "") + net;
      meta.innerHTML = "▲ " + (s.upvotes||0) + " · ▼ " + (s.downvotes||0) +
        (s.author_name ? ' · <span class="idea-author">' + escapeHtml(s.author_name) + "</span>" : "");
    }
    function clickVote(dir){
      return function(){
        if(!CONFIGURED || String(s.id).indexOf("tmp-") === 0) return;
        var cur = getVotes()[s.id] || 0;
        var next = (cur === dir) ? 0 : dir;   // click your current vote again = remove it
        applyLocalDelta(s, cur, next); setVote(s.id, next); paintVoteState();
        castVote(s.id, next).catch(function(){      // rollback if the server rejects
          applyLocalDelta(s, next, cur); setVote(s.id, cur); paintVoteState();
          toast("Vote failed — check your connection.");
        });
      };
    }
    up.onclick = clickVote(1);
    down.onclick = clickVote(-1);
    paintVoteState();
    return wrap;
  }
  function visible(){
    var list = DATA.slice();
    if(FILTER === "open")    list = list.filter(function(s){ return s.status==="open"||s.status==="planned"||s.status==="in_progress"; });
    else if(FILTER === "shipped") list = list.filter(function(s){ return s.status==="shipped"; });
    if(SORT === "new") list.sort(function(a,b){ return new Date(b.created_at) - new Date(a.created_at); });
    else list.sort(function(a,b){ return ((b.score||0)-(a.score||0)) || (new Date(b.created_at)-new Date(a.created_at)); });
    return list;
  }
  function render(){
    if(!boardEl) return;
    var list = visible();
    boardEl.innerHTML = "";
    if(!list.length){
      boardEl.appendChild(el("p","hint","No suggestions here yet — add the first one above."));
      return;
    }
    list.forEach(function(s){ boardEl.appendChild(card(s)); });
  }

  /* ---------- wiring ---------- */
  function wireTabs(){
    function group(id, attr, set){
      var g = document.getElementById(id);
      if(!g) return;
      [].forEach.call(g.children, function(t){
        t.onclick = function(){
          [].forEach.call(g.children, function(x){ x.classList.remove("active"); });
          t.classList.add("active");
          set(t.getAttribute(attr));
          render();
        };
      });
    }
    group("sort-tabs",   "data-sort",   function(v){ SORT = v; });
    group("filter-tabs", "data-filter", function(v){ FILTER = v; });
  }
  function wireForm(){
    var form = document.getElementById("suggest-form");
    if(!form) return;
    form.onsubmit = function(e){
      e.preventDefault();
      var title  = document.getElementById("s-title").value.trim();
      var detail = (document.getElementById("s-detail")||{}).value;
      detail = detail ? detail.trim() : "";
      var name   = (document.getElementById("s-name")||{}).value;
      name = name ? name.trim() : "";
      if(title.length < 3){ formMsg("Add a few more characters to your suggestion."); return; }
      if(!CONFIGURED){ formMsg("The board isn’t connected yet — please check back soon."); return; }

      var btn = document.getElementById("s-submit");
      btn.disabled = true; var label = btn.textContent; btn.textContent = "Submitting…";
      function done(){ btn.disabled = false; btn.textContent = label; }

      submit({ title:title, detail:detail, author_name:name }).then(function(rows){
        var row = (rows && rows[0]) || { id:"tmp-"+Date.now(), title:title, detail:detail,
          author_name:name, status:"open", upvotes:0, downvotes:0, score:0,
          created_at:new Date().toISOString() };
        DATA.unshift(row);
        form.reset();
        formMsg("Thanks! Your suggestion is live below. 🎉", true);
        SORT = "new";
        var st = document.getElementById("sort-tabs");
        if(st) [].forEach.call(st.children, function(x){ x.classList.toggle("active", x.getAttribute("data-sort")==="new"); });
        render();
        done();
      }).catch(function(){
        formMsg("Couldn’t submit just now — please try again in a moment.");
        done();
      });
    };
  }

  /* ---------- entry point ---------- */
  function mount(b){
    boardEl = b;
    voterId = getVoterId();
    wireForm();
    wireTabs();

    if(!CONFIGURED){
      if(boardEl){
        boardEl.innerHTML = "";
        boardEl.appendChild(el("div","intro",
          "<b>The board isn’t connected yet.</b><br>Once the free database keys are added, suggestions and voting go live right here. Everything else in the course works as normal in the meantime."));
      }
      return;
    }
    if(typeof fetch === "undefined"){
      boardEl.innerHTML = "";
      boardEl.appendChild(el("p","hint","Your browser is a little too old for the live board — but the course itself works fine."));
      return;
    }
    boardEl.innerHTML = '<p class="hint">Loading suggestions…</p>';
    loadSuggestions().then(function(rows){
      DATA = rows || [];
      render();
    }).catch(function(){
      boardEl.innerHTML = "";
      boardEl.appendChild(el("p","hint","Couldn’t load the board — check your connection and refresh."));
    });
  }

  return { mount: mount };
})();
