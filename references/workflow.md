# Detailed Workflow

Step-by-step playbook. Follow in order. Don't skip Phase 1.

## Phase 1 — Scope discovery

### 1.1 Find the exam-scope document
Look for these files in the course root (in priority order):
- `Final Guide.md` / `Final Guide.pdf`
- `topics and final exam.pdf` / `exam topics.pdf` / `syllabus.pdf`
- Anything matching `*scope*`, `*topics*`, `*final*`, `*review*`, `*outline*`
- README in the workspace

If none found, ask the user: "I couldn't find a scope document. Is the exam scope all lectures, or a subset? / 我没找到考纲文档。考试范围是全部 N 个课件，还是某个子集？"

### 1.2 List the lectures
List all `.ppt`, `.pptx`, `.pdf` lecture files. Group them by topic if numbering implies grouping (e.g., `07-cluster-kMean`, `08-cluster-dendrogram` → clustering group).

If lectures are in `.ppt` / `.pptx` format, convert to PDF for easier reading:
- **Windows**: PowerPoint COM automation via PowerShell (works without disabling execution policy):
  ```powershell
  $ppt = New-Object -ComObject PowerPoint.Application
  Get-ChildItem . -Filter '*.ppt*' | ForEach-Object {
    $out = Join-Path 'pdf' ([System.IO.Path]::GetFileNameWithoutExtension($_.Name) + '.pdf')
    $pres = $ppt.Presentations.Open($_.FullName, $true, $false, $false)
    $pres.SaveAs($out, 32)  # 32 = ppSaveAsPDF
    $pres.Close()
  }
  $ppt.Quit()
  ```
- **macOS/Linux**: `libreoffice --headless --convert-to pdf *.pptx`

### 1.3 Read past papers AND homework (MANDATORY)
Look in `past paper/`, `past papers/`, `previous exams/`, `hw/`, `homework/`, `assignment/`, `exercise/`, etc. These are NOT optional inputs — they MUST be mined for:

- **Recurring question types** per topic (note them in your scope summary)
- **Worked examples** for 🌰 (better than slide examples — at exam-difficulty level)
- **Traps** for ⚠️ (the common-mistake answers reveal what students get wrong)
- **MCQ / short-answer items** for each lecture's 🎯 final quiz (use actual past-paper stems where possible; paraphrase if rewording for clarity)

Maintain a cross-reference table as you go:
```
Topic               | Past-paper hits     | HW exercises    | Question type
Topic A             | 2024-final Q3 ×1    | hw1 Q2          | computational
Topic B             | 2024-mid Q1 ×1      | hw1 Q4, ex2.pdf | proof / derivation
Topic C             | 2024-final Q5 ×1    | hw2 Q1          | numerical fill-in
```
This table is the BACKBONE of exam-focused notes. Build it before writing any HTML.

### 1.4 Check for existing digested content
Look for files like `*_concepts*.md`, `*_summary*.md`, `*_deep*.md`, `*_review*.md`. These pre-digested files save token budget — prefer them over raw PPT content when both exist.

### 1.5 Confirm scope with user
Output a numbered list before producing any notes:
```
Scope (N lectures total):
1. ⭐⭐⭐ Lec 07 — K-means clustering        (past paper: ×3, definitely tested)
2. ⭐⭐⭐ Lec 09 — Decision trees              (past paper: ×2, definitely tested)
...
n. ⭐    Lec 18 — Web DB                     (past paper: ×0, optional)

Suggested: do top K in full depth; produce condensed versions for the rest. Confirm?
```

Also at this stage: **ask which visual skin** (Bright Friendly / Academic Terminal / Paper Editorial). If the workspace already has a sibling course with one of these skins applied, default to matching it.

## Phase 2 — Template lecture

