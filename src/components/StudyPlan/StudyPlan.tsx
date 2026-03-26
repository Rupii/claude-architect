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

function DayCard({ day, completedTasks, toggleTask }: {
  day: StudyDay;
  completedTasks: string[];
  toggleTask: (id: string) => void;
}) {
  const completed = day.tasks.filter((t) => completedTasks.includes(t.id)).length;
  const pct = Math.round((completed / day.tasks.length) * 100);
  const isComplete = completed === day.tasks.length;

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
          <div className="text-xs text-gray-500">{completed}/{day.tasks.length}</div>
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
                  <span className="ml-2 text-xs text-gray-400">
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
  const totalTasks = studyPlan.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTotal = studyPlan
    .flatMap((d) => d.tasks)
    .filter((t) => progress.completedTasks.includes(t.id)).length;
  const overallPct = Math.round((completedTotal / totalTasks) * 100);

  const [name, setName] = useState(() => localStorage.getItem('userName') ?? '');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  function saveName() {
    const trimmed = draft.trim();
    setName(trimmed);
    localStorage.setItem('userName', trimmed);
    setEditing(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        {/* Greeting / name */}
        <div className="flex items-center gap-2 mb-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false); }}
                placeholder="Your name"
                className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 outline-none text-gray-900 dark:text-white w-48"
              />
              <button onClick={saveName} className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
              <button onClick={() => setEditing(false)} className="text-sm px-2 py-1 text-gray-400 hover:text-gray-600">✕</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {name ? `Hey ${name}, here is your 4-Day Study Plan` : '4-Day Study Plan'}
              </h1>
              <button
                onClick={() => { setDraft(name); setEditing(true); }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-opacity text-sm"
                title="Edit name"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
        {!name && !editing && (
          <button onClick={() => { setDraft(''); setEditing(true); }} className="text-xs text-blue-500 hover:underline mb-1 block">
            + Add your name for a personal greeting
          </button>
        )}
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complete all domains before exam day. {completedTotal}/{totalTasks} tasks done.
        </p>
        <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #22c55e 100%)' }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{overallPct}% overall complete</p>
      </div>

      {studyPlan.map((day) => (
        <DayCard
          key={day.day}
          day={day}
          completedTasks={progress.completedTasks}
          toggleTask={toggleTask}
        />
      ))}
    </div>
  );
}
