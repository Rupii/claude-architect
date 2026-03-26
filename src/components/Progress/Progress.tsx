import { useRef } from 'react';
import { studyPlan } from '../../data/studyPlan';
import { domains } from '../../data/domains';
import { useProgress } from '../../hooks/useProgress';

// Static exam domain weights for the donut chart
const EXAM_WEIGHTS = [
  { id: 'domain-1', name: 'Agentic Architecture & Orchestration', weight: 27, color: '#3b82f6' },
  { id: 'domain-2', name: 'Tool Design & MCP',                    weight: 18, color: '#a855f7' },
  { id: 'domain-3', name: 'Claude Code Config',                   weight: 20, color: '#22c55e' },
  { id: 'domain-4', name: 'Prompt Engineering',                   weight: 20, color: '#f59e0b' },
  { id: 'domain-5', name: 'Context Management',                   weight: 15, color: '#ef4444' },
];

const CIRCUMFERENCE = 2 * Math.PI * 45; // 282.743

function buildDonutSegments() {
  let cumulative = 0;
  return EXAM_WEIGHTS.map((d) => {
    const dashArray = (d.weight / 100) * CIRCUMFERENCE;
    const dashOffset = -(cumulative / 100) * CIRCUMFERENCE;
    cumulative += d.weight;
    return { ...d, dashArray, dashOffset };
  });
}

const DONUT_SEGMENTS = buildDonutSegments();

