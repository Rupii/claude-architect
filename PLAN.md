# Plan: Claude Certified Architect – Foundations Exam Prep App

## Context
Prepare for the **Claude Certified Architect – Foundations** certification exam in 4 days. A React frontend app that consolidates study materials, a mock test component, and file-based progress tracking — all in one place.

### Exam Details (from the prep guide PDF)
- **Format**: Multiple choice (1 correct, 3 distractors), pass/fail, min score 720/1000
- **Scenarios**: 4 of 6 scenarios presented randomly per exam
- **5 Domains**:
  1. Agentic Architecture & Orchestration (27%)
  2. Tool Design & MCP Integration (18%)
  3. Claude Code Configuration & Workflows (20%)
  4. Prompt Engineering & Structured Output (20%)
  5. Context Management & Reliability (15%)

---

## Architecture

### Tech Stack
- **React** (via Vite + TypeScript) — fast setup, modern tooling
- **React Router** — for navigation between sections
- **Tailwind CSS** — utility-first styling for rapid UI development
- **localStorage + JSON file** — for progress persistence (no backend server)

### Project Structure
```
claude-exam-prep/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/           # Nav, sidebar, header
│   │   ├── StudyPlan/        # 4-day study plan view
│   │   ├── StudyGuide/       # Domain-by-domain study content
│   │   ├── MockTest/         # Quiz engine
│   │   └── Progress/         # Progress tracker
│   ├── data/
│   │   ├── studyPlan.ts      # 4-day plan data
│   │   ├── domains.ts        # All 5 domains with task statements, knowledge, skills
│   │   ├── questions.ts      # Mock test question bank
│   │   └── scenarios.ts      # 6 exam scenarios with descriptions
│   ├── hooks/
│   │   └── useProgress.ts    # Hook for reading/writing progress
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── utils/
│   │   └── progress.ts       # localStorage + JSON export/import helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── progress.json             # File-based progress snapshot (exportable)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── CLAUDE.md
```

---

## Implementation Steps

### Step 1: Scaffold the React project
- `npm create vite@latest . -- --template react-ts`
- Install dependencies: `react-router-dom`, `tailwindcss`
- Configure Tailwind and basic Vite config

### Step 2: Create data layer (`src/data/`)
Build the core content files from the exam guide:

**`domains.ts`** — All 5 domains with:
- Domain name, weight percentage
- Task statements (1.1–1.7, 2.1–2.5, 3.1–3.6, 4.1–4.6, 5.1–5.6)
- Knowledge points and skills for each task statement

**`studyPlan.ts`** — 4-day study plan:
- **Day 1**: Domain 1 (Agentic Architecture, 27%) + Domain 2 (Tool Design & MCP, 18%) — heaviest topics first
- **Day 2**: Domain 3 (Claude Code Config, 20%) + Domain 4 (Prompt Engineering, 20%)
- **Day 3**: Domain 5 (Context Management, 15%) + Review all scenarios + Practice exercises
- **Day 4**: Mock tests + Review weak areas + Final review of sample questions

**`questions.ts`** — Mock test question bank:
- Include the 12 sample questions from the guide (with explanations)
- Generate ~18 additional questions covering all 5 domains (~30 total)
- Each question: scenario context, question text, 4 options, correct answer, explanation, domain tag

**`scenarios.ts`** — The 6 exam scenarios with descriptions and primary domains

### Step 3: Build core components

**`Layout`** — App shell with:
- Top nav bar with app title
- Sidebar with navigation links (Study Plan, Study Guide, Mock Test, Progress)
- Main content area

**`StudyPlan`** — 4-day plan view:
- Day-by-day breakdown with checkboxes
- Topics for each day with time estimates
- Checklist items the user can mark complete
- Progress bar per day

**`StudyGuide`** — Domain study content:
- Accordion/tab view by domain
- Each domain shows weight, task statements, knowledge points, skills
- Expandable sections with **detailed explanations** teaching each concept (not just listing topics)
- Key concepts highlighted with practical examples
- Links between related topics across domains

**`MockTest`** — Quiz engine:
- Mode selection: Full test (all domains) or domain-specific practice
- Question display with 4 options
- Submit and review with explanations
- Score summary with domain-level breakdown
- Track attempts and scores over time

**`Progress`** — Progress tracker:
- Overall completion percentage
- Per-domain study completion
- Mock test history (scores, dates, weak domains)
- Export/import progress as JSON file
- Visual indicators (progress bars, domain coverage chart)

### Step 4: Progress persistence (`useProgress` hook)
- Store progress in `localStorage` for instant persistence
- Export to `progress.json` for file-based backup
- Import from `progress.json` to restore state
- Track: study checklist completion, mock test results, notes

### Step 5: Styling and UX
- Clean, distraction-free study interface
- Mobile-responsive for studying on the go
- Dark/light mode toggle
- Domain color-coding consistent throughout the app

---

## Files to Create (in order)
1. Vite project scaffold (package.json, vite.config.ts, tsconfig.json, index.html)
2. Tailwind config (tailwind.config.js, postcss.config.js, src/index.css)
3. `src/types/index.ts`
4. `src/data/domains.ts`
5. `src/data/studyPlan.ts`
6. `src/data/scenarios.ts`
7. `src/data/questions.ts`
8. `src/utils/progress.ts`
9. `src/hooks/useProgress.ts`
10. `src/components/Layout/` (Layout, Sidebar, Nav)
11. `src/components/StudyPlan/StudyPlan.tsx`
12. `src/components/StudyGuide/StudyGuide.tsx`
13. `src/components/MockTest/MockTest.tsx`
14. `src/components/Progress/Progress.tsx`
15. `src/App.tsx` + `src/main.tsx`
16. `CLAUDE.md`

---

## Verification
1. `npm run dev` — app starts and renders
2. Navigate to each section (Study Plan, Study Guide, Mock Test, Progress)
3. Complete a mock test and verify score calculation
4. Mark study items complete and verify progress persistence
5. Export/import progress JSON
6. Refresh page and verify localStorage persistence
