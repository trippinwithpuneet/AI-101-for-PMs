/* ============================================================
   concepts.js — SINGLE SOURCE OF TRUTH for all 25 concepts.
   Every chapter page, the revise modes, and the assessment read
   from this array. To add or edit a concept, copy one object and
   change the fields — no HTML hunting required.

   Schema per concept:
     id            kebab-case, used for deeplinks (revise.html#id)
     chapter       1-4
     order         order within the chapter
     title         display title
     coreIdea      one-sentence core idea (HTML; bold the key phrase)
     prose         array of plain-English paragraphs (HTML)
     widget        mount id base; the widget draws into "#<widget>-mount"
     vizTitle      label shown above the interactive
     vizHint       one-line hint under the interactive
     pmTakeaway    the product-judgment payoff (HTML)
     interviewLine one quotable interview-ready sentence
     quizQuestions [{ q, options[4], correctIndex, explanation }]
     tags          keywords for revise search
   ============================================================ */
window.CONCEPTS = [
  {
    id: 'neural-networks', chapter: 1, order: 1, title: 'Neural networks',
    coreIdea: `A neural network does one thing: <b>take some input and produce a correct output, by learning from examples.</b>`,
    prose: [
      `Forget the brain metaphors and the matrix math. Picture a problem you already understand: <span class="eg-tag">Zepto example</span> <em>will this order be delivered late?</em> You feed in a few <b>inputs</b> (called features) — distance to the store, number of items, current rider load, time of day. Each input is multiplied by a <b>weight</b> — a number that says how much that input matters — and the results are added up into a single prediction.`,
      `Nobody sets those weights by hand. The network starts with random weights, makes terrible predictions, compares them to what actually happened, and nudges the weights to be slightly less wrong. Do that across millions of past examples and the weights settle into values that capture the real pattern. <b>That set of learned numbers is the model.</b>`
    ],
    widget: 'nn',
    vizTitle: 'Interactive: a one-neuron delivery-delay predictor',
    vizHint: `Drag each weight and watch the prediction move. The whole of "training" is a machine doing exactly this, automatically, to make the prediction match reality.`,
    pmTakeaway: `A model is not magic — it's a pile of learned weights mapping inputs to an output. If you can name the inputs and the output, you can reason about the model.`,
    interviewLine: `A neural network is a function that learns its own coefficients from examples — the "intelligence" is just the weights it settled on during training.`,
    quizQuestions: [{
      q: `A teammate calls the model "intelligent." Concretely, what is a trained model?`,
      options: [`A set of hand-written rules an engineer maintains`, `A pile of weights learned from examples that maps inputs to an output`, `A database of every past case it looks up at prediction time`, `A compressed copy of the training data`],
      correctIndex: 1,
      explanation: `A model is just the learned weights mapping inputs to an output — name the inputs and output and you can reason about it.`
    }],
    tags: ['weights','features','prediction','foundations']
  }
  ,{
    id: 'overfitting', chapter: 1, order: 2, title: 'Overfitting',
    coreIdea: `An overfit model has <b>memorised the training data instead of learning the real pattern.</b> It looks brilliant on examples it has seen and falls apart on new ones.`,
    prose: [
      `Imagine a delivery-time model that "learns" that orders from one specific building are always 4 minutes late — because in the training data, they happened to be. That's not a pattern, it's a coincidence it memorised. In the real world it misfires constantly.`,
      `The opposite failure is <b>underfitting</b>: the model is too simple to capture the pattern at all (a straight line through clearly curved data). The goal is the middle — a "good fit" that captures the trend without chasing every random wiggle.`
    ],
    widget: 'overfit',
    vizTitle: 'Interactive: underfit → good fit → overfit on the same points',
    vizHint: `Toggle the three fits over one fixed set of points. Overfit threads every dot perfectly — and that's exactly why it will fail on the next one.`,
    pmTakeaway: `Whenever someone shows you an accuracy number, your first question is <b>"Is that training accuracy or validation accuracy?"</b> Training-only accuracy tells you nothing about the real world.`,
    interviewLine: `High training accuracy with low validation accuracy is the signature of overfitting — the model memorised rather than generalised.`,
    quizQuestions: [{
      q: `Someone shows you "98% accuracy." What's your sharpest first question?`,
      options: [`"Can we push it to 99%?"`, `"Is that training accuracy or validation accuracy?"`, `"How big is the model?"`, `"What hardware trained it?"`],
      correctIndex: 1,
      explanation: `Training-only accuracy says nothing about new data; high train with low validation is the signature of overfitting.`
    }],
    tags: ['generalisation','memorisation','validation','underfitting']
  }
  ,{
    id: 'gradient-descent', chapter: 1, order: 3, title: 'Gradient descent',
    coreIdea: `Gradient descent is <b>how the network figures out which direction to nudge its weights to get less wrong.</b> The intimidating name hides a simple picture: rolling downhill.`,
    prose: [
      `Picture the model's error as a hilly landscape. High ground = lots of error; the valley floor = least error. The model is a ball: it feels the slope under it and rolls downhill. Steep slope → big step. Gentle slope near the bottom → tiny steps. When it reaches the valley, training is done.`,
      `The <b>learning rate</b> is the step size. Too big and the ball overshoots and bounces around chaotically — engineers call this "training is diverging." Too small and it crawls and takes forever. The whole craft of tuning is finding the middle.`
    ],
    widget: 'gd',
    vizTitle: 'Interactive: roll the ball, then break it with the learning rate',
    vizHint: `Roll it once at a sane rate. Then crank the learning rate to max and watch it bounce and never settle — that's divergence.`,
    pmTakeaway: `Translate the jargon instantly — <em>"not converging"</em> = the ball never found the valley; <em>"tuning the learning rate"</em> = trying different step sizes; <em>"stuck in a local minimum"</em> = settled in a shallow dip instead of the deepest point.`,
    interviewLine: `Gradient descent minimises a loss function by stepping downhill; the learning rate sets the step size, and getting it wrong is the difference between divergence and glacial training.`,
    quizQuestions: [{
      q: `An engineer says "training is diverging." In plain terms?`,
      options: [`The model found the global minimum`, `The learning-rate step is too large, so it overshoots and never settles`, `The dataset is too small`, `The model is overfitting`],
      correctIndex: 1,
      explanation: `Diverging = the ball never finds the valley because the learning-rate step size is too big.`
    }],
    tags: ['learning-rate','optimisation','convergence','loss']
  }
  ,{
    id: 'loss-curves', chapter: 1, order: 4, title: 'Loss curves',
    coreIdea: `A loss curve is the <b>vital-signs monitor for a training run.</b> The trick: there are always <b>two lines</b> — training loss and validation loss — and the relationship between them tells you almost everything.`,
    prose: [
      `"Loss" is just a number for how wrong the model is; lower is better. As training proceeds, you plot loss over time. A <b>healthy</b> run shows both lines falling together and staying close.`,
      `<b>Overfitting</b> shows training loss still dropping while validation loss turns and climbs — the two lines visibly pull apart. The exact point they separate is where the model stopped generalising and started memorising.`
    ],
    widget: 'loss',
    vizTitle: 'Interactive: four training stories, one chart',
    vizHint: `Flip between "Healthy" and "Overfitting" — the divergence of the two lines is unmistakable once you've seen it.`,
    pmTakeaway: `Most people ask for accuracy. Ask instead: <b>"Can you show me training and validation loss plotted together?"</b> The final headline number can hide a problem only the curve reveals.`,
    interviewLine: `The moment training and validation loss diverge is the moment overfitting begins — and it's exactly the signal early stopping watches for.`,
    quizQuestions: [{
      q: `Instead of a single accuracy number, what should you ask to see?`,
      options: [`Just the final epoch's accuracy`, `Training and validation loss plotted together`, `The model's parameter count`, `GPU utilisation during training`],
      correctIndex: 1,
      explanation: `The headline number can hide a problem only the two-line curve reveals — diverging train/val loss means overfitting.`
    }],
    tags: ['loss','training','validation','overfitting','monitoring']
  }
  ,{
    id: 'train-val-test-split', chapter: 1, order: 5, title: 'Train / validation / test split',
    coreIdea: `You <b>deliberately hide some of your data from the model</b> so you can honestly measure how good it really is.`,
    prose: [
      `<span class="eg-tag">Zepto example</span> Take 1 million orders and split before training anything: <b>Training (~70%)</b> — the model studies this; weights adjust from it (textbooks &amp; homework). <b>Validation (~15%)</b> — checked during training to tune the model; never trained on (practice exams). <b>Test (~15%)</b> — locked away, opened once for the final honest score (the sealed final exam).`,
      `<b>Why three piles and not two?</b> With just train+test, you check the test score, tweak, check again… 40 times over 3 weeks. Every peek leaks information into your choices — you've been quietly teaching to the test. You ship "82% accuracy"; production is 67%. That gap is <b>data leakage</b>. The validation set is a buffer that absorbs all that iteration so the test set stays a true blind exam.`
    ],
    widget: 'split',
    vizTitle: 'Interactive: the split, and how peeking poisons the test set',
    vizHint: `Slide the ratios, then run the "peek" simulation to watch a clean test score rot into pure illusion.`,
    pmTakeaway: `The four traps: (1) accuracy reported without saying which set; (2) test set evaluated more than once; (3) split not representative of who you'll actually serve; (4) the same user or future data leaking across sets.`,
    interviewLine: `The gap between test accuracy and production performance is the model's hidden debt — a well-built split predicts it honestly; a sloppy one hides it until after you ship.`,
    quizQuestions: [{
      q: `Why use three splits (train/val/test) instead of two?`,
      options: [`Three is a compliance minimum`, `The validation set absorbs the iteration so the test set stays a true blind exam`, `Test sets are too small to train on`, `It makes training faster`],
      correctIndex: 1,
      explanation: `Repeatedly tuning against the test set leaks information; validation buffers that iteration so test stays an honest blind exam.`
    }],
    tags: ['data-split','data-leakage','validation','test-set']
  }
  ,{
    id: 'distribution-shift', chapter: 1, order: 6, title: 'Distribution shift',
    coreIdea: `The <b>world the model learned from is different from the world it's now asked to predict.</b> Its weights were frozen at training time; reality kept moving.`,
    prose: [
      `<span class="eg-tag">Zepto example</span> A model trained on Mumbai ordering behaviour Jan–June looks great — until a festival, a new city launch, or a new product category changes who's ordering and what they want. The model isn't broken; the ground shifted under it.`,
      `Two flavours worth distinguishing: <b>covariate shift</b> (the inputs change — often fixable by adding representative training data) and <b>concept drift</b> (the underlying truth changes — old data is now actively misleading, not just insufficient).`
    ],
    widget: 'dshift',
    vizTitle: 'Interactive: when the two worlds stop overlapping',
    vizHint: `Slide the production world away from the training world and watch the model's reliable zone shrink to where the curves still overlap.`,
    pmTakeaway: `Distribution shift almost always rides in on a business event you already know about — a city launch, a festival, a new category, an IPO bringing a new user cohort. Read your own roadmap and ask <em>"which of these breaks our models, and when?"</em>`,
    interviewLine: `The strong move is proactive monitoring tied to roadmap events, not reactive debugging after the model silently degrades in production.`,
    quizQuestions: [{
      q: `A model's accuracy silently drops in production after a festival. Most likely cause?`,
      options: [`A code bug`, `Distribution shift — the world changed from what the model trained on`, `The model is too small`, `The learning rate was wrong`],
      correctIndex: 1,
      explanation: `The model isn't broken; the ground shifted. Distribution shift usually rides in on a known business event.`
    }],
    tags: ['distribution-shift','concept-drift','monitoring','production']
  }
  ,{
    id: 'early-stopping', chapter: 1, order: 7, title: 'Early stopping',
    coreIdea: `Stop training <b>the moment the model stops getting better on data it hasn't seen</b> — even if it's still improving on training data. More training is not always better.`,
    prose: [
      `This is the practical mechanism that catches overfitting as it happens. You watch the validation loss curve; when it stops falling and starts to creep up, you pull the brakes and keep the best checkpoint. Past that point, extra training actively makes the model worse in production while wasting compute.`,
      `The one knob is <b>patience</b>: how many epochs of no improvement you tolerate before stopping. Too little and you quit during a temporary plateau; too much and you've effectively disabled it. What counts as acceptable patience is partly a <em>product</em> call — it trades compute budget and iteration speed.`
    ],
    widget: 'earlystop',
    vizTitle: 'Interactive: where the brakes fire, and what you\'d waste without them',
    vizHint: `Push complexity up and dataset size down — watch the curves diverge early and a long tail of epochs get wasted.`,
    pmTakeaway: `Early stopping, overfitting, and loss curves are one story from three angles. The single question that covers all of Week 1 at once: <b>"Can you show me the validation loss curve, and which checkpoint are we actually shipping?"</b>`,
    interviewLine: `Early stopping ships the checkpoint at minimum validation loss, not the last one — the extra epochs after that point buy training accuracy at the cost of generalisation.`,
    quizQuestions: [{
      q: `Early stopping ships which checkpoint?`,
      options: [`The final epoch's checkpoint`, `The checkpoint at minimum validation loss`, `The one with highest training accuracy`, `A random middle checkpoint`],
      correctIndex: 1,
      explanation: `Training past minimum val loss buys train accuracy at the cost of generalisation; ship the best-val checkpoint.`
    }],
    tags: ['early-stopping','patience','overfitting','checkpoint']
  }
  ,{
    id: 'hyperparameters', chapter: 1, order: 8, title: 'Hyperparameters vs parameters',
    coreIdea: `<b>Parameters</b> are what the model learns on its own during training (the weights). <b>Hyperparameters</b> are the settings <em>you</em> choose before training starts that control how that learning happens.`,
    prose: [
      `Both are called "parameters," which is the whole source of confusion — but they're set by different people, at different times. Parameters: learned, automatic, millions of them. Hyperparameters: chosen, manual, a handful.`,
      `The big ones you'll hear: <b>learning rate</b> (step size), <b>epochs</b> (how many passes — what early stopping monitors), <b>depth</b> (how many layers), <b>batch size</b> (how smooth the loss curve looks), and <b>dropout</b> (randomly switching off neurons during training — sounds destructive, but it forces the model to generalise instead of memorise).`
    ],
    widget: 'hparams',
    vizTitle: 'Interactive: turn the knobs, watch the curves respond',
    vizHint: `Max learning rate + deep network → chaos. Then drop the rate, shrink depth, add dropout 0.5 → everything stabilises. That's what tuning feels like.`,
    pmTakeaway: `Asked "how would you improve an underperforming model?", don't jump to "more data / bigger model." Say: <b>"First, has hyperparameter tuning been fully explored on the current architecture?"</b> It's the cheapest lever before expensive ones like retraining or changing the model.`,
    interviewLine: `Parameters are learned; hyperparameters are chosen. Tuning hyperparameters is the cheapest improvement lever — exhaust it before reaching for more data or a new architecture.`,
    quizQuestions: [{
      q: `Asked to improve an underperforming model, the cheapest lever to try first is:`,
      options: [`Collect much more data`, `Train a bigger model from scratch`, `Tune hyperparameters on the current architecture`, `Switch cloud providers`],
      correctIndex: 2,
      explanation: `Hyperparameter tuning is the cheapest improvement lever — exhaust it before expensive moves like more data or a new architecture.`
    }],
    tags: ['hyperparameters','dropout','tuning','learning-rate','epochs']
  }
  ,{
    id: 'pre-ship-review', chapter: 1, order: 9, title: 'The pre-ship model review',
    coreIdea: `The highest-leverage thing an AI PM does — and the one most skip. <b>A single headline accuracy number can hide every failure mode in Week 1.</b>`,
    prose: [
      `This concept ties the chapter together into a checklist you can actually run in a launch review. Tick each item as the team answers; the red flags are the answers that should make you pause.`,
      `The five questions to memorise: (1) <em>Show me training &amp; validation loss; which checkpoint ships?</em> (2) <em>How was the data split, and was the test set touched more than once?</em> (3) <em>How does it perform per segment, not just overall?</em> (4) <em>Is the test set representative of who we'll actually serve?</em> (5) <em>What's the plan when it fails in production?</em>`
    ],
    widget: 'preship',
    vizTitle: 'Interactive: a pre-ship checklist with a live verdict',
    vizHint: `Answer each item honestly — the verdict updates as you go. Any unchecked critical item should block the launch.`,
    pmTakeaway: `Run this in every model launch review. Each item maps to a Week 1 failure mode; an unchecked box is a hidden risk a headline accuracy number is papering over.`,
    interviewLine: `Approving a model on a single accuracy number is how you ship its hidden failure modes — the review's job is to make each of those modes answer for itself before launch.`,
    quizQuestions: [{
      q: `Which question best protects a launch from hidden failure modes?`,
      options: [`"What's the overall accuracy?"`, `"How does it perform per segment, not just overall?"`, `"How long did training take?"`, `"Which framework did you use?"`],
      correctIndex: 1,
      explanation: `A single global number can hide a broken cohort; per-segment performance surfaces it before launch.`
    }],
    tags: ['review','launch','checklist','segments','rollback']
  }
  ,{
    id: 'tokenisation', chapter: 2, order: 1, title: 'Tokenisation',
    coreIdea: `<b>LLMs don't read text — they read numbers.</b> Tokenisation is the conversion between the two, and how it chops text up has real consequences for behaviour and cost.`,
    prose: [
      `Before a model sees your prompt, it's broken into <b>tokens</b> — chunks that are often whole words, sometimes word-pieces, sometimes single characters. Each token maps to a number. Common English words are usually one efficient token. Rarer strings get shattered into several.`,
      `"strawberry" arrives as a single chunk; the model never sees the individual letters. Non-English scripts fragment far more — the same sentence in Hindi can cost two to three times the tokens of its English equivalent.`
    ],
    widget: 'tok',
    vizTitle: 'Interactive: watch text become tokens',
    vizHint: `Try the English preset, then the Hindi one — same meaning, far more tokens. That gap is a real budget line item.`,
    pmTakeaway: `Three consequences: (1) Indian languages cost 2–3× more tokens than English for the same message — at scale, a budget line, not a footnote. (2) "Write exactly 100 words" is unreliable — the model counts tokens, not words; constrain with structure ("3 bullets"). (3) Never let the LLM do financial math — compute the price in your backend and inject the number.`,
    interviewLine: `Token efficiency is language-dependent and directly drives cost and latency — multilingual features need a token budget, not just a feature spec.`,
    quizQuestions: [{
      q: `Why does the same message cost 2–3× more in Hindi than English?`,
      options: [`Hindi text is always longer in characters`, `Non-English text fragments into many more tokens, and you pay per token`, `The model translates internally, doubling cost`, `Hindi needs a bigger model`],
      correctIndex: 1,
      explanation: `Token efficiency is language-dependent; multilingual features need a token budget, not just a feature spec.`
    }],
    tags: ['tokens','cost','multilingual','encoding']
  }
  ,{
    id: 'counting-letters', chapter: 2, order: 2, title: "Why LLMs can't count letters",
    coreIdea: `The model <b>never sees the letters</b> — it sees a single token chunk. You can't count the parts of something you never broke apart.`,
    prose: [
      `"How many r's in strawberry?" trips up LLMs because "strawberry" is one token — an indivisible unit to the model. Counterintuitively, a word that <em>splits</em> into more tokens (like "Mississippi") is easier for the model to reason about, because there are seams to count along.`,
      `Rare words fragment too: <span class="eg-tag">Zepto example</span> "Zepto" becomes roughly "Z" + "ept" + "o", because it wasn't common in training data — which is also why brand names and Indian city names tend to be token-expensive and handled less reliably.`
    ],
    widget: 'count',
    vizTitle: 'Interactive: can the model count this word\'s letters?',
    vizHint: `Try "Mississippi" (splits → green) then "strawberry" (one token → red). The indicator is about token seams, not difficulty.`,
    pmTakeaway: `This failure is <b>architectural, not a knowledge gap</b> — you can't fix it with better training data, because there are no letters to count. The fix is always <b>tool use</b>: let the model write code that iterates over characters and run it.`,
    interviewLine: `Character-level tasks fail because the model operates on tokens, never sub-token symbols — the correct fix is tool use, not more training.`,
    quizQuestions: [{
      q: `An LLM keeps miscounting the r's in "strawberry." The right fix?`,
      options: [`Add more training data with spelled-out words`, `Use a bigger model`, `Give it a tool to run code that iterates over characters`, `Lower the temperature`],
      correctIndex: 2,
      explanation: `The failure is architectural — it never sees letters, only a token. The fix is tool use, not more training.`
    }],
    tags: ['tokens','tool-use','architecture','limitations']
  }
  ,{
    id: 'context-window', chapter: 2, order: 3, title: 'Context window &amp; lost-in-the-middle',
    coreIdea: `A context window is <b>how much text the model can see at once</b>. Lost-in-the-middle is the finding that the model pays <b>less attention to information buried in the middle</b> of that window than to information at the start or end.`,
    prose: [
      `"200K token context window" sounds like "perfect recall of everything in there." It isn't. Put the critical fact at the very start or end and the model reliably uses it; bury it in the middle of a long document and accuracy measurably dips.`,
      `The bigger the window you actually fill, the worse the middle gets. "Dump everything in and let the model sort it out" is exactly where this bites — the disciplined alternative is to retrieve only the few relevant pieces.`
    ],
    widget: 'ctxwin',
    vizTitle: 'Interactive: move a fact through the window and watch recall',
    vizHint: `Drag the fact's position from start to end — accuracy sags in the middle and recovers at the edges. Push length up and the dip deepens.`,
    pmTakeaway: `A bigger context window is <b>not</b> automatically a better product decision. The disciplined alternative is RAG: retrieve only the few relevant pieces instead of stuffing the whole window.`,
    interviewLine: `A large context window is a ceiling on what the model can see, not a guarantee of how well it uses everything inside that ceiling.`,
    quizQuestions: [{
      q: `"Lost in the middle" means:`,
      options: [`The model forgets the start of a conversation`, `The model uses info at the start/end of a long context more reliably than info buried in the middle`, `Long documents crash the model`, `The middle of training is wasted`],
      correctIndex: 1,
      explanation: `A large context window is a ceiling on what the model can see, not a guarantee it uses the middle well.`
    }],
    tags: ['context-window','lost-in-the-middle','recall','rag']
  }
  ,{
    id: 'transformers-attention', chapter: 2, order: 4, title: 'Transformers &amp; attention',
    coreIdea: `The transformer's breakthrough: <b>every word can directly look at every other word at the same time</b>, instead of reading one word at a time like the older models (RNNs) it replaced.`,
    prose: [
      `"Attention" means each token can reach across the sentence and pull in whatever else is relevant — directly, with no information decay from passing through the words in between. In <em>"The customer cancelled the order because it was late,"</em> the word "it" can connect straight to "order" eleven words back.`,
      `Models like Claude and GPT are <b>decoder-only</b> — one mechanism producing one token at a time, only ever looking backward at what it's already written. That's <em>why responses stream in word by word</em> — it's not a UI choice, it's how the model works.`
    ],
    widget: 'attn',
    vizTitle: 'Interactive: click a word, see what it attends to',
    vizHint: `Click "it" and watch it light up "order" across the gap. That single connection is the whole breakthrough.`,
    pmTakeaway: `Attention cost scales <b>quadratically</b> with context length — that's the real, unglamorous reason huge context windows are expensive (a compute cost, not a pricing whim), and part of why lost-in-the-middle exists.`,
    interviewLine: `Transformers replaced RNNs because attention gives every token a direct connection to every other one — but that all-pairs attention scales quadratically, which is the true cost driver behind long context.`,
    quizQuestions: [{
      q: `What's the real reason very long context windows are expensive?`,
      options: [`Storage costs for the text`, `Attention cost scales quadratically with context length`, `Longer prompts need bigger models`, `Per-token licensing fees`],
      correctIndex: 1,
      explanation: `All-pairs attention scales quadratically — that compute cost is the true driver behind long-context pricing.`
    }],
    tags: ['transformers','attention','rnn','decoder-only','cost']
  }
  ,{
    id: 'rag', chapter: 2, order: 5, title: 'RAG — retrieval-augmented generation',
    coreIdea: `Before the LLM answers, <b>first fetch the specific relevant facts from a real source and hand them to the model along with the question</b> — so it answers from evidence, not memory.`,
    prose: [
      `The model isn't searching your whole knowledge base live. A retrieval step pulls a handful of relevant chunks, and the model is handed a small pre-filtered packet and told to answer only from that. Everything else in your knowledge base simply doesn't exist for that call.`,
      `This is the deployed answer to hallucination: the model still just predicts plausible text, but now that text is grounded in real evidence you supplied. It's also the disciplined fix for the context-window problem — retrieve the 3 relevant paragraphs instead of dumping 50 pages.`
    ],
    widget: 'rag',
    vizTitle: 'Interactive: ask a question, see what gets retrieved and handed over',
    vizHint: `Pick a question and watch which chunks rank highest — then read the "what the model actually receives" box. That packet is the model's entire world for this answer.`,
    pmTakeaway: `The key debugging judgment: <b>most RAG failures are retrieval failures, not generation failures.</b> When the answer is wrong, check whether the search fetched the right chunks before you touch the prompt.`,
    interviewLine: `RAG grounds generation in retrieved evidence — so when a RAG feature is wrong, the first suspect is retrieval quality, not the LLM.`,
    quizQuestions: [{
      q: `A RAG support feature returns wrong answers. Where do you debug first?`,
      options: [`Lower the LLM temperature`, `Check whether retrieval fetched the right chunks`, `Switch to a more capable LLM`, `Increase the context window`],
      correctIndex: 1,
      explanation: `Most RAG failures are retrieval failures — the model answers from whatever chunks it was handed.`
    }],
    tags: ['rag','retrieval','grounding','hallucination','context']
  }
  ,{
    id: 'output-latency', chapter: 2, order: 6, title: 'Output latency',
    coreIdea: `Every token requires a <b>full forward pass through the entire model</b>, and that pass can't start until the previous token exists. So output length and latency are <b>mechanically tied</b>, not just correlated.`,
    prose: [
      `The whole prompt (input) gets processed in one parallel pass — fast, and barely sensitive to length. But generation is sequential: token 50 genuinely cannot exist before token 49. The rate (tokens/sec) stays roughly flat; total time is just rate × number of tokens.`,
      `This isn't an infra problem better hardware will erase — it's baked into the decoder-only, autoregressive architecture. To cut latency, <b>trimming output beats trimming the prompt</b> by a wide margin.`
    ],
    widget: 'latency',
    vizTitle: 'Interactive: short vs long generation, and where the time goes',
    vizHint: `Generate a short then a long response — tokens/sec stays flat, only the count changes. The chart shows input (flat) vs output (steep) time.`,
    pmTakeaway: `<b>Streaming is a perception hack, not a speed hack</b> — total time is identical, but showing tokens as they're produced feels dramatically faster than a blank spinner. It's one of the cheapest, highest-leverage UX decisions in any LLM product.`,
    interviewLine: `Latency scales with output tokens, not prompt tokens, because generation is autoregressive — so the highest-leverage moves are shorter outputs and streaming for perceived speed.`,
    quizQuestions: [{
      q: `To reduce perceived latency cheaply, the highest-leverage move is:`,
      options: [`Trimming the prompt`, `Streaming tokens as they're produced`, `Buying faster storage`, `Reducing temperature`],
      correctIndex: 1,
      explanation: `Latency scales with output tokens; streaming doesn't cut total time but feels dramatically faster than a spinner.`
    }],
    tags: ['latency','streaming','autoregressive','ux','performance']
  }
  ,{
    id: 'embeddings', chapter: 2, order: 7, title: 'Embeddings',
    coreIdea: `An embedding is a <b>list of numbers that represents the meaning</b> of a word, sentence, or document — built so that things with similar meaning end up with similar numbers.`,
    prose: [
      `"reorder" and "repurchase" share almost no letters but land numerically close, because they mean nearly the same thing; "banana" lands far away. Real embeddings are 256–1536 numbers long, each a learned "dimension" of meaning. This is the same idea as the weights from Week 1: numbers learned through training that encode something useful.`,
      `This is the engine behind RAG's retrieval: embed the question and the documents, then find the documents whose embeddings sit closest. <span class="eg-tag">Zepto example</span> "milk went bad, want money back" matches your "Return Policy — Perishables" doc despite sharing almost no words — that's <b>semantic search</b>, and it beats keyword search for messy real-world queries.`
    ],
    widget: 'embed',
    vizTitle: 'Interactive: meaning as position in space',
    vizHint: `Pick a query phrase and watch the closest items light up by meaning, not spelling — e.g. "something to make tea" pulls milk, sugar, ginger, tea leaves.`,
    pmTakeaway: `Embedding quality directly sets RAG quality — a generic model that doesn't understand grocery jargon or Hindi/Tamil nuance gives mediocre retrieval no matter how good the LLM is. Ask: <b>"What embedding model are we using, and was it evaluated on language like ours?"</b>`,
    interviewLine: `Embeddings turn meaning into geometry — similar meanings sit close together — which is what makes semantic search and RAG retrieval possible in the first place.`,
    quizQuestions: [{
      q: `What single question best predicts a RAG system's retrieval quality?`,
      options: [`"How big is the LLM?"`, `"What embedding model are we using, and was it evaluated on language like ours?"`, `"What's the temperature?"`, `"How many GPUs do we have?"`],
      correctIndex: 1,
      explanation: `Embedding quality sets retrieval quality; a generic model on grocery jargon or Indic languages retrieves poorly regardless of the LLM.`
    }],
    tags: ['embeddings','semantic-search','retrieval','meaning','rag']
  }
  ,{
    id: 'temperature-sampling', chapter: 2, order: 8, title: 'Temperature &amp; sampling',
    coreIdea: `At each step the model doesn't pick a word — it produces a <b>probability for every possible next token</b>. Temperature is the knob that controls how boldly it chooses from that list.`,
    prose: [
      `After all the attention machinery, the model's real output is a ranked list of candidate next tokens with probabilities. <b>Temperature</b> reshapes that list before a token is sampled. Low temperature (toward 0) makes it almost always take the top choice: consistent, predictable, a little bland. High temperature (above 1) flattens the list so unlikely tokens get a real chance: more varied and creative, but more prone to drift and error.`,
      `It's exactly the kind of <em>hyperparameter</em> from Week 1 — a dial you set, not something the model learns. Related dials: <b>top-p</b> (nucleus) and <b>top-k</b> trim the candidate pool to the most probable tokens before sampling.`
    ],
    widget: 'temp',
    vizTitle: 'Interactive: reshape the next-token distribution',
    vizHint: `Drag temperature toward 0 and one bar dominates (same answer every time). Push it high and the bars flatten. Hit "Sample 10x" to feel consistency vs variety.`,
    pmTakeaway: `Temperature is a product decision, not a default. Factual support, extraction, classification, and code → <b>low</b> temperature. Brainstorming, copy, names, variety → <b>higher</b>. If users say "it gives a different answer every time," your temperature is above 0.`,
    interviewLine: `Temperature rescales the next-token probability distribution before sampling — low for deterministic, factual work; high for creative variety. It trades consistency against diversity.`,
    quizQuestions: [{
      q: `Users say a factual-extraction feature "gives a different answer every time." What's wrong?`,
      options: [`The model is broken`, `Temperature is set above 0 for a task that needs determinism`, `The context window is too small`, `Retrieval is failing`],
      correctIndex: 1,
      explanation: `Temperature trades consistency for variety; factual/extraction/code tasks want low temperature.`
    }],
    tags: ['temperature','sampling','top-p','top-k','determinism']
  }
  ,{
    id: 'hallucination', chapter: 2, order: 9, title: 'Why LLMs hallucinate',
    coreIdea: `An LLM generates the <b>most plausible</b> next token, not the most <b>true</b> one. It has no built-in fact-checker — so when it doesn't know, it still produces fluent, confident text that happens to be wrong.`,
    prose: [
      `The model is a very good <em>plausibility engine</em>: given the text so far, predict what usually comes next. Most of the time "plausible" and "true" line up. They come apart for rare facts, specific numbers, recent events, or anything thin in the training data — the model fills the gap with something that <em>fits the pattern</em>. Crucially, it doesn't know that it doesn't know, and confidence in the wording tells you nothing about correctness.`,
      `This ties the chapter together: letter-counting fails for the same reason, higher <em>temperature</em> makes drift more likely, and <em>RAG</em> plus <em>tool use</em> are the deployed fixes — give the model real evidence or a calculator instead of asking it to recall or compute from memory.`
    ],
    widget: 'halluc',
    vizTitle: 'Interactive: what raises and lowers hallucination risk',
    vizHint: `Make the question obscure and the temperature high with no grounding — risk spikes. Then switch on RAG, tools, and "allowed to say I don't know" and watch it drop.`,
    pmTakeaway: `The levers you actually control: ground answers in real sources (<b>RAG</b>), hand facts and math to <b>tools</b>, lower <b>temperature</b> for factual tasks, explicitly <b>allow "I don't know"</b> and ask for citations, and <b>measure</b> hallucination rate with evals. "The model lied" is rarely the right frame — usually one of these levers was off.`,
    interviewLine: `Hallucination isn't a bug to patch — it's the flip side of a model trained to produce plausible text. You manage it with grounding, tools, temperature, and evals, not by hoping the model knows better.`,
    quizQuestions: [{
      q: `Which framing of hallucination is most accurate?`,
      options: [`A bug that a patch will eventually fix`, `The flip side of a model trained to produce plausible text — managed with grounding, tools, temperature, and evals`, `Something that only happens with small models`, `A sign the training data was wrong`],
      correctIndex: 1,
      explanation: `Hallucination is inherent to a plausibility engine; you manage risk with levers, not by hoping the model knows better.`
    }],
    tags: ['hallucination','grounding','plausibility','rag','evals']
  }
  ,{
    id: 'inference', chapter: 2, order: 10, title: 'Inference',
    coreIdea: `<b>Inference is running an already-trained model to get an output</b> — the opposite half of a model's life cycle from training. Training happens once; inference happens every single time someone sends a message.`,
    prose: [
      `Every token a model generates for you is one inference step: it takes everything seen so far, does a forward pass through every layer, and predicts the next token. You met this mechanism in the latency lesson — "every token requires a full forward pass" — this concept just gives it its name.`,
      `Training cost is a one-time investment; inference cost is recurring, multiplied by every user, every message, forever.`
    ],
    widget: 'infer',
    vizTitle: 'Interactive: training vs inference, side by side',
    vizHint: `Click "Run training" once, then "Run inference" repeatedly — training is a single long bar that happens once; inference is a short bar that fires on every click.`,
    pmTakeaway: `Most of a company's real LLM spend at scale is inference cost, not training cost — if you adopt a vendor model you may never see a training bill, but you feel the inference bill on every single user interaction. A model that's slightly more expensive to train but cheaper at inference is usually the better business call at scale.`,
    interviewLine: `Training is a one-time cost; inference is a recurring cost multiplied by usage — at scale, inference economics usually dominate the AI P&amp;L, not training economics.`,
    quizQuestions: [{
      q: `At scale, which usually dominates a vendor-model AI P&amp;L?`,
      options: [`One-time training cost`, `Recurring inference cost, multiplied by every user message`, `Data-labelling cost`, `Idle-GPU cost`],
      correctIndex: 1,
      explanation: `Training is one-time; inference recurs on every interaction — inference economics usually dominate at scale.`
    }],
    tags: ['inference','training','cost','forward-pass','economics']
  }
  ,{
    id: 'tool-calling', chapter: 2, order: 11, title: 'Tool calling',
    coreIdea: `You already know the model can't reliably count letters or do precise arithmetic — it predicts plausible tokens, it doesn't compute. <b>Tool calling is the fix:</b> give the model a list of real functions it can invoke, and let it call those when it needs a real answer instead of a guess.`,
    prose: [
      `This is the exact mechanism behind every agent. When a model reads a file, runs a command, or edits code, it isn't imagining the result — it predicted "call this tool with these arguments," your system actually executed it, and the real result came back as the next input.`,
      `The model itself never executes anything; it only ever predicts which tool to call and with what arguments. That loop — decide → execute → return → continue — repeated, is what "agent" technically means.`
    ],
    widget: 'tools',
    vizTitle: 'Interactive: watch the tool-call loop run, step by step',
    vizHint: `Click through the four steps for "what's 847 × 293?" — notice the model never does the multiplication itself, it only decides to ask for it.`,
    pmTakeaway: `Tool calling is what turns a chatbot into an <b>agent</b> — that's the entire technical basis of the term. Every tool call adds a real latency cost (a round trip), and good tool <em>descriptions</em> matter more than people expect — a vaguely-named tool gets called incorrectly or skipped.`,
    interviewLine: `The model never executes a tool — it predicts the intent to call one, with arguments; your system runs it and returns the real result. That loop, repeated, is what "agent" technically means.`,
    quizQuestions: [{
      q: `What does "agent" technically mean?`,
      options: [`A model fine-tuned on agentic data`, `A loop where the model predicts which tool to call, your system executes it, and the result feeds back`, `Any chatbot with a personality`, `A model that runs with no prompt`],
      correctIndex: 1,
      explanation: `The model predicts the intent to call a tool; your system runs it. That decide→execute→return loop is what "agent" means.`
    }],
    tags: ['tool-calling','agents','function-calling','latency']
  }
  ,{
    id: 'evals', chapter: 3, order: 1, title: 'Evals',
    coreIdea: `An eval is a <b>repeatable test set with a scoring method</b> — the difference between "it felt better in the demo" and "it improved from 71% to 84% on 500 held-out cases."`,
    prose: [
      `An eval is to an AI feature what a unit test is to code: a fixed set of inputs, the expected behaviour, and an automatic way to score how close the model got. Without one, every model change is judged by vibes. With one, you can say exactly how much better, on which cases, and whether the last change quietly broke something that used to work.`,
      `Evals come in flavours. The cleanest are exact-match or programmatic checks (valid JSON? right category? correct number?). Open-ended outputs (a summary, a support reply) need human ratings or an "LLM-as-judge" — a second model scoring the first against a rubric. The judge is cheap but is itself a model with its own failure modes, so you validate it against human labels before trusting it.`,
      `The most important property of an eval set is that it looks like production. An eval built only from easy, clean cases will tell you the feature is ready when it isn't. <span class="eg-tag">Zepto example</span> A support-reply eval should include the messy, multilingual, and adversarial tickets that actually break things — because the whole point is to predict production behaviour before production sees it.`
    ],
    widget: 'evals',
    vizTitle: 'Interactive: vibe-check vs a real eval set',
    vizHint: `Add held-out cases and watch the confidence interval on "accuracy" tighten — a 5-case demo can't tell 60% from 90%.`,
    pmTakeaway: `Before approving any AI feature, ask: <b>"What's the eval set, how big is it, and does it include the cases we're actually worried about?"</b> A feature with no eval isn't ready to ship — it's ready to surprise you. Treat the eval set as a living asset: every production failure becomes a new eval case so the same bug can't silently return.`,
    interviewLine: `Evals turn "it feels better" into "it improved 13 points on 500 held-out cases that look like production" — without them, you're shipping on vibes and discovering regressions from users.`,
    quizQuestions: [{
      q: `What's the strongest reason a 5-prompt "vibe check" is dangerous for a launch decision?`,
      options: [`It takes too long to run`, `The sample is far too small to distinguish a good model from a mediocre one`, `It uses too much compute`, `It can't be automated`],
      correctIndex: 1,
      explanation: `A handful of cases has a huge confidence interval — you can't tell 60% from 90%. A real eval set sized like production can.`
    }],
    tags: ['evaluation','testing','quality','llm-as-judge']
  }
  ,{
    id: 'benchmarks-goodhart', chapter: 3, order: 2, title: "Benchmarks &amp; Goodhart's Law",
    coreIdea: `A benchmark is a <b>shared public eval used to compare models</b>; Goodhart's Law is why a great benchmark score doesn't guarantee a great product — "when a measure becomes a target, it ceases to be a good measure."`,
    prose: [
      `Benchmarks (MMLU, GSM8K, HumanEval, and dozens more) let the whole field compare models on the same yardstick. They're useful for a rough capability map. But because everyone optimises for them — and benchmark questions leak into training data — top scores compress and stop discriminating. A model can ace a coding benchmark and still be mediocre on your actual codebase.`,
      `Goodhart's Law is the trap underneath: the moment a number becomes the goal, people (and training pipelines) optimise the number rather than the thing it was meant to represent. <span class="eg-tag">Zepto example</span> Optimising a support bot purely for "tickets closed per hour" can teach it to close tickets fast without resolving them — the metric goes up and the product gets worse.`,
      `The defence is the same discipline as the data-split lesson, one layer up: never trust a single number, and always ask what it was measured against. A public benchmark is a starting filter, not a launch criterion. The real decision needs your own eval set, on your own data, measuring the outcome you actually care about.`
    ],
    widget: 'goodhart',
    vizTitle: 'Interactive: optimise the metric, watch the goal drift',
    vizHint: `Push "optimise for the benchmark" up and watch the benchmark score rise while true product quality peaks then falls — that gap is Goodhart's Law.`,
    pmTakeaway: `Use public benchmarks to shortlist models, never to greenlight a feature. When a vendor leads with a benchmark win, ask <b>"measured on what, and how close is it to our use case?"</b> then insist on an eval on your own data. Watch your own internal KPIs too: any single metric a team optimises hard will eventually be gamed unless paired with a guardrail metric.`,
    interviewLine: `A benchmark score is a hypothesis about capability, not proof of product fit — and the moment a metric becomes the target, Goodhart's Law says it starts lying to you.`,
    quizQuestions: [{
      q: `A vendor's model tops a popular reasoning benchmark. What should you conclude?`,
      options: [`It will be the best model for our feature`, `It's worth shortlisting, but we must eval it on our own data before deciding`, `Benchmarks are useless, ignore it`, `We should optimise our product for that benchmark too`],
      correctIndex: 1,
      explanation: `Benchmarks shortlist, they don't greenlight — leakage and Goodhart's Law mean a top score can still flop on your use case.`
    }],
    tags: ['benchmarks','goodharts-law','metrics','evaluation']
  }
  ,{
    id: 'harness', chapter: 3, order: 3, title: 'Harness',
    coreIdea: `In the agent era, a harness is the <b>scaffolding wrapped around a model so it can take actions</b> — the tool definitions, the call → observe loop, the system prompt, context management, and the permission gate. The model proposes; the harness decides what actually runs. <span class="eg-tag">heads up</span> The same word has an older, narrower meaning in evaluation — see the last paragraph.`,
    prose: [
      `A raw model only emits text. A harness turns that text into <b>actions</b>: it hands the model a set of tools (search, run a query, call an API, edit a file), runs the model, and when the model asks to use a tool the harness executes it, feeds the result back, and runs the model again. That call → observe → repeat loop, until the task is done, is the heart of every agent. <span class="eg-tag">example</span> Claude Code is a harness: the model writes the plan, but the harness is what actually reads files, runs commands, and asks you before doing something risky.`,
      `The harness — not the model — holds the controls. It decides <em>which</em> tools exist (a support agent can issue a refund but not delete a customer), enforces <b>permissions</b> (pause and ask a human before an irreversible action), manages the <b>context window</b> (what history and retrieved docs the model sees each turn), and sets the <b>stopping rule</b> (max steps, a budget, a "done" signal). Most agent failures are harness failures — a missing guardrail or a tool that did too much — not the model being "dumb".`,
      `Second meaning — the <b>eval harness</b>: the test runner that scores your pipeline automatically on every change. It loads your eval cases, runs them through the whole system, applies the scoring, and reports — so a regression gets caught before it ships. This chapter's evaluation section uses "harness" in that narrower sense. <span class="eg-tag">Zepto example</span> A nightly eval-harness run over 1,000 saved support queries flags the morning after a prompt change that resolution quality dropped 4 points — before customers feel it.`
    ],
    widget: 'harness',
    vizTitle: 'Interactive: the agent loop, step by step',
    vizHint: `Step a request through the harness — the model proposes a tool, the permission gate checks it, the tool runs, the result comes back, and the loop continues to a final answer. Toggle "deny risky action" to watch the harness stop an unsafe call.`,
    pmTakeaway: `For anything agentic, the product questions are about the harness, not the model: <b>"which tools can it call, who approves the risky ones, how is context managed, and when does it stop?"</b> A capable model in a sloppy harness ships incidents; an average model in a tight harness ships safely.`,
    interviewLine: `The model proposes, the harness disposes — tools, the action loop, permissions, and context limits all live in the harness, which is why most agent failures are harness failures, not model failures.`,
    quizQuestions: [{
      q: `In an agent, what does the harness do that the model itself does not?`,
      options: [`Generates the text of each response`, `Defines the tools, runs the action loop, and enforces permissions on what actually executes`, `Stores the model's training data`, `Makes the model larger`],
      correctIndex: 1,
      explanation: `The model only proposes actions as text; the harness defines which tools exist, executes them, feeds results back, and gates risky actions — the model never touches the outside world directly.`
    }],
    tags: ['harness','agent','tools','action-loop','permissions','context','eval','automation']
  }
  ,{
    id: 'ai-safety-alignment', chapter: 3, order: 4, title: 'AI safety &amp; alignment',
    coreIdea: `Alignment is <b>making a model's behaviour match human intent and values</b>; AI safety is the broader discipline of preventing harm — from toxic outputs and jailbreaks today to larger risks as systems get more capable.`,
    prose: [
      `A raw, pre-trained model is a pure plausibility engine — it will happily continue any text, helpful or harmful. Alignment techniques (instruction tuning, and especially RLHF — reinforcement learning from human feedback) shape it to be helpful, honest, and harmless: to follow instructions, refuse genuinely dangerous requests, and admit uncertainty. This is why a deployed assistant feels cooperative and bounded rather than like raw autocomplete.`,
      `For a PM, safety is mostly concrete product trade-offs, not abstract philosophy. Make refusals too aggressive and the product becomes useless and patronising (over-refusal); make them too loose and it can be jailbroken into harmful or off-brand output. <span class="eg-tag">Zepto example</span> A grocery support bot should refuse medical-dosage advice on a supplement and hand off to a human, not improvise.`,
      `There's also a longer-horizon view: as models gain autonomy and tool access, the cost of misalignment rises, which is why evals increasingly include safety-specific tests (toxicity, bias, jailbreak resistance) alongside capability. You don't need to resolve the philosophy to act well — you need to treat safety as a measurable, ship-blocking dimension of quality.`
    ],
    widget: 'alignment',
    vizTitle: 'Interactive: the over-refusal ↔ jailbreak trade-off',
    vizHint: `Slide the safety threshold: too strict and helpful requests get refused; too loose and harmful ones slip through. The product lives in the calibrated middle.`,
    pmTakeaway: `Treat safety as a measurable quality dimension with its own evals (toxicity, bias, jailbreak resistance), and own the refusal boundary explicitly. Ask: <b>"what is this feature allowed to say when unsure, and when does it hand off to a human?"</b> That single decision prevents most real-world AI incidents.`,
    interviewLine: `Alignment makes the model do what we actually mean; the PM's job is to set the refusal boundary deliberately — because over-refusal makes the product useless and under-refusal makes it dangerous.`,
    quizQuestions: [{
      q: `Your AI feature refuses far too many legitimate requests. This is:`,
      options: [`Always the safest possible outcome`, `Over-refusal — a real product failure, as much a calibration problem as under-refusal`, `A sign the model is too small`, `Impossible if alignment was done right`],
      correctIndex: 1,
      explanation: `Safety is a trade-off you own: over-refusal makes the product useless, under-refusal makes it unsafe — aim for a calibrated boundary.`
    }],
    tags: ['safety','alignment','rlhf','guardrails','refusal']
  }
  ,{
    id: 'environmental-impact', chapter: 3, order: 5, title: 'Environmental impact of LLMs at scale',
    coreIdea: `Every inference call costs real energy and water; at the scale of millions of requests, the model's <b>environmental footprint becomes a genuine cost, sustainability, and design concern</b> — and it points the same direction as latency and money.`,
    prose: [
      `Running an LLM isn't free in any sense. Training a large model is a big one-time energy expenditure, but the recurring footprint is inference: every token runs a forward pass through billions of parameters on power-hungry accelerators, and data centres consume electricity and water for cooling. One query is negligible; a feature serving millions of users a day is not.`,
      `The encouraging part is that the levers that reduce environmental impact are the same ones that reduce cost and latency. Shorter outputs, smaller or distilled models where they suffice, caching repeated answers, retrieving a few chunks instead of stuffing huge contexts, and not calling the biggest model for trivial tasks — each cuts tokens, and tokens are the common currency of money, milliseconds, and emissions. <span class="eg-tag">Zepto example</span> Routing simple "where is my order?" queries to a small model and reserving the large model for complex tickets cuts cost, latency, and footprint at once.`,
      `So sustainability rarely requires a heroic trade-off against the business — it's mostly the disciplined engineering you'd want anyway, made visible. The mistake is treating "use the most powerful model everywhere" as a default; right-sizing the model to the task is the single biggest lever, and it's a product decision.`
    ],
    widget: 'envimpact',
    vizTitle: 'Interactive: tokens × requests → energy &amp; cost',
    vizHint: `Scale daily requests and output length, and switch model size — watch energy, cost, and latency move together. Right-sizing the model is the biggest lever.`,
    pmTakeaway: `Right-size the model to the task — the instinct to call the most powerful model everywhere is the costliest, slowest, and least sustainable default. Because tokens are the shared currency of money, latency, and emissions, the efficiency work you'd do for cost and speed already shrinks the footprint. Ask: <b>"could a smaller model, a shorter output, or a cache handle this request?"</b>`,
    interviewLine: `Tokens are the common currency of cost, latency, and carbon — so right-sizing the model and trimming output isn't just green, it's the same disciplined engineering that makes the feature cheaper and faster.`,
    quizQuestions: [{
      q: `What's the single biggest lever a PM controls over an AI feature's environmental footprint?`,
      options: [`Choosing a greener font`, `Right-sizing the model to the task instead of calling the biggest model for everything`, `Training the model twice`, `Increasing the context window`],
      correctIndex: 1,
      explanation: `Tokens drive energy, cost, and latency together; right-sizing the model (and trimming output) is the biggest lever, and it's a product decision.`
    }],
    tags: ['environment','sustainability','cost','efficiency','inference']
  }
];