export default function Progress() {
  const { progress, exportProgress, importProgress, resetProgress } = useProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Study completion by domain
  const allTasks = studyPlan.flatMap((d) => d.tasks);
  const totalTasks = allTasks.length;
  const completedTotal = allTasks.filter((t) => progress.completedTasks.includes(t.id)).length;
  const overallPct = totalTasks > 0 ? Math.round((completedTotal / totalTasks) * 100) : 0;

  const domainTaskCounts = domains.map((domain) => {
    const domainTasks = allTasks.filter((t) => t.domainId === domain.id);
    const done = domainTasks.filter((t) => progress.completedTasks.includes(t.id)).length;
    return { domain, total: domainTasks.length, done };
  });

  const dotColors: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-amber-500',
    red: 'bg-red-500',
  };

  const barColors: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-amber-500',
    red: 'bg-red-500',
  };

  // Score trend: last 10 tests in chronological order (oldest → newest)
  const recentTests = [...progress.testResults]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  const BAR_WIDTH = 24;
  const BAR_GAP = 4;
  const CHART_HEIGHT = 80;
  const BAR_MAX_HEIGHT = 60;
  const BAR_TOP = 10;
  // y coordinate of the 720/1000 pass line
  const PASS_LINE_Y = BAR_TOP + (1 - 0.72) * BAR_MAX_HEIGHT; // 26.8

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {completedTotal === 0 && progress.testResults.length === 0 && (
        <div className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 p-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)', boxShadow: '0 8px 24px rgba(59,130,246,0.1)' }}>
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Welcome! Start your exam prep</h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Complete these 3 steps to track your progress here.</p>
          <ol className="space-y-1 text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside">
            <li>Work through the <strong>Study Plan</strong> daily checklist</li>
            <li>Review concepts in the <strong>Study Guide</strong></li>
            <li>Take a <strong>Mock Test</strong> to see your score</li>
          </ol>
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress</h1>

      {/* Overall */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Overall Study Completion</h2>
          <span className="text-4xl font-black" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{overallPct}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #22c55e 100%)' }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{completedTotal} of {totalTasks} tasks completed</p>
      </div>

      {/* Exam Domain Weights — static donut chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500 inline-block"></span>
          Exam Domain Weights
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut SVG */}
          <div className="flex-shrink-0">
            <svg viewBox="0 0 120 120" width="160" height="160" aria-label="Exam domain weight donut chart">
              <g transform="rotate(-90 60 60)">
                {DONUT_SEGMENTS.map((seg) => (
                  <circle
                    key={seg.id}
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={`${seg.dashArray} ${CIRCUMFERENCE}`}
                    strokeDashoffset={seg.dashOffset}
                  />
                ))}
              </g>
            </svg>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-2 min-w-0">
            {EXAM_WEIGHTS.map((d) => (
              <div key={d.id} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                  {d.name}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-auto pl-2 flex-shrink-0">
                  {d.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-green-500 to-blue-500 inline-block"></span>
          Domain Progress
        </h2>
        <div className="space-y-3">
          {domainTaskCounts.map(({ domain, total, done }) => {
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={domain.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${dotColors[domain.color]}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{domain.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({domain.weight}%)</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{done}/{total}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${barColors[domain.color]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test history */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-500 to-red-500 inline-block"></span>
          Test History ({progress.testResults.length})
        </h2>
        {progress.testResults.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">
            No tests taken yet. Head to Mock Test to get started.
          </p>
        ) : (
          <>
            {/* Score Trend Bar Chart */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Score trend (last {recentTests.length} test{recentTests.length !== 1 ? 's' : ''})</p>
              <svg
                viewBox={`0 0 ${recentTests.length * (BAR_WIDTH + BAR_GAP) + 24} ${CHART_HEIGHT}`}
                width="100%"
                style={{ maxWidth: 360 }}
                aria-label="Score trend bar chart"
              >
                {/* Pass line */}
                <line
                  x1="0"
                  y1={PASS_LINE_Y}
                  x2={recentTests.length * (BAR_WIDTH + BAR_GAP) + 20}
                  y2={PASS_LINE_Y}
                  stroke="#9ca3af"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* "720" label at right end of pass line */}
                <text
                  x={recentTests.length * (BAR_WIDTH + BAR_GAP) + 22}
                  y={PASS_LINE_Y + 3}
                  fontSize="7"
                  fill="#9ca3af"
                  textAnchor="start"
                >
                  720
                </text>

                {/* Bars */}
                {recentTests.map((r, i) => {
                  const barH = Math.max(2, (r.score / 1000) * BAR_MAX_HEIGHT);
                  const barX = i * (BAR_WIDTH + BAR_GAP);
                  const barY = BAR_TOP + BAR_MAX_HEIGHT - barH;
                  const fill = r.score >= 720 ? '#22c55e' : '#ef4444';
                  return (
                    <g key={r.id}>
                      <rect
                        x={barX}
                        y={barY}
                        width={BAR_WIDTH}
                        height={barH}
                        fill={fill}
                        rx="2"
                      />
                      <text
                        x={barX + BAR_WIDTH / 2}
                        y={barY - 2}
                        fontSize="7"
                        fill="#9ca3af"
                        textAnchor="middle"
                      >
                        {r.score}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                    <th className="pb-2 pr-4 font-medium">Date</th>
                    <th className="pb-2 pr-4 font-medium">Mode</th>
                    <th className="pb-2 pr-4 font-medium">Score</th>
                    <th className="pb-2 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {[...progress.testResults].reverse().map((r) => (
                    <tr key={r.id} className="text-gray-700 dark:text-gray-300">
                      <td className="py-2 pr-4">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-2 pr-4 capitalize">{r.mode === 'domain' && r.domainId ? domains.find(d => d.id === r.domainId)?.name.split(' ')[0] ?? r.domainId : 'Full'}</td>
                      <td className="py-2 pr-4 font-mono font-semibold">{r.score}/1000</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.score >= 720
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        }`}>
                          {r.score >= 720 ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportProgress}
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
          >
            ↓ Export progress.json
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
          >
            Import progress.json
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) resetProgress();
            }}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg transition-colors"
          >
            Reset Progress
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await importProgress(file);
            }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Last updated: {progress.lastUpdated ? new Date(progress.lastUpdated).toLocaleString() : 'Never'}
        </p>
      </div>
    </div>
  );
}
