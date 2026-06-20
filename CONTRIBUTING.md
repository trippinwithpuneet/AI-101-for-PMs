# Contributing to AI 101 for PMs

Thank you for helping make this a better resource for product managers. This
course is meant to be forked, adapted, and improved by the community. Here's
how to contribute well.

## The golden rule: protect the quality bar

The audience is busy senior PMs who give the site about 90 seconds before
deciding whether it's worth their time. Every contribution should respect
that. We'd rather have 25 excellent concepts than 60 mediocre ones.

## How to contribute, by type

### Typo / clarity fixes → open a PR
Small wording, grammar, or clarity fixes are very welcome. Edit the relevant
object in `assets/js/concepts.js` (all concept text lives there) and open a
pull request. No issue needed.

### A better example or clearer widget → open a PR
If you can make a concept land faster — a sharper example, a more interactive
widget — open a PR. Keep the **four-part pattern** intact (core idea →
plain-English prose → interactive widget → PM takeaway → interview line).

### A new CORE concept → open an issue FIRST
New core concepts are added by **issue first**, then code. Use the
"Suggest a concept" issue template. We align on whether it belongs (is it
foundational, or just timely?) before anyone writes a widget. This keeps the
curriculum a textbook, not a pile.

## How the content is structured

- **`assets/js/concepts.js`** is the single source of truth for all 25 core
  concepts. A contributor with no other context can add a concept by copying
  one object and editing its fields. You should never have to hunt through HTML
  to change concept text.
- Each concept references a **widget by id** (the `widget` field). The widget
  itself is a small `(function(){…})()` block in the relevant
  `chapters/0N-*.html` file that draws into `#<widget>-mount`.
- Quizzes are generated from each concept's `quizQuestions`, so adding a
  concept automatically extends the chapter quiz and the revise/assess pages.

## Writing a good quiz question

This is where contributions most often go wrong, so please read this:

- Exactly **one defensible correct answer** and **three genuinely
  plausible-but-wrong** distractors. A distractor that's obviously silly
  teaches nothing.
- Test **product judgment**, not trivia. "Where do you debug a RAG failure
  first?" is good; "What year did transformers ship?" is not.
- One-sentence `explanation` that says *why* the answer is right.
- **Do not** generate quiz questions with an LLM and paste them unchecked —
  models are surprisingly bad at writing good distractors, and a bad quiz
  erodes trust faster than no quiz.

## Local development

There's no build step. It's plain HTML, CSS, and vanilla JavaScript.

```bash
# from the repo root, serve locally (any static server works)
python3 -m http.server 8000
# then open http://localhost:8000
```

You can also just open `index.html` directly in a browser — everything works
offline except the two embedded YouTube videos in Chapter 4.

## Style

- Vanilla JS only. No frameworks, no npm, no build step — that's a feature.
- Match the existing voice: plain English, no unexplained jargon, every card
  ends on a real PM-judgment payoff and a quotable interview line.
- Keep examples generic by default ("your delivery app"); mark domain-specific
  instances with the small "example" tag so they read as concrete, swappable
  illustrations.

By contributing, you agree your contributions (code and content) are offered
under the MIT License (see `LICENSE`).
