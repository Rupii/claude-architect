import { useState } from 'react';
import { domains } from '../../data/domains';
import { useProgress } from '../../hooks/useProgress';
import type { TaskStatement } from '../../types';
import { TASK_DIAGRAMS } from './TaskDiagrams';

const domainBgColors: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-amber-500',
  red: 'bg-red-500',
};

const domainTextColors: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  green: 'text-green-600 dark:text-green-400',
  orange: 'text-amber-600 dark:text-amber-400',
  red: 'text-red-600 dark:text-red-400',
};

const domainBorderColors: Record<string, string> = {
  blue: 'border-blue-200 dark:border-blue-800',
  purple: 'border-purple-200 dark:border-purple-800',
  green: 'border-green-200 dark:border-green-800',
  orange: 'border-amber-200 dark:border-amber-800',
  red: 'border-red-200 dark:border-red-800',
};

const domainBorderLeftColors: Record<string, string> = {
  blue: 'border-l-blue-400 dark:border-l-blue-500',
  purple: 'border-l-purple-400 dark:border-l-purple-500',
  green: 'border-l-green-400 dark:border-l-green-500',
  orange: 'border-l-amber-400 dark:border-l-amber-500',
  red: 'border-l-red-400 dark:border-l-red-500',
};

const domainTintBg: Record<string, string> = {
  blue: 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40',
  purple: 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40',
  green: 'bg-green-50/60 dark:bg-green-950/20 border-green-100 dark:border-green-900/40',
  orange: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40',
  red: 'bg-red-50/60 dark:bg-red-950/20 border-red-100 dark:border-red-900/40',
};

function TaskStatementCard({ ts, color }: { ts: TaskStatement; color: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md ${domainBorderColors[color]}`} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs font-bold ${domainTextColors[color]}`}>{ts.id}</span>
          <span className="font-medium text-gray-900 dark:text-white text-sm">{ts.title}</span>
          {ts.keyConcepts && ts.keyConcepts.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 ml-1">
              {ts.keyConcepts.length} concepts
            </span>
          )}
        </div>
        <span className="text-gray-400 dark:text-gray-500 ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 space-y-4">
          {/* Overview — domain-tinted panel */}
          <div className={`rounded-lg p-3 border ${domainTintBg[color]}`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${domainTextColors[color]}`}>
              <span className={`w-1 h-3 rounded-full flex-shrink-0 ${domainBgColors[color]}`} />
              Overview
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{ts.explanation}</p>
          </div>

          {TASK_DIAGRAMS[ts.id] && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3 rounded-full flex-shrink-0 bg-gray-400 dark:bg-gray-500" />
                Diagram
              </h4>
              {TASK_DIAGRAMS[ts.id]}
            </div>
          )}

          {/* Key Concepts — amber accent */}
          {ts.keyConcepts && ts.keyConcepts.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3 rounded-full flex-shrink-0 bg-amber-500" />
                Key Concepts
              </h4>
              <div className="space-y-2">
                {ts.keyConcepts.map((kc, i) => (
                  <div key={i} className={`bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 border-l-4 ${domainBorderLeftColors[color]}`}>
                    <div className={`font-bold text-sm ${domainTextColors[color]}`}>{kc.term}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{kc.definition}</div>
                    {kc.example && (
                      <div className="text-xs mt-1.5 px-2 py-1 rounded bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600 italic">
                        eg. {kc.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge & Skills grid — each in its own card */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${domainTextColors[color]}`}>
                <span className={`w-1 h-3 rounded-full flex-shrink-0 ${domainBgColors[color]}`} />
                Knowledge
              </h4>
              <ul className="space-y-1.5">
                {ts.knowledge.map((k, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className={`mt-1 w-2 h-2 rounded-sm flex-shrink-0 rotate-45 ${domainBgColors[color]}`} />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3 rounded-full flex-shrink-0 bg-emerald-500" />
                Skills
              </h4>
              <ul className="space-y-1.5">
                {ts.skills.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 font-bold text-xs">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudyGuide() {
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const { progress, updateNote } = useProgress();

  const selectedDomain = domains.find((d) => d.id === selectedDomainId) ?? domains[0];
  const note = progress.notes[selectedDomainId] ?? '';

  const filteredTasks = selectedDomain?.taskStatements.filter((ts) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      ts.title.toLowerCase().includes(q) ||
      ts.knowledge.some((k) => k.toLowerCase().includes(q)) ||
      ts.skills.some((s) => s.toLowerCase().includes(q))
    );
  }) ?? [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Guide</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          In-depth coverage of all 5 exam domains
        </p>
      </div>

      <div className="flex gap-6">
        {/* Domain list */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-1 sticky top-16 max-h-[calc(100vh-120px)] overflow-y-auto">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => { setSelectedDomainId(domain.id); setSearch(''); }}
                aria-label={`Select domain: ${domain.name}`}
                style={selectedDomainId === domain.id ? { background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)' } : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                  selectedDomainId === domain.id
                    ? `text-white dark:text-white font-semibold shadow-md`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${domainBgColors[domain.color]}`}
                  />
                  <span className="truncate">{domain.name.split(' ')[0]}</span>
                </div>
                <div className="text-xs opacity-60 mt-0.5 pl-4">{domain.weight}%</div>
                <div className="pl-4 mt-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${domainBgColors[domain.color]}`}
                      style={{ width: `${domain.weight * 3}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {selectedDomain && (
            <>
              <div className={`flex items-center gap-3 mb-4 p-5 rounded-xl border-2 ${domainBorderColors[selectedDomain.color]} bg-white dark:bg-gray-800 shadow-sm`} style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${domainBgColors[selectedDomain.color]} shadow-md`}>
                  <span className="text-white text-lg font-black">{selectedDomain.name[0]}</span>
                </div>
                <div>
                  <h2 className={`font-bold text-lg ${domainTextColors[selectedDomain.color]}`}>
                    {selectedDomain.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedDomain.weight}% of exam · {selectedDomain.taskStatements.length} task statements</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium border border-gray-200 dark:border-gray-700">
                  📋 {selectedDomain.taskStatements.length} task statements
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium border border-blue-100 dark:border-blue-900/40">
                  🧠 {selectedDomain.taskStatements.reduce((sum, ts) => sum + ts.knowledge.length, 0)} knowledge points
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-medium border border-purple-100 dark:border-purple-900/40">
                  ⚡ {selectedDomain.taskStatements.reduce((sum, ts) => sum + ts.skills.length, 0)} skills
                </span>
              </div>

              <input
                type="text"
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="space-y-2 mb-6">
                {filteredTasks.map((ts) => (
                  <TaskStatementCard key={ts.id} ts={ts} color={selectedDomain.color} />
                ))}
                {filteredTasks.length === 0 && (
                  <p className="text-center text-gray-400 dark:text-gray-500 py-8">No topics match "{search}"</p>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>✏️</span> My Notes — {selectedDomain.name}
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => updateNote(selectedDomainId, e.target.value)}
                  placeholder="Add your notes here..."
                  rows={4}
                  className="w-full text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
