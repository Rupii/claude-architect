import type { StudyDay } from '../types';

export const studyPlan: StudyDay[] = [
  {
    day: 1,
    title: 'Agentic Architecture & Orchestration',
    description:
      'Focus on the highest-weight domain (27%). Master multi-agent system design, orchestration patterns, memory strategies, human-in-the-loop design, and security principles. This is the core of the exam and deserves the most study time.',
    domains: ['domain-1'],
    estimatedHours: 4,
    tasks: [
      {
        id: 'd1t1',
        label: 'Read Domain 1 overview and study orchestrator-subagent patterns (1.1)',
        domainId: 'domain-1',
        estimatedMinutes: 40,
      },
      {
        id: 'd1t2',
        label: 'Study agent memory types: in-context, external, episodic, semantic (1.2)',
        domainId: 'domain-1',
        estimatedMinutes: 35,
      },
      {
        id: 'd1t3',
        label: 'Learn parallel execution, fan-out/fan-in, and map-reduce patterns (1.3)',
        domainId: 'domain-1',
        estimatedMinutes: 30,
      },
      {
        id: 'd1t4',
        label: 'Study human-in-the-loop workflows, approval gates, and minimal footprint (1.4)',
        domainId: 'domain-1',
        estimatedMinutes: 35,
      },
      {
        id: 'd1t5',
        label: 'Master error handling, retry strategies, and checkpointing (1.5)',
        domainId: 'domain-1',
        estimatedMinutes: 30,
      },
      {
        id: 'd1t6',
        label: 'Study agent communication protocols and coordination (1.6)',
        domainId: 'domain-1',
        estimatedMinutes: 25,
      },
      {
        id: 'd1t7',
        label: 'Learn prompt injection, trust boundaries, and security principles (1.7)',
        domainId: 'domain-1',
        estimatedMinutes: 35,
      },
      {
        id: 'd1t8',
        label: 'Practice Domain 1 quiz questions and review explanations',
        domainId: 'domain-1',
        estimatedMinutes: 30,
      },
    ],
  },
  {
    day: 2,
    title: 'Tool Design & MCP + Claude Code Configuration',
    description:
      'Cover two complementary domains (18% + 20% = 38%). Tool Design focuses on building effective tools and MCP server integration. Claude Code Configuration covers CLAUDE.md, slash commands, hooks, CI/CD integration, permissions, and MCP configuration.',
    domains: ['domain-2', 'domain-3'],
    estimatedHours: 4.5,
    tasks: [
      {
        id: 'd2t1',
        label: 'Study tool schema design: names, descriptions, JSON Schema parameters (2.1)',
        domainId: 'domain-2',
        estimatedMinutes: 30,
      },
      {
        id: 'd2t2',
        label: 'Learn MCP architecture: hosts, clients, servers, tools, resources, prompts (2.2)',
        domainId: 'domain-2',
        estimatedMinutes: 35,
      },
      {
        id: 'd2t3',
        label: 'Study tool selection, chaining, and dynamic tool loading strategies (2.3 & 2.4)',
        domainId: 'domain-2',
        estimatedMinutes: 25,
      },
      {
        id: 'd2t4',
        label: 'Learn external API integration patterns, credential injection, and caching (2.5)',
        domainId: 'domain-2',
        estimatedMinutes: 25,
      },
      {
        id: 'd2t5',
        label: 'Master CLAUDE.md structure, hierarchy, and effective content (3.1)',
        domainId: 'domain-3',
        estimatedMinutes: 30,
      },
      {
        id: 'd2t6',
        label: 'Study custom slash commands: syntax, $ARGUMENTS, project vs. personal (3.2)',
        domainId: 'domain-3',
        estimatedMinutes: 25,
      },
      {
        id: 'd2t7',
        label: 'Learn Claude Code hooks: PreToolUse, PostToolUse, Notification, Stop (3.3)',
        domainId: 'domain-3',
        estimatedMinutes: 30,
      },
      {
        id: 'd2t8',
        label: 'Study CI/CD integration: --print flag, non-interactive mode, secrets (3.4 & 3.5)',
        domainId: 'domain-3',
        estimatedMinutes: 25,
      },
      {
        id: 'd2t9',
        label: 'Learn MCP server configuration in Claude Code settings.json (3.6)',
        domainId: 'domain-3',
        estimatedMinutes: 20,
      },
      {
        id: 'd2t10',
        label: 'Practice Domain 2 & 3 quiz questions and review explanations',
        domainId: 'domain-2',
        estimatedMinutes: 30,
      },
    ],
  },
  {
    day: 3,
    title: 'Prompt Engineering + Context Management + Scenarios',
    description:
      'Cover the remaining two domains (20% + 15% = 35%) plus study all 6 exam scenarios. Prompt Engineering covers advanced techniques, system prompts, structured outputs, validation, and context optimization. Context Management covers compression, reliability, monitoring, caching, and rate limits.',
    domains: ['domain-4', 'domain-5'],
    estimatedHours: 4.5,
    tasks: [
      {
        id: 'd3t1',
        label: 'Master CoT, few-shot, zero-shot CoT, self-consistency, prompt chaining (4.1)',
        domainId: 'domain-4',
        estimatedMinutes: 35,
      },
      {
        id: 'd3t2',
        label: 'Study system prompt design: role, context, constraints, format specification (4.2)',
        domainId: 'domain-4',
        estimatedMinutes: 30,
      },
      {
        id: 'd3t3',
        label: 'Learn structured output generation: JSON Schema, prefilling, validation (4.3 & 4.4)',
        domainId: 'domain-4',
        estimatedMinutes: 35,
      },
      {
        id: 'd3t4',
        label: 'Study context optimization: prompt caching, RAG, context pruning (4.5)',
        domainId: 'domain-4',
        estimatedMinutes: 30,
      },
      {
        id: 'd3t5',
        label: 'Learn task-specific prompting: code gen, analysis, extraction, summarization (4.6)',
        domainId: 'domain-4',
        estimatedMinutes: 25,
      },
      {
        id: 'd3t6',
        label: 'Study context window management and compression strategies (5.1 & 5.2)',
        domainId: 'domain-5',
        estimatedMinutes: 30,
      },
      {
        id: 'd3t7',
        label: 'Learn reliability patterns: graceful degradation, circuit breakers, idempotency (5.3)',
        domainId: 'domain-5',
        estimatedMinutes: 25,
      },
      {
        id: 'd3t8',
        label: 'Study observability: metrics, distributed tracing, structured logging (5.4)',
        domainId: 'domain-5',
        estimatedMinutes: 25,
      },
      {
        id: 'd3t9',
        label: 'Learn caching strategies and rate limit / retry patterns (5.5 & 5.6)',
        domainId: 'domain-5',
        estimatedMinutes: 25,
      },
      {
        id: 'd3t10',
        label: 'Review all 6 exam scenarios and identify primary domains for each',
        domainId: 'domain-4',
        estimatedMinutes: 30,
      },
      {
        id: 'd3t11',
        label: 'Practice Domain 4 & 5 quiz questions and review explanations',
        domainId: 'domain-5',
        estimatedMinutes: 30,
      },
    ],
  },
  {
    day: 4,
    title: 'Mock Tests, Review & Final Preparation',
    description:
      'Consolidate your knowledge through practice testing. Take at least one full mock test, identify weak domains, review those areas specifically, then do a final review of key concepts and exam strategy tips. Target score: 720/1000 to pass.',
    domains: ['domain-1', 'domain-2', 'domain-3', 'domain-4', 'domain-5'],
    estimatedHours: 3,
    tasks: [
      {
        id: 'd4t1',
        label: 'Take a full timed mock test (all 35 questions, ~50 minutes)',
        domainId: 'domain-1',
        estimatedMinutes: 50,
      },
      {
        id: 'd4t2',
        label: 'Review mock test results and identify lowest-scoring domains',
        domainId: 'domain-5',
        estimatedMinutes: 20,
      },
      {
        id: 'd4t3',
        label: 'Deep-dive review of weak domain task statements and key concepts',
        domainId: 'domain-3',
        estimatedMinutes: 45,
      },
      {
        id: 'd4t4',
        label: 'Take a second domain-specific practice test on weakest domain',
        domainId: 'domain-4',
        estimatedMinutes: 30,
      },
      {
        id: 'd4t5',
        label: 'Review all 5 domain summaries and key concept definitions',
        domainId: 'domain-2',
        estimatedMinutes: 30,
      },
      {
        id: 'd4t6',
        label: 'Final review: exam format, passing score (720/1000), scenario strategy',
        domainId: 'domain-4',
        estimatedMinutes: 15,
      },
    ],
  },
];
