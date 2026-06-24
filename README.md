# AI 101 for PMs

An open-source, interactive course that teaches product managers how AI
actually works — enough to **spec**, **evaluate**, and **ship** AI features
with a real mental model instead of vibes.

Built for busy PMs: every concept is one plain-English explanation, one
interactive widget you can drag and click, the product-judgment takeaway, and
an interview-ready line. No math, no framework, no login.

> **Status:** v1.1.0 · last updated 2026-06-23 — 25 core concepts across 4
> chapters, three revise modes, a final assessment, and a community suggestion
> board. Dark mode by default with a light toggle.

## What's inside

- **25 core concepts** in 4 chapters:
  1. **ML Foundations** — neural nets, overfitting, gradient descent, loss
     curves, data splits, distribution shift, early stopping, hyperparameters,
     the pre-ship review.
  2. **How LLMs Work** — tokenisation, why LLMs can't count letters, context
     windows, attention, RAG, latency, embeddings, temperature, hallucination,
     inference, tool calling.
  3. **Evals, Safety & Cost** — evals, benchmarks & Goodhart's Law, the eval
     harness, AI safety & alignment, environmental impact at scale.
  4. **Watch & Apply** — two recommended talks + a cross-chapter capstone.
- **Interactive widgets** on every concept — drag a slider, flip a tab, step
  through a loop. The intuition lands because you played with it.
- **Three revise modes** — instant keyword lookup (deeplinkable, e.g.
  `revise.html#rag`), flashcards by chapter, and a shuffle-able run through all
  25 for interview prep.
- **A final assessment** with an optional shareable result.
- **Progress tracking** in your browser — resume where you left off, no login,
  no tracking. The course itself has no backend; progress is saved across
  sessions in `localStorage`.
- **Community suggestion board** (optional) — an anonymous up/down voting board
  for concept requests, backed by Supabase. It's the only networked feature
  besides the Chapter 4 videos; everything else works fully offline. Forking?
  Point it at your own Supabase project — see `supabase/schema.sql`.

## The throughline

One idea runs through the whole course: **never trust a single number until you
know what it was measured against, at every layer of the stack.** Chapter 1
applies it to data (validation, not training accuracy). Chapter 2 to generation
(retrieval quality, not model fluency). Chapter 3 to evaluation (the full
harness, not a single benchmark).

## Run it locally

No build step. Plain HTML, CSS, and vanilla JavaScript.

```bash
git clone https://github.com/trippinwithpuneet/AI-101-for-PMs.git
cd AI-101-for-PMs
python3 -m http.server 8000      # or any static server
# open http://localhost:8000
```

Or just open `index.html` in a browser. Everything works **offline** except the
Chapter 4 videos and the community board — the only networked features.

## Publish on GitHub Pages

1. Create a repo on your personal GitHub (e.g. `ai101-for-pms`) and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI 101 for PMs"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ai101-for-pms.git
   git push -u origin main
   ```
2. Repo → **Settings → Pages** → Source: **Deploy from a branch**, branch
   `main`, folder `/ (root)`. Save.
3. Your site goes live at `https://<your-username>.github.io/ai101-for-pms/`.

A custom domain can be added later; the free `*.github.io` URL is fine to
launch.

## Before you publish — fill in the placeholders

This repo is intentionally portable. Search for `<your-username>` and
`<Your Name>` and replace them:
- `LICENSE` — copyright holder name
- `README.md` — GitHub URLs / issue links
- `about.html` — author credit

```bash
grep -rn "your-username\|Your Name" .
```

## Project structure

```
index.html              Landing — why it matters, start, course map
chapters/               One page per chapter; widgets live here as IIFEs
revise.html             Three revise modes (lookup / by chapter / all)
assess.html             Final cross-chapter assessment
about.html              Author, contribution model, licences
community.html          Community suggestion board (Supabase-backed, optional)
assets/css/main.css     Theme (CSS variables; dark default + light; per-chapter accent)
assets/js/
  concepts.js           SINGLE SOURCE OF TRUTH — all 25 concepts as data
  helpers.js            el/cv/slider/tabs + card & quiz renderers + nav
  progress.js           localStorage progress, resume + reset
  revise.js             search index + flashcard logic
  community.js          Community board client (talks to Supabase REST)
supabase/schema.sql     Board database schema — tables, RLS, vote RPCs
```

To add or edit a concept, change one object in `assets/js/concepts.js` — the
chapter pages, revise modes, quizzes, and assessment all read from it.

## Tech choices (boring on purpose)

Plain HTML + CSS + vanilla JS. No React, no build, no npm. The audience is PMs
who should be able to fork and adapt this without learning a framework, and the
content is static. Progress lives in `localStorage` — that's a feature, not a
limitation: it removes every data-handling concern and makes the site safe to
share with anyone.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Typo and example fixes via PR; new core
concepts via issue first (to align before code). Please read the note on writing
good quiz questions.

## Licence

[MIT](LICENSE) — both the code and the course content. Fork it, adapt it, use it
however you like; just keep the copyright notice. Attribution is appreciated but
not required.

## Credits

Created by Puneet, distilled from a guided AI/ML learning series and built as a
resource for the PM community. Examples are grocery-delivery flavoured so the
concepts attach to something concrete — swap in your own domain when you
present.