### 2.1 Pick the template lecture
Criteria:
- High exam priority (effort isn't wasted on something low-value)
- Exercises many feature types (math + diagrams + concepts > pure concepts)
- Has both a worked numerical example AND a famous trap

### 2.2 Read the slide content
Convert PPT to PDF first (see 1.2). Then read the PDF.

Make a structured outline file (Markdown in a scratch folder is fine):
- Title, learning objectives (if listed)
- Concept 1: { definition, example, common mistakes, key terms, sample questions }
- Concept 2: ...
- Key formulas
- Algorithm pseudocode (if any)

### 2.3 Cross-reference with exercises
For each major concept, find the corresponding exercise PDF. Exercise PDFs are gold — they contain worked examples (your 🌰) and reveal what the instructor considers tricky (your ⚠️).

### 2.4 Cross-reference with past papers
For each concept, find related past-paper questions. These become your 🎯 final quiz.

### 2.5 Build the template HTML

First version is SELF-CONTAINED — all CSS/JS inlined from the chosen skin. Goal: one file the user can double-click and see everything working.

Structure:
```html
<!DOCTYPE html>
<html lang="zh-Hant">  <!-- or en, or whatever the user speaks -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lecture XX · Topic · Course Code</title>
  <style>/* full skin CSS inlined for the template */</style>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
          onload="renderMathInElement(document.body, {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
            throwOnError: false
          });"></script>
</head>
<body>
  <aside class="sidebar">
    <a class="home-link" href="index.html">← Index</a>
    <div class="progress-bar"><div class="progress-fill"></div></div>
    <nav><ol>... sticky section nav ...</ol></nav>
  </aside>
  <main>
    <header class="hero">
      <h1>Lecture XX · Topic</h1>
      <p class="tagline">one-line positioning</p>
      <p><span class="pill pill-must">⭐⭐⭐</span> <span class="pill pill-hot">past paper hits</span></p>
    </header>
    <section id="section-1">
      <h2>1. ...</h2>
      <article class="concept-card">
        <h3 class="concept-title">Concept name</h3>
        <section class="card-section eli5">🍼 ...</section>
        <section class="card-section formal">📖 ...</section>
        <section class="card-section example">🌰 ...</section>
        <section class="card-section trap">⚠️ ...</section>
        <section class="card-section flipcards">🔄 ...</section>
        <section class="card-section quiz">❓ ...</section>
      </article>
    </section>
    <!-- more sections ... -->
    <section id="cheatsheet" class="cheatsheet"><h2>📌 Cheat-sheet</h2>...</section>
    <section id="final-quiz" class="final-quiz"><h2>🎯 Final Quiz</h2>...</section>
  </main>
  <script>/* full skin JS inlined for the template */</script>
</body>
</html>
```

### 2.6 Validation handoff
Tell the user:
```
Template ready: path/to/<template-lecture>.html

Please open it and click around. Specifically check:
1. The flip-cards in section N — do they 3D-flip on click?
2. A self-quiz wrong-option click — does it turn red and show explanation?
3. The algorithm diagram buttons ①②③④ — do stages progressively light up?
4. Overall content density and visual style — OK?
```

DO NOT proceed to Phase 3 until the user signs off.

### 2.7 Refactor into shared assets

After approval, copy the chosen skin's CSS + JS from this skill's `assets/` directory into `<output>/assets/`, renaming them to `notes.css` and `notes.js`. Convert the template lecture's HTML to reference them:
```html
<link rel="stylesheet" href="assets/notes.css">
<script defer src="assets/notes.js"></script>
```

Verify the template still works exactly the same after refactor — the user shouldn't notice the difference.

## Phase 3 — Batch production

### 3.1 Decide on parallelism
- ≤3 remaining lectures: do inline yourself
- 4-6 remaining: 2-3 parallel subagents, each handling 2 lectures
- 7+ remaining: one subagent per lecture (or per topic group)

### 3.2 Content-first subagent dispatch
Each subagent's job is to **extract structured content** to a `.md` file, NOT to write HTML. Brief them:

> Read the slide file at `<path>`. Read the corresponding exercise PDF at `<path>`. Read the relevant past-paper questions in `<files>`.
> Write a structured Markdown content outline to `<output>/_content/<NN>-<topic>.md`. Use this structure:
> 
> ```markdown
> # Lecture NN · Topic
> Tagline: ...
> Exam priority: ⭐⭐⭐ (past paper: ...)
> 
> ## Section 1: ...
> ### Concept: ...
> - 🍼 ELI5: ...
> - 📖 Formal: ...
> - 🌰 Example: ... (numerical, verified)
> - ⚠️ Trap: ...
> - 🔄 Flip-cards: term — definition (×3-5)
> - ❓ MCQ: question, options (a-d), correct, explanation
> ...
> ## 📌 Cheat-sheet (10-20 bullets)
> ## 🎯 Final quiz (3-6 MCQs, paraphrased from past papers)
> ```
> 
> Keep examples NUMERICALLY CORRECT. Don't paste content back; just confirm the file was written.

**IMPORTANT**: Use a subagent type that has Write access (e.g., `general-purpose`). Read-only agents (e.g., `Explore`) CANNOT write files and will silently fail.

### 3.3 HTML rendering
For each `.md` outline, dispatch a second subagent (or do inline for small scopes) that:
- Reads the `.md` content file
- Reads the template HTML (`07-k-means.html` or similar) for STYLE/STRUCTURE reference
- Produces a corresponding `.html` file in the output folder

Each rendering agent should be told the EXACT class contract (`.concept-card`, `.card-section.eli5/.formal/...`, `.mcq[data-correct]`, etc.) so they don't invent new structures.

**Tell every rendering agent: NEVER hardcode hex/named colors in inline styles** (no `style="background:#FFF6E8"`, no `color:#fff`, no `border-color:#E76F51`). Inline colors are skin-coupled and break when the skin changes — a light background hardcoded on a dark skin renders light-text-on-light-box that looks like garbled/overlapping fonts. Use theme variables (`var(--surface-2)`, `var(--eli5-bg)`, `var(--coral)`, …) or semantic classes only. This is the single most common rendering bug.

### 3.4 Build the hub
`<output>/index.html`:
- Card grid of all lectures
- For each card: lecture number, title, exam priority (⭐⭐⭐), past-paper question count, estimated read time, "must-know" badge
- Sort by topic group OR by exam priority (offer the choice to the user)
- Plus a "study order" recommendation at top, and exam logistics (date, venue, time)

## Phase 4 — Polish

### 4.1 Past-paper integration
Open the past papers. For each question, identify which lecture it tests. Add as a 🎯 final-quiz item on that lecture page. Optionally create a separate `past-papers.html` that walks through full solutions.

### 4.2 🌑 Dark-horse polish pass
This is critical and often skipped. Dispatch one polish-pass agent per high-priority lecture (or batch by topic). Each agent:

- Re-reads the lecture PDF
- Re-reads the past-paper questions for that lecture
- Identifies slide content present in the lecture but ABSENT from past papers (the "dark horses")
- Edits the lecture HTML to add a `<h3>🌑 暗箭考点 (dark-horse) </h3>` subsection inside `<section id="final-quiz">` containing 2-3 MCQs on those dark-horse topics

Dark-horse topics tend to be:
- Algorithm variants that share a chapter with a heavily-tested algorithm but were never the focus (e.g., ID3 entropy when only CART was tested; Manhattan distance when only Euclidean was tested)
- Theoretical properties (convergence, complexity, anti-monotone) when past papers focused on computation
- Tool / software workflows when past papers focused on math
- Subtle definitional distinctions (e.g., open-vs-closed itemsets, hard-vs-soft margins)

### 4.2b Color-leak audit (dark skins especially)
After generation, grep every produced HTML for hardcoded inline backgrounds that clash with the skin:
```
grep -rn 'background:\s*#\(FFF\|fff\|FAF\|FBF\|EDF\|FDF\|FFE\)\|background:\s*white' "interactive note"/*.html
```
Replace any hits with theme variables (`var(--surface-2)`, `var(--eli5-bg)`, etc.). A light background hardcoded on a dark skin produces light-text-on-light-box that looks like overlapping/garbled fonts — the most common post-generation rendering bug.

### 4.3 Cheat sheet PDF (optional)
If the course has formulas:
- Use `python-docx`, `reportlab`, or `weasyprint` to render an A4 front+back
- Pull from each lecture's 📌 cheat-sheet + key formulas
- AVOID anything on the official formula sheet (redundant)
- Add common-question solution patterns ("How to compute X" templates)

### 4.4 Final user handoff
Tell the user:
```
All N lectures + index complete.

Entry point: <output>/index.html (double-click or file:// URL)

Each lecture contains:
- Sidebar nav + progress bar
- Concept cards (🍼 ELI5 / 📖 formal / 🌰 example / ⚠️ trap / 🔄 flip-cards / ❓ self-quiz)
- 📌 Cheat-sheet + 🎯 Final quiz + 🌑 Dark-horse MCQs
- Step-by-step algorithm animations where applicable

Spot-check 1-2 in your browser, tell me what to adjust. Good luck on the exam.
```

## Common iteration patterns after delivery

- **"内容偏稀疏 / too sparse"** → expand 🌰 examples; add more flipcards; integrate more exercise-PDF worked examples
- **"右边大片空白 / too much empty space"** → check that the chosen skin's wide-screen rules are active (Skin B has 2-col concept cards on >1100px; Skin A is single-col by design)
- **"样式不统一 / inconsistent style"** → ensure all lectures reference the same `assets/notes.css` (not inline styles)
- **"加题目 / more practice questions"** → expand 🎯 final quiz, mine more past-paper questions, or add another dark-horse pass
- **"做个 cheat sheet PDF / generate PDF"** → Phase 4.3

Handle each as a focused edit, NOT a full rebuild. The shared-assets pattern means most style changes are one-file edits.
