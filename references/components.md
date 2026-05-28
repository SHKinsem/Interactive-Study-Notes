# Component Cookbook

Copy-paste-ready snippets for the interactive components. The shared `assets/notes.css` and `assets/notes.js` already contain these — this file documents HOW they work so you can adapt without re-deriving.

## 1. Flip-cards (terminology drilling)

**HTML:**
```html
<div class="flipcard-grid">
  <div class="flipcard" tabindex="0" role="button" aria-label="翻卡: K-means">
    <div class="flipcard-inner">
      <div class="flipcard-front">K-means</div>
      <div class="flipcard-back">一种把 N 个点分成 K 组的算法，反复"算中心 → 重新分组"直到稳定。</div>
    </div>
  </div>
  <!-- more cards -->
</div>
```

**CSS (the magic is `transform-style: preserve-3d` + `backface-visibility: hidden`):**
```css
.flipcard { perspective: 1000px; min-height: 120px; cursor: pointer; }
.flipcard-inner { position: relative; width: 100%; height: 100%; min-height: 120px; transition: transform 0.5s; transform-style: preserve-3d; }
.flipcard.flipped .flipcard-inner { transform: rotateY(180deg); }
.flipcard-front, .flipcard-back { position: absolute; inset: 0; backface-visibility: hidden; padding: 16px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.flipcard-front { background: var(--card-front); color: var(--accent); font-weight: 600; font-size: 1.1em; }
.flipcard-back { background: var(--card-back); transform: rotateY(180deg); font-size: 0.95em; text-align: left; line-height: 1.5; }
```

**JS:**
```js
document.querySelectorAll('.flipcard').forEach(card => {
  const toggle = () => card.classList.toggle('flipped');
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});
```

Notes:
- Click-to-flip, NOT hover (mobile friendliness).
- Both faces have `padding`, the inner uses absolute positioning to stack.
- Use `min-height` not `height` — the longer face determines size.

## 2. MCQ with instant feedback

**HTML:**
```html
<div class="mcq" data-correct="b">
  <p class="mcq-question">下面哪一种是 K-means 的初始化方式？</p>
  <ul class="mcq-options">
    <li><button data-option="a">用最大的 K 个点</button></li>
    <li><button data-option="b">随机选 K 个点</button></li>
    <li><button data-option="c">让 K=数据集大小</button></li>
  </ul>
  <p class="mcq-explanation" hidden>正确。常见初始化是随机选 K 个数据点作为初始 centroid，K-means++ 是一种更好的变体。</p>
</div>
```

**CSS:**
```css
.mcq { background: var(--quiz-bg); border-radius: 12px; padding: 16px; margin: 12px 0; }
.mcq-options { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.mcq-options button { width: 100%; text-align: left; padding: 10px 14px; border: 1px solid var(--border); background: var(--card-front); border-radius: 8px; cursor: pointer; transition: background 0.2s, border-color 0.2s; font-size: 0.95em; }
.mcq-options button:hover { background: var(--card-back); }
.mcq-options button.correct { background: #d4edda; border-color: #28a745; color: #155724; }
.mcq-options button.incorrect { background: #f8d7da; border-color: #dc3545; color: #721c24; }
.mcq-options button:disabled { cursor: default; }
.mcq-explanation { margin-top: 12px; padding: 12px; background: var(--explanation-bg); border-left: 4px solid var(--accent); border-radius: 6px; font-size: 0.9em; }
```

**JS:**
```js
document.querySelectorAll('.mcq').forEach(mcq => {
  const correct = mcq.dataset.correct;
  const buttons = mcq.querySelectorAll('.mcq-options button');
  const explanation = mcq.querySelector('.mcq-explanation');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const picked = btn.dataset.option;
      buttons.forEach(b => {
        b.disabled = true;
        if (b.dataset.option === correct) b.classList.add('correct');
        else if (b.dataset.option === picked) b.classList.add('incorrect');
      });
      explanation.hidden = false;
    });
  });
});
```

