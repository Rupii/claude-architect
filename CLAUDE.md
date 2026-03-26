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

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
