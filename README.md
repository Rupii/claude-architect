# Claude Certified Architect – Foundations Exam Prep

A fully offline, interactive study app for the **Claude Certified Architect – Foundations** certification exam.

**Live app:** https://claude-exam-prep-jet.vercel.app

![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss)

## Features

- **Study Plan** — 4-day structured checklist with per-day and per-domain progress tracking
- **Study Guide** — All 5 exam domains with 30 task statements, key concepts, knowledge points, skills, and hand-drawn Excalidraw-style diagrams
- **Mock Test** — 50 questions with full/domain mode, instant feedback, and explanations
- **Progress Dashboard** — Completion stats, score trend chart, test history, and JSON export/import

## Exam Coverage

| Domain | Weight | Task Statements |
|--------|--------|----------------|
| Agentic Architecture & Orchestration | 27% | 7 |
| Tool Design & MCP | 18% | 5 |
| Claude Code Configuration | 20% | 6 |
| Prompt Engineering | 20% | 6 |
| Context Management | 15% | 6 |

**Passing score: 720 / 1000**

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & Deploy

```bash
npm run build      # outputs to dist/
```

The `dist/` folder is pure static HTML/CSS/JS — drop it on any static host (Netlify, Vercel, GitHub Pages) or open `index.html` directly in a browser. No server required.

## Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **localStorage** for progress persistence (no backend)
- All data is static TypeScript files in `src/data/`