Notes:
- INSTANT feedback (no submit button). User clicks → immediate visual + explanation.
- Show the correct answer even if they got it wrong (green highlight on the right one).
- `data-correct` is the option letter, not the text — keeps it robust to copy-edit.

## 3. Sidebar nav + scroll progress

**HTML:**
```html
<aside class="sidebar">
  <div class="progress-bar"><div class="progress-fill"></div></div>
  <nav>
    <ol>
      <li><a href="#section-1">1. 概念背景</a></li>
      <li><a href="#section-2">2. 算法步骤</a></li>
      <li><a href="#section-3">3. 工作示例</a></li>
      <li><a href="#section-4">4. 复杂度</a></li>
      <li><a href="#cheatsheet">📌 速记</a></li>
      <li><a href="#final-quiz">🎯 综合自测</a></li>
    </ol>
  </nav>
</aside>
```

**CSS:**
```css
.sidebar { position: fixed; top: 0; left: 0; width: 220px; height: 100vh; background: var(--sidebar-bg); padding: 24px 20px; box-shadow: 2px 0 8px rgba(0,0,0,0.05); overflow-y: auto; }
.sidebar nav ol { list-style: none; padding: 0; counter-reset: nav; }
.sidebar nav li { margin: 6px 0; }
.sidebar nav a { display: block; padding: 8px 12px; border-radius: 6px; color: var(--text); text-decoration: none; font-size: 0.9em; transition: background 0.15s; }
.sidebar nav a:hover { background: var(--card-back); }
.sidebar nav a.active { background: var(--accent); color: white; font-weight: 600; }
.progress-bar { height: 4px; background: var(--card-back); border-radius: 2px; margin-bottom: 24px; overflow: hidden; }
.progress-fill { height: 100%; width: 0; background: var(--accent); transition: width 0.1s; }
main { margin-left: 240px; padding: 40px 32px; max-width: 920px; }
@media (max-width: 768px) {
  .sidebar { position: static; width: auto; height: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  main { margin-left: 0; padding: 20px; }
}
```

**JS:**
```js
// Highlight active section on scroll
const navLinks = document.querySelectorAll('.sidebar nav a');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => observer.observe(s));

// Progress bar
const progressFill = document.querySelector('.progress-fill');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressFill && max > 0) progressFill.style.width = Math.min(100, (scrolled / max) * 100) + '%';
}, { passive: true });
```

## 4. Step-by-step animated diagram (algorithm walkthrough)

**HTML:**
```html
<figure class="stepped-diagram" data-steps="4">
  <svg viewBox="0 0 400 280" class="diagram-svg">
    <!-- All step elements, hidden by default -->
    <g class="step" data-step="1"><!-- initial centroids --></g>
    <g class="step" data-step="2"><!-- first assignment --></g>
    <g class="step" data-step="3"><!-- centroid recompute --></g>
    <g class="step" data-step="4"><!-- converged --></g>
  </svg>
  <div class="step-controls">
    <button data-step-btn="1">① 初始化</button>
    <button data-step-btn="2">② 分配</button>
    <button data-step-btn="3">③ 更新中心</button>
    <button data-step-btn="4">④ 收敛</button>
  </div>
  <p class="step-narration"></p>
</figure>
```

**CSS:**
```css
.stepped-diagram { margin: 16px 0; padding: 16px; background: var(--card-front); border-radius: 12px; }
.diagram-svg { width: 100%; max-width: 400px; display: block; margin: 0 auto; }
.diagram-svg .step { opacity: 0; transition: opacity 0.4s; }
.diagram-svg .step.visible { opacity: 1; }
.step-controls { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 12px; }
.step-controls button { padding: 6px 12px; background: var(--card-back); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 0.85em; }
.step-controls button.active { background: var(--accent); color: white; border-color: var(--accent); }
.step-narration { margin-top: 12px; padding: 10px; background: var(--explanation-bg); border-radius: 6px; font-size: 0.9em; min-height: 1.5em; }
```

