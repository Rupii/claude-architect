import { useState } from 'react';
import { domains } from '../../data/domains';

const domainColors: Record<string, {
  bg: string; text: string; border: string; borderLeft: string; dot: string; tint: string; badge: string;
}> = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    borderLeft: 'border-l-blue-400 dark:border-l-blue-500',
    dot: 'bg-blue-500',
    tint: 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    borderLeft: 'border-l-purple-400 dark:border-l-purple-500',
    dot: 'bg-purple-500',
    tint: 'bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    borderLeft: 'border-l-green-400 dark:border-l-green-500',
    dot: 'bg-green-500',
    tint: 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/40',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  orange: {
    bg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    borderLeft: 'border-l-amber-400 dark:border-l-amber-500',
    dot: 'bg-amber-500',
    tint: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    borderLeft: 'border-l-red-400 dark:border-l-red-500',
    dot: 'bg-red-500',
    tint: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40',
    badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  },
};

export default function Highlights() {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  // tracks which topic is open per domain: { domainId: taskId | null }
  const [openTopics, setOpenTopics] = useState<Record<string, string | null>>({});

  const toggleTopic = (domainId: string, taskId: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [domainId]: prev[domainId] === taskId ? null : taskId,
    }));
  };

  const totalConcepts = domains.reduce(
    (sum, d) => sum + d.taskStatements.reduce((s, ts) => s + (ts.keyConcepts?.length ?? 0), 0),
    0
  );

  const filtered = activeDomain ? domains.filter((d) => d.id === activeDomain) : domains;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Key Concepts</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold">
            {totalConcepts} total
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">All key concepts from all 5 exam domains, consolidated.</p>
      </div>

      {/* Domain filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveDomain(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
            activeDomain === null
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          All Domains
        </button>
        {domains.map((d) => {
          const c = domainColors[d.color] ?? domainColors.blue;
          const count = d.taskStatements.reduce((s, ts) => s + (ts.keyConcepts?.length ?? 0), 0);
          return (
            <button
              key={d.id}
              onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                activeDomain === d.id
                  ? `${c.badge} border-transparent`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {d.name.split(' &')[0].split(' ').slice(0, 2).join(' ')}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Domains */}
      {filtered.map((domain) => {
        const c = domainColors[domain.color] ?? domainColors.blue;
        const totalDomainConcepts = domain.taskStatements.reduce((s, ts) => s + (ts.keyConcepts?.length ?? 0), 0);
        if (totalDomainConcepts === 0) return null;

        return (
          <div key={domain.id}>
            {/* Domain header */}
            <div className={`flex items-center gap-3 mb-3 pb-2 border-b ${c.border}`}>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}`} />
              <h2 className={`font-bold text-base ${c.text}`}>{domain.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.badge}`}>
                {domain.weight}% weight
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-600 ml-auto">
                {totalDomainConcepts} concepts
              </span>
            </div>

            {/* Grouped by topic (task statement) — accordion */}
            <div className="space-y-1.5">
              {domain.taskStatements.filter((ts) => ts.keyConcepts?.length).map((ts) => {
                const isOpen = openTopics[domain.id] === ts.id;
                return (
                  <div key={ts.id} className={`rounded-lg border overflow-hidden ${c.border}`}>
                    {/* Topic toggle */}
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => toggleTopic(domain.id, ts.id)}
                    >
                      <span className={`font-mono text-xs font-bold flex-shrink-0 ${c.text}`}>{ts.id}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">{ts.title}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-600 flex-shrink-0 mr-1">
                        {ts.keyConcepts!.length}
                      </span>
                      <span className={`text-xs flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400`}>▼</span>
                    </button>

                    {/* Concepts — shown only when open */}
                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 space-y-2">
                        {ts.keyConcepts!.map((kc, i) => (
                          <div
                            key={i}
                            className={`bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 border-l-4 ${c.borderLeft}`}
                          >
                            <div className={`font-bold text-sm ${c.text}`}>{kc.term}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{kc.definition}</div>
                            {kc.example && (
                              <div className="text-xs mt-1.5 px-2 py-1 rounded bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600 italic">
                                eg. {kc.example}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
