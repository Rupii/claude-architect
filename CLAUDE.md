# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

React + Vite + TypeScript exam prep app for the **Claude Certified Architect – Foundations** certification exam. See `PLAN.md` for full architecture details.

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS (utility-first styling)
- React Router (client-side navigation)
- localStorage for progress persistence (no backend)

## Architecture

The app has 4 main views navigated via sidebar:
- **Study Plan** — 4-day checklist with per-day progress bars
- **Study Guide** — accordion per domain, detailed concept explanations
- **Mock Test** — quiz engine with score tracking and explanations
- **Progress** — completion stats, test history, JSON export/import

Data is purely static TypeScript files in `src/data/`:
- `domains.ts` — 5 exam domains, task statements, knowledge points, skills
- `studyPlan.ts` — 4-day plan structure with checklist items
- `questions.ts` — ~30 mock questions with explanations and domain tags
- `scenarios.ts` — 6 exam scenarios with descriptions

Progress state lives in `localStorage` via the `useProgress` hook (`src/hooks/useProgress.ts`). The hook also supports export/import of a `progress.json` snapshot.

## Exam Context

- **Passing score**: 720/1000
- **5 Domains** (by weight): Agentic Architecture & Orchestration (27%), Claude Code Config (20%), Prompt Engineering (20%), Tool Design & MCP (18%), Context Management (15%)
- **6 Scenarios** (4 of 6 shown randomly per exam): Customer Support Agent, Code Generation, Multi-Agent Research, Developer Productivity, CI/CD Integration, Structured Data Extraction