**JS:**
```js
document.querySelectorAll('.stepped-diagram').forEach(diagram => {
  const narration = diagram.querySelector('.step-narration');
  const narrations = {
    1: '初始化：随机选 K 个点作为初始 centroid。',
    2: '分配：每个点归入最近的 centroid。',
    3: '更新：每组重算 centroid 为该组所有点的均值。',
    4: '收敛：如果 centroid 不再变化，停止。'
  };
  diagram.querySelectorAll('[data-step-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.stepBtn);
      diagram.querySelectorAll('.step').forEach(step => {
        step.classList.toggle('visible', parseInt(step.dataset.step) <= targetStep);
      });
      diagram.querySelectorAll('.step-controls button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (narration) narration.textContent = narrations[targetStep] || '';
    });
  });
});
```

## 5. KaTeX (math rendering)

In `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
        onload="renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ]
        });"></script>
```

Then write `$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$` inline or `$$ ... $$` for display. Works offline if user pre-downloads KaTeX (offer this when relevant).

## 6. Concept card (the canonical 6-section structure)

```html
<article class="concept-card">
  <h3 class="concept-title">概念 X</h3>

  <section class="card-section eli5">
    <h4>🍼 大白话</h4>
    <p>想象一下你...（everyday analogy）</p>
  </section>

  <section class="card-section formal">
    <h4>📖 正式定义</h4>
    <p>Concept X is a ... such that ... (English terms kept).</p>
  </section>

  <section class="card-section example">
    <h4>🌰 例子</h4>
    <p>Given <code>{x1=1, x2=4, x3=7}</code> and K=2:</p>
    <ol>
      <li>Step 1: ...</li>
    </ol>
  </section>

  <section class="card-section trap">
    <h4>⚠️ 考点陷阱</h4>
    <p>注意：很多同学以为 X 是 Y，但其实 ...</p>
  </section>

  <section class="card-section flipcards">
    <h4>🔄 关键术语</h4>
    <div class="flipcard-grid">
      <!-- flipcards -->
    </div>
  </section>

  <section class="card-section quiz">
    <h4>❓ 自测</h4>
    <div class="mcq" data-correct="b"><!-- ... --></div>
  </section>
</article>
```

## 7. Lecture-end cheatsheet & final quiz

```html
<section id="cheatsheet" class="cheatsheet">
  <h2>📌 一页速记</h2>
  <ul class="cheat-bullets">
    <li><strong>K-means 三步：</strong> 初始化 → 分配 → 更新，直到 centroid 不变。</li>
    <li><strong>时间复杂度：</strong> $O(n \\cdot K \\cdot d \\cdot i)$，n=点数, K=簇数, d=维度, i=迭代数。</li>
    <!-- ... -->
  </ul>
</section>

<section id="final-quiz" class="final-quiz">
  <h2>🎯 综合自测</h2>
  <!-- 3-5 MCQs covering the whole lecture, drawn from past papers when available -->
</section>
```

## 8. Hub page (index.html)

```html
<main class="hub">
  <header class="hub-hero">
    <h1>COMP1942 · Data Mining · 速通笔记</h1>
    <p>共 N 章 · 按考试优先级排序</p>
  </header>
  <div class="hub-grid">
    <a class="hub-card priority-high" href="07-cluster-kMean.html">
      <div class="hub-num">07</div>
      <div class="hub-title">K-means Clustering</div>
      <div class="hub-meta">⭐⭐⭐ · past paper ×2 · ~15 min</div>
    </a>
    <!-- more cards -->
  </div>
</main>
```

CSS:
```css
.hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.hub-card { display: block; padding: 20px; background: var(--card-front); border-radius: 12px; text-decoration: none; color: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.15s, box-shadow 0.15s; }
.hub-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
.hub-card.priority-high { border-left: 4px solid var(--accent); }
.hub-num { font-size: 0.8em; opacity: 0.6; }
.hub-title { font-size: 1.1em; font-weight: 600; margin: 4px 0 8px; }
.hub-meta { font-size: 0.85em; opacity: 0.7; }
```
