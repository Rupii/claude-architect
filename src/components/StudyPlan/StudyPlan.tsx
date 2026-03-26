import { useState } from 'react';
import { studyPlan } from '../../data/studyPlan';
import { useProgress } from '../../hooks/useProgress';
import type { StudyDay } from '../../types';

const domainColors: Record<string, string> = {
  'domain-1': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'domain-2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'domain-3': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'domain-4': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'domain-5': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

function DayCard({ day, completedTasks, toggleTask, toggleAll }: {
  day: StudyDay;
  completedTasks: string[];
  toggleTask: (id: string) => void;
  toggleAll: (ids: string[], check: boolean) => void;
}) {
  const completed = day.tasks.filter((t) => completedTasks.includes(t.id)).length;
  const pct = Math.round((completed / day.tasks.length) * 100);
  const isComplete = completed === day.tasks.length;
  const isIndeterminate = completed > 0 && !isComplete;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 transition-all ${
        isComplete
          ? 'border-green-200 dark:border-green-800/60'
          : 'border-gray-100 dark:border-gray-800'
      }`}
      style={{ boxShadow: isComplete ? '0 4px 20px rgba(34,197,94,0.12), 0 1px 4px rgba(0,0,0,0.05)' : '0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg tracking-wide ${
              isComplete
                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/40'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
            }`}>
              DAY {day.day}
            </span>
            {isComplete && <span className="text-green-500 text-lg">✓</span>}
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white mt-1.5 text-xl tracking-tight">
            {day.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {day.description} · ~{day.estimatedHours}h
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{pct}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{completed}/{day.tasks.length}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-4">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : 'linear-gradient(90deg, #3b82f6, #6366f1)'
          }}
        />
      </div>

      {/* Select all row */}
      <label className="flex items-center gap-2 mb-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={isComplete}
          ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
          onChange={() => toggleAll(day.tasks.map((t) => t.id), !isComplete)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
        />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 uppercase tracking-wide">
          {isComplete ? 'Deselect all' : 'Select all'}
        </span>
      </label>

      {/* Task list */}
      <ul className="space-y-3">
        {day.tasks.map((task) => {
          const done = completedTasks.includes(task.id);
          return (
            <li key={task.id}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTask(task.id)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-sm transition-colors ${
                    done
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}>
                    {task.label}
                  </span>
                  <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                    {task.estimatedMinutes}min
                  </span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold tracking-wide ${domainColors[task.domainId] || 'bg-gray-100 text-gray-600'}`}>
                  D{task.domainId.replace('domain-', '')}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function StudyPlan() {
  const { progress, toggleTask } = useProgress();

  function toggleAll(ids: string[], check: boolean) {
    ids.forEach((id) => {
      const done = progress.completedTasks.includes(id);
      if (check && !done) toggleTask(id);
      if (!check && done) toggleTask(id);
    });
  }
  const totalTasks = studyPlan.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTotal = studyPlan
    .flatMap((d) => d.tasks)
    .filter((t) => progress.completedTasks.includes(t.id)).length;
  const overallPct = Math.round((completedTotal / totalTasks) * 100);

  const [name, setName] = useState(() => localStorage.getItem('userName') ?? '');
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);

  function saveName() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setName(trimmed);
    localStorage.setItem('userName', trimmed);
    setEditing(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Hero greeting banner */}
      {!name ? (
        <div
          className="rounded-2xl p-6 border-2 border-dashed border-blue-300 dark:border-blue-700"
          style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 dark:text-blue-300 mb-1">Before you begin</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Who's studying today?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter your name so we can make this feel like yours.</p>
          <div className="flex gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); }}
              placeholder="e.g. Rupesh"
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base outline-none focus:border-blue-500 placeholder:font-normal placeholder:text-gray-400"
            />
            <button
              onClick={saveName}
              className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
            >
              Let's go →
            </button>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #312e81 100%)', boxShadow: '0 8px 32px rgba(59,130,246,0.2)' }}
        >
          {/* decorative blobs */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />

          <p className="text-blue-300/70 text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-3xl font-black text-white leading-tight">
            {name.toUpperCase()}.
          </h1>
          <p className="text-blue-200/80 text-base mt-1 font-medium">
            Your 4-day plan to crack the certification. Let's make it count.
          </p>
          <button
            onClick={() => { setDraft(name); setEditing(true); }}
            className="mt-3 text-xs text-blue-400/60 hover:text-blue-300 transition-colors underline underline-offset-2"
          >
            Not {name}?
          </button>

          {/* inline edit */}
          {editing && (
            <div className="mt-3 flex gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false); }}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-semibold outline-none placeholder:text-white/30 text-sm"
                placeholder="Your name"
              />
              <button onClick={saveName} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg">Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-2 text-white/50 hover:text-white text-sm">✕</button>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">4-Day Study Plan</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
          Complete all domains before exam day. {completedTotal}/{totalTasks} tasks done.
        </p>
        <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #22c55e 100%)' }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{overallPct}% overall complete</p>
      </div>

      {studyPlan.map((day) => (
        <DayCard
          key={day.day}
          day={day}
          completedTasks={progress.completedTasks}
          toggleTask={toggleTask}
          toggleAll={toggleAll}
        />
      ))}
    </div>
  );
}
