<div align="center">

# 🧠 AI 101 for PMs

### The fastest way for a product manager to go from AI vibes to AI fluency.

**[→ Open the course](https://trippinwithpuneet.github.io/AI-101-for-PMs/)** · No login · Works offline · Free forever

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/trippinwithpuneet/AI-101-for-PMs?style=social)](https://github.com/trippinwithpuneet/AI-101-for-PMs/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Version](https://img.shields.io/badge/version-v1.0.0-blue)](VERSION)

</div>

---

## The problem this solves

Two years ago, "AI PM" was a specialisation. Today it's closer to a baseline expectation.

Most PMs can *talk* about AI strategy in the abstract — but go quiet when a question gets concrete:

> *"Why did our model get worse after the last update?"*
> *"Why is this multilingual feature costing 3× more than expected?"*
> *"Why does it confidently make things up?"*

Those aren't engineering questions. They're product judgment calls dressed in technical vocabulary.

**This course closes that gap.** Not by turning you into an ML engineer — but by giving you the mental model you need to spec, evaluate, and ship AI features with confidence.

---

## What makes this different

| Other AI courses | AI 101 for PMs |
|---|---|
| Video lectures, passive watching | Interactive widgets you drag and click |
| Depth-first (math → applications) | PM-first (why it matters → how it works) |
| Designed for engineers | Designed for people in launch reviews |
| Login walls, email capture | Zero accounts, works offline |
| Built to sell you something | MIT open source, fork and adapt freely |

---

## What's inside

**25 core concepts across 4 chapters.** Every concept follows the same four-part pattern:

1. **Core idea** — one sentence, the key phrase bolded
2. **Plain-English explanation** — no math, no hand-waving
3. **Interactive widget** — drag a slider, flip a tab, step through a loop
4. **PM takeaway + interview line** — what to do with this, and what to say in a meeting

### Chapter 1 · ML Foundations *(9 concepts)*
Neural nets, overfitting, gradient descent, loss curves, data splits, distribution shift, early stopping, hyperparameters, the pre-ship review.

### Chapter 2 · How LLMs Work *(11 concepts)*
Tokenisation, why LLMs can't count letters, context windows, attention, RAG, latency, embeddings, temperature, hallucination, inference, tool calling.

### Chapter 3 · Evals, Safety & Cost *(5 concepts)*
Evals, benchmarks & Goodhart's Law, the eval harness, AI safety & alignment, environmental impact at scale.

### Chapter 4 · Watch & Apply
Two carefully chosen video talks (Karpathy + Stanford CS229) + a 10-question cross-chapter capstone that proves the model sticks.

**Plus:**
- **Revise** — instant keyword lookup (deeplinkable, e.g. `revise.html#rag`), flashcards by chapter, or a shuffle through all 25 for interview prep
- **Assess** — a final cross-chapter assessment with a shareable result
- **Progress tracking** — stored in your browser, no login, no backend, no analytics

---

## The throughline

One idea runs through the entire course:

> **Never trust a single number until you know what it was measured against — at every layer of the stack.**

- **Chapter 1 — Data:** is that training accuracy or validation accuracy?
- **Chapter 2 — Generation:** was this grounded in retrieved evidence or recalled from memory?
- **Chapter 3 — Evaluation:** measured on your own data, or one public benchmark?

Every concept in this course is a mechanism that explains *why* one of those three holds.

---

## Start in 30 seconds

**Option A — use the live site:**
[trippinwithpuneet.github.io/AI-101-for-PMs](https://trippinwithpuneet.github.io/AI-101-for-PMs/)

**Option B — run locally (no build step):**
```bash
git clone https://github.com/trippinwithpuneet/AI-101-for-PMs.git
cd AI-101-for-PMs
python3 -m http.server 8000
# open http://localhost:8000
```

**Option C — just open `index.html` in a browser.** Everything works offline except the two embedded YouTube videos in Chapter 4.

---

## Fork it for your team

This repo is intentionally portable and MIT-licensed. Fork it, white-label it, swap the grocery-delivery examples for your own domain, and share it with your team.

```bash
# 1. Fork on GitHub (button at the top of this page)
# 2. Clone your fork
git clone https://github.com/<your-username>/AI-101-for-PMs.git

# 3. To publish on GitHub Pages:
#    Repo → Settings → Pages → Source: Deploy from branch: main / (root)
#    Your site: https://<your-username>.github.io/AI-101-for-PMs/
```

**To customise content:** every concept lives as a single object in `assets/js/concepts.js`. Change one object and the chapter page, revise modes, quizzes, and assessment all update automatically.

---

## Project structure

```
index.html              Landing — why it matters, start, course map
chapters/               One page per chapter; widgets live here as IIFEs
revise.html             Three revise modes (lookup / by chapter / all)
assess.html             Final cross-chapter assessment
about.html              Author, contribution model, licences
assets/css/main.css     Theme (CSS variables; dark default + light; per-chapter accent)
assets/js/
  concepts.js           ← SINGLE SOURCE OF TRUTH — all 25 concepts as data
  helpers.js            el/cv/slider/tabs + card & quiz renderers + nav
  progress.js           localStorage progress, resume + reset
  revise.js             search index + flashcard logic
```

**Tech choices (boring on purpose):** Plain HTML + CSS + vanilla JS. No React, no build step, no npm. The audience is PMs who shouldn't need to learn a framework to fork and adapt a course.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

**Quick summary:**
- **Typo / clarity fix** → open a PR (edit the concept in `assets/js/concepts.js`)
- **Better example or widget** → open a PR, keep the four-part pattern
- **New core concept** → open an issue first using the "Suggest a concept" template

> The bar is deliberately high: 25 excellent concepts beats 60 mediocre ones. The audience is busy PMs who give a resource 90 seconds before deciding if it's worth their time.

---

## Licence

[MIT](LICENSE) — code and content. Fork it, adapt it, use it however you like; just keep the copyright notice.

---

<div align="center">

**If this helped you — or someone on your team — [⭐ star the repo](https://github.com/trippinwithpuneet/AI-101-for-PMs). It's the best way to help more PMs find it.**

Created by [Puneet](https://github.com/trippinwithpuneet) · distilled from a guided AI/ML learning series · built for the PM community

</div>
