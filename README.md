# interactive-study-notes

A Claude Code / Claude Agent SDK skill that turns a folder of lecture materials (slides, exercises, past papers, homework) into a set of polished, interactive HTML study notes.

Built originally for HKUST exam-prep workflows; the skill is course-agnostic and works for any subject from any school.

## What it produces

```
your-course/
├── lecture-slides/             ← your inputs (any of these)
├── homework/
├── past-papers/
├── syllabus.pdf
└── interactive note/           ← what this skill creates
    ├── index.html              ← hub: list of all lectures with priority badges
    ├── 01-topic.html           ← one HTML per lecture
    ├── 02-topic.html
    ├── ...
    └── assets/
        ├── notes.css           ← chosen skin (Bright / Terminal / Editorial)
        └── notes.js            ← shared interactive behaviors
```

Every lecture page contains:

- **Sticky sidebar nav** with scroll progress
- **Concept cards** in a fixed 6-section structure:
  1. 🍼 ELI5 / 大白话 — everyday analogy
  2. 📖 Formal definition / 正式定义
  3. 🌰 Example / 例子 — concrete worked example with real numbers
  4. ⚠️ Exam trap / 考点陷阱
  5. 🔄 Flip-cards / 翻卡 — 3D-flip term drills
  6. ❓ Self-quiz / 自测 — MCQs with instant green/red feedback
- **Step-by-step animated diagrams** for algorithms (click ①②③④ to walk through stages)
- **KaTeX math** for formulas (works offline if user pre-downloads KaTeX; otherwise CDN)
- **📌 Cheat-sheet** at the end of each lecture
- **🎯 Final quiz** with past-paper-derived MCQs
- **🌑 Dark-horse questions** — MCQs on topics that are in the slides but NOT in past papers (the most likely "surprise questions" on the actual exam)

All pages are **single-file, offline-capable, double-clickable**. No build step, no framework, no npm.

## How to use

In Claude Code (or any compatible client), drop this skill into your `.claude/skills/` directory, then say something like:

```
帮我把这个文件夹里的课件做成交互式 html 速通笔记
```

or

```
build interactive exam-prep notes from the lectures in this folder
```

Claude will:

1. Find the syllabus / exam scope document and read it.
2. Read all the past papers / homework / exercises (mandatory inputs).
3. Show you a prioritized list of lectures to cover. You confirm.
4. Ask which visual skin you want (Bright Friendly / Academic Terminal / Paper Editorial).
5. Build ONE template lecture for you to validate in the browser.
6. After approval, batch-produce the remaining lectures (parallel subagents for speed).
7. Build the `index.html` hub.
8. Add 🌑 dark-horse MCQs to each lecture.
9. Tell you the path to open and which interactions to verify.

You can also invoke it for incremental work — improve existing notes, expand a cheatsheet, add more practice questions, etc.

## Visual skins

The skill ships with three validated, distinctive aesthetics. They are NOT interchangeable variations of the same design — each commits fully to a different visual point of view.

| Skin | Best for | Vibe |
|---|---|---|
| **A. Bright Friendly** | Business, innovation, humanities | warm beige + orange, storybook |
| **B. Academic Terminal** | CS, data, math, physics, engineering | deep ink + electric lime, scholarly lab |
| **C. Paper Editorial** | Operations, supply chain, case-study | cream paper + ink, magazine feature |

See `SKILL.md` for full details, palette, and class contract.

## Customizing for your school / course

- The skill uses generic phrases ("ELI5", "exam trap"). Each skin uses bilingual labels (Chinese + English) by default. Replace freely.
- The dark-horse pattern (find slide content absent from past papers) generalizes to any course with reusable past papers.
- The 6-section concept card is opinionated — based on the validated structure across multiple HKUST courses. You can drop sections you don't need (e.g., flip-cards if your course has minimal terminology).
- The skin CSS is plain CSS variables — recolor freely.

## Anatomy

```
interactive-study-notes/
├── SKILL.md                    main skill instructions (Claude reads this)
├── README.md                   this file
├── references/
│   ├── workflow.md             Phase 1-4 step-by-step
│   └── components.md           HTML/CSS/JS snippets for every interactive component
└── assets/
    ├── notes-bright.css        Skin A — bright friendly
    ├── notes-bright.js
    ├── notes-terminal.css      Skin B — academic terminal
    ├── notes-terminal.js
    ├── notes-editorial.css     Skin C — paper editorial (different class contract)
    └── notes-editorial.js
```

When the skill produces notes for your course, it copies the chosen skin's CSS and JS into your `interactive note/assets/` folder, renames them to `notes.css` / `notes.js`, and links each lecture HTML to those relative paths.

## Limitations

- Claude can't open a browser to verify interactivity itself — you have to spot-check the produced HTML by opening it.
- Subagent fan-out is fast but can be token-expensive for large courses (15+ lectures). The skill batches sensibly but a 17-lecture course can use ~150-200k tokens end-to-end.
- KaTeX is loaded from CDN by default. For fully offline classrooms, download KaTeX manually and update the asset paths.
- The skill assumes lecture content is in PDFs/PPTs in a single folder. For more exotic sources (videos, websites), pre-process to PDF first.

## License

MIT. Use freely; PRs welcome if you build new skins, components, or workflow improvements.
