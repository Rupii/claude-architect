import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions as allQuestions } from '../../data/questions';
import { domains } from '../../data/domains';
import { useProgress } from '../../hooks/useProgress';
import type { Question, TestResult } from '../../types';
import { PASS_SCORE, MAX_SCORE } from '../../constants/exam';

type Mode = 'select' | 'running' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Domain meta: gradient colors and icons
const DOMAIN_META: Record<string, { gradient: string; border: string; icon: string; hoverBg: string }> = {
  'domain-1': {
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    border: '#3b82f6',
    icon: '🏗️',
    hoverBg: 'rgba(59,130,246,0.06)',
  },
  'domain-2': {
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    border: '#a855f7',
    icon: '⚙️',
    hoverBg: 'rgba(168,85,247,0.06)',
  },
  'domain-3': {
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    border: '#10b981',
    icon: '✍️',
    hoverBg: 'rgba(16,185,129,0.06)',
  },
  'domain-4': {
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    border: '#f59e0b',
    icon: '🔧',
    hoverBg: 'rgba(245,158,11,0.06)',
  },
  'domain-5': {
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    border: '#ef4444',
    icon: '📦',
    hoverBg: 'rgba(239,68,68,0.06)',
  },
};

const DOMAIN_BAR_COLORS: Record<string, string> = {
  'domain-1': '#3b82f6',
  'domain-2': '#a855f7',
  'domain-3': '#22c55e',
  'domain-4': '#f59e0b',
  'domain-5': '#ef4444',
};

// Confetti piece config (CSS-only, no deps)
const CONFETTI_PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  color: ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'][i % 7],
  left: `${(i / 28) * 100}%`,
  delay: `${(i * 0.07).toFixed(2)}s`,
  size: i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 5,
  rotate: `${(i * 47) % 360}deg`,
}));

// Animated gauge hook
function useGaugeAnimation(targetFill: number, arcLength: number) {
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    function frame(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setFill(eased * targetFill);
      if (progress < 1) requestAnimationFrame(frame);
    }
    const raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [targetFill, arcLength]);
  return fill;
}

// Staggered option hook: returns per-option visible state
function useOptionStagger(questionIdx: number, count: number) {
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));
  useEffect(() => {
    setVisible(Array(count).fill(false));
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 60 + i * 60)
    );
    return () => timers.forEach(clearTimeout);
  }, [questionIdx, count]);
  return visible;
}

// Home button — shared across all modes
function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
    >
      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
      <span>Home</span>
    </button>
  );
}

export default function MockTest() {
  const navigate = useNavigate();
  const { addTestResult } = useProgress();

  const [mode, setMode] = useState<Mode>('select');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [correctFlash, setCorrectFlash] = useState(false);

  // Track hoveredDomain for select card hover lift
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const startTest = useCallback((domainId: string | null) => {
    const pool = domainId
      ? allQuestions.filter((q) => q.domainId === domainId)
      : allQuestions;
    const q = shuffle(pool).slice(0, domainId ? Math.min(10, pool.length) : 25);
    setTestQuestions(q);
    setSelectedDomainId(domainId);
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setResult(null);
    setCorrectFlash(false);
    setMode('running');
  }, []);

  const handleAnswer = useCallback(
    (optionIdx: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optionIdx);
      setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
      if (optionIdx === testQuestions[currentIdx]?.correctIndex) {
        setCorrectFlash(true);
        setTimeout(() => setCorrectFlash(false), 700);
      }
    },
    [selectedOption, currentIdx, testQuestions]
  );

  const handleNext = useCallback(() => {
    if (currentIdx < testQuestions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setCorrectFlash(false);
    } else {
      const finalAnswers = { ...answers, [currentIdx]: selectedOption ?? -1 };
      const domainScores: Record<string, { correct: number; total: number }> = {};
      let finalCorrect = 0;
      testQuestions.forEach((q, i) => {
        if (finalAnswers[i] === q.correctIndex) finalCorrect++;
        if (!domainScores[q.domainId]) domainScores[q.domainId] = { correct: 0, total: 0 };
        domainScores[q.domainId].total++;
        if (finalAnswers[i] === q.correctIndex) domainScores[q.domainId].correct++;
      });
      const score = Math.round((finalCorrect / testQuestions.length) * MAX_SCORE);
      const testResult: TestResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score,
        totalQuestions: testQuestions.length,
        correctAnswers: finalCorrect,
        domainScores,
        mode: selectedDomainId ? 'domain' : 'full',
        domainId: selectedDomainId ?? undefined,
      };
      setResult(testResult);
      addTestResult(testResult);
      setMode('done');
    }
  }, [currentIdx, testQuestions, answers, selectedOption, selectedDomainId, addTestResult]);

  // ─── SELECT MODE ─────────────────────────────────────────────────────────────
  if (mode === 'select') {
    return (
      <div className="max-w-2xl mx-auto transition-all duration-300 ease-out">
        {/* Top nav row */}
        <div className="flex items-center gap-3 mb-6">
          <HomeButton onClick={() => navigate('/')} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
          Mock Test
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          Test your knowledge · Passing score:{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {PASS_SCORE}/{MAX_SCORE}
          </span>
        </p>

        <div className="grid gap-4">
          {/* Full Practice Test — hero card */}
          <button
            onClick={() => startTest(null)}
            className="group relative overflow-hidden p-6 text-white rounded-2xl text-left transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)',
              boxShadow: '0 8px 32px rgba(59,130,246,0.35), 0 2px 8px rgba(59,130,246,0.2)',
            }}
          >
            {/* Animated shimmer overlay */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
            <div className="relative flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-xl tracking-tight">Full Practice Test</span>
            </div>
            <div className="relative text-blue-200 text-sm mb-4">
              25 questions · All 5 domains · ~30 min
            </div>
            <div className="relative flex items-center gap-1.5 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <span>Start exam simulation</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </button>

          {/* Domain cards */}
          <div className="mt-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Or practice by domain
            </p>
            <div className="grid gap-3">
              {domains.map((d) => {
                const count = allQuestions.filter((q) => q.domainId === d.id).length;
                const meta = DOMAIN_META[d.id] ?? {
                  gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  border: '#6b7280',
                  icon: '📚',
                  hoverBg: 'rgba(107,114,128,0.06)',
                };
                const isHovered = hoveredDomain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => startTest(d.id)}
                    onMouseEnter={() => setHoveredDomain(d.id)}
                    onMouseLeave={() => setHoveredDomain(null)}
                    className="group relative overflow-hidden flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl text-left focus:outline-none focus:ring-4 transition-all duration-300 ease-out"
                    style={{
                      borderLeft: `4px solid ${meta.border}`,
                      boxShadow: isHovered
                        ? `0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)`
                        : '0 1px 4px rgba(0,0,0,0.05)',
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      background: isHovered
                        ? `linear-gradient(135deg, white, ${meta.hoverBg})`
                        : undefined,
                    }}
                  >
                    {/* Animated hover background pulse */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(ellipse at 0% 50%, ${meta.hoverBg} 0%, transparent 70%)`,
                        opacity: isHovered ? 1 : 0,
                      }}
                    />

                    {/* Icon */}
                    <span
                      className="relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-transform duration-300"
                      style={{
                        background: meta.gradient,
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: `0 3px 8px ${meta.border}40`,
                      }}
                    >
                      {meta.icon}
                    </span>

                    {/* Text */}
                    <div className="relative flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {d.name}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {d.weight}% of exam · {count} questions
                      </div>
                    </div>

                    {/* Arrow */}
                    <span
                      className="relative text-gray-300 dark:text-gray-600 transition-all duration-200 text-lg"
                      style={{
                        transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                        color: isHovered ? meta.border : undefined,
                      }}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* shimmer keyframe */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes confettiFall {
            0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(180px) rotate(720deg); opacity: 0; }
          }
          @keyframes checkPop {
            0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
            60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes gaugeGlow {
            0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
            50%       { filter: drop-shadow(0 0 10px currentColor); }
          }
        `}</style>
      </div>
    );
  }

  // ─── RUNNING MODE ─────────────────────────────────────────────────────────────
  if (mode === 'running') {
    const q = testQuestions[currentIdx];
    const answered = selectedOption !== null;
    const isCorrect = selectedOption === q.correctIndex;
    const progressPct = ((currentIdx + 1) / testQuestions.length) * 100;

    return (
      <RunningView
        q={q}
        currentIdx={currentIdx}
        total={testQuestions.length}
        progressPct={progressPct}
        answered={answered}
        isCorrect={isCorrect}
        selectedOption={selectedOption}
        correctFlash={correctFlash}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onHome={() => navigate('/')}
        onExit={() => setMode('select')}
      />
    );
  }

  // ─── DONE MODE ────────────────────────────────────────────────────────────────
  if (mode === 'done' && result) {
    return (
      <DoneView
        result={result}
        onRetry={() => startTest(selectedDomainId)}
        onMenu={() => setMode('select')}
        onHome={() => navigate('/')}
      />
    );
  }

  return null;
}

// ─── RUNNING VIEW (extracted for hook usage) ──────────────────────────────────
interface RunningViewProps {
  q: Question;
  currentIdx: number;
  total: number;
  progressPct: number;
  answered: boolean;
  isCorrect: boolean;
  selectedOption: number | null;
  correctFlash: boolean;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onHome: () => void;
  onExit: () => void;
}

function RunningView({
  q,
  currentIdx,
  total,
  progressPct,
  answered,
  isCorrect,
  selectedOption,
  correctFlash,
  onAnswer,
  onNext,
  onHome,
  onExit,
}: RunningViewProps) {
  const optionVisible = useOptionStagger(currentIdx, q.options.length);
  const domainName = domains.find((d) => d.id === q.domainId)?.name ?? q.domainId;

  return (
    <div className="max-w-2xl mx-auto transition-all duration-300 ease-out">
      {/* Breadcrumb + controls */}
      <div className="flex items-center justify-between mb-5">
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
          <button
            onClick={onHome}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Mock Test</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
            {currentIdx + 1} / {total}
          </span>
          <button
            onClick={onExit}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
          >
            ✕ Exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-6 overflow-hidden shadow-inner">
        <div
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #3b82f6, #6366f1, #a855f7)',
          }}
        />
      </div>

      {/* Question card */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 transition-all duration-300 ease-out ${
          correctFlash ? 'ring-2 ring-green-400 ring-offset-2' : ''
        }`}
        style={{
          boxShadow: correctFlash
            ? '0 8px 32px rgba(34,197,94,0.18), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 8px 32px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        }}
      >
        {/* Domain + difficulty row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider truncate">
            {domainName}
          </span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              q.difficulty === 'easy'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : q.difficulty === 'medium'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}
          >
            {q.difficulty}
          </span>
        </div>

        {/* Scenario */}
        {q.scenario && (
          <div
            className="rounded-xl p-4 mb-4 text-sm text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/40 leading-relaxed"
            style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)' }}
          >
            <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider block mb-1">
              Scenario
            </span>
            {q.scenario}
          </div>
        )}

        {/* Question text */}
        <p className="font-semibold text-gray-900 dark:text-white mb-5 text-base leading-relaxed">
          {q.text}
        </p>

        {/* Options with stagger animation */}
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isSelected = i === selectedOption;
            const isCorrectOpt = i === q.correctIndex;
            let borderColor = '#e5e7eb';
            let bgColor = 'white';
            let textColor = '#111827';
            let shadowStyle = '0 1px 3px rgba(0,0,0,0.05)';
            let cursor = 'pointer';
            let opacity = '1';

            if (answered) {
              cursor = 'default';
              if (isCorrectOpt) {
                borderColor = '#22c55e';
                bgColor = '#f0fdf4';
                textColor = '#166534';
                shadowStyle = '0 2px 8px rgba(34,197,94,0.15)';
              } else if (isSelected) {
                borderColor = '#ef4444';
                bgColor = '#fef2f2';
                textColor = '#991b1b';
                shadowStyle = '0 2px 8px rgba(239,68,68,0.12)';
              } else {
                borderColor = '#f3f4f6';
                bgColor = '#f9fafb';
                textColor = '#9ca3af';
                opacity = '0.5';
              }
            }

            return (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                disabled={answered}
                className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 ease-out"
                style={{
                  borderColor,
                  backgroundColor: bgColor,
                  color: textColor,
                  boxShadow: shadowStyle,
                  cursor,
                  opacity,
                  transform: optionVisible[i] ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.25s ease ${i * 0.06}s, transform 0.25s ease ${i * 0.06}s, border-color 0.2s, background-color 0.2s, box-shadow 0.2s`,
                }}
              >
                <span className="flex items-center gap-3">
                  {/* Letter badge */}
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                    style={{
                      background: answered && isCorrectOpt
                        ? '#22c55e'
                        : answered && isSelected && !isCorrectOpt
                        ? '#ef4444'
                        : '#f3f4f6',
                      color: answered && (isCorrectOpt || (isSelected && !isCorrectOpt))
                        ? 'white'
                        : '#6b7280',
                    }}
                  >
                    {answered && isCorrectOpt ? (
                      <span
                        style={{
                          display: 'inline-block',
                          animation: 'checkPop 0.35s ease-out forwards',
                        }}
                      >
                        ✓
                      </span>
                    ) : answered && isSelected && !isCorrectOpt ? (
                      '✗'
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span>{opt}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div
            className={`mt-5 p-4 rounded-xl border-2 transition-all duration-300 ease-out`}
            style={{
              borderColor: isCorrect ? '#86efac' : '#fca5a5',
              background: isCorrect
                ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
                : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              boxShadow: isCorrect
                ? '0 4px 16px rgba(34,197,94,0.12)'
                : '0 4px 16px rgba(239,68,68,0.10)',
              animation: 'slideInUp 0.3s ease-out',
            }}
          >
            <div
              className="font-bold text-sm mb-2 flex items-center gap-2"
              style={{ color: isCorrect ? '#15803d' : '#dc2626' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: isCorrect ? '#22c55e' : '#ef4444',
                  color: 'white',
                  fontSize: 11,
                  animation: 'checkPop 0.35s ease-out',
                }}
              >
                {isCorrect ? '✓' : '✗'}
              </span>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      {answered && (
        <button
          onClick={onNext}
          className="w-full py-4 text-white font-semibold rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          {currentIdx < total - 1 ? 'Next Question →' : 'See Results →'}
        </button>
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── DONE VIEW ────────────────────────────────────────────────────────────────
interface DoneViewProps {
  result: TestResult;
  onRetry: () => void;
  onMenu: () => void;
  onHome: () => void;
}

function DoneView({ result, onRetry, onMenu, onHome }: DoneViewProps) {
  const passed = result.score >= PASS_SCORE;

  // Gauge animation constants
  const ARC_LENGTH = 251.327;
  const targetFill = (result.score / MAX_SCORE) * ARC_LENGTH;
  const animatedFill = useGaugeAnimation(targetFill, ARC_LENGTH);

  const TICK_X = 150.78;
  const TICK_Y = 38.17;
  const scoreColor = passed ? '#22c55e' : '#ef4444';
  const scoreTextColor = passed ? '#16a34a' : '#dc2626';

  return (
    <div className="max-w-2xl mx-auto transition-all duration-300 ease-out">
      {/* Top nav */}
      <div className="flex items-center gap-3 mb-6">
        <HomeButton onClick={onHome} />
      </div>

      {/* Confetti (CSS only, passes-only) */}
      {passed && (
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden z-50"
          aria-hidden
        >
          {CONFETTI_PIECES.map((p) => (
            <span
              key={p.id}
              style={{
                position: 'absolute',
                top: '-20px',
                left: p.left,
                width: p.size,
                height: p.size * 1.5,
                borderRadius: 2,
                background: p.color,
                transform: `rotate(${p.rotate})`,
                animation: `confettiFall 2.2s ease-in ${p.delay} forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Score gauge card */}
      <div
        className={`rounded-2xl p-6 mb-6 flex flex-col items-center border-2 transition-all duration-300`}
        style={{
          borderColor: passed ? '#86efac' : '#fca5a5',
          background: passed
            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          boxShadow: passed
            ? '0 12px 40px rgba(34,197,94,0.18), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 12px 40px rgba(239,68,68,0.15), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Pass/Fail headline */}
        <div
          className="text-lg font-bold mb-3 tracking-tight flex items-center gap-2"
          style={{ color: scoreTextColor }}
        >
          {passed ? '🎉 You passed!' : '📚 Keep studying'}
        </div>

        {/* Animated SVG gauge */}
        <svg
          viewBox="0 0 200 115"
          width="220"
          aria-label={`Score gauge: ${result.score} out of ${MAX_SCORE}`}
          style={{ filter: `drop-shadow(0 2px 8px ${scoreColor}40)` }}
        >
          {/* Track arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Animated score arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={scoreColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${animatedFill} ${ARC_LENGTH}`}
            strokeDashoffset="0"
            style={{ transition: 'none' }}
          />
          {/* Pass threshold tick */}
          <circle cx={TICK_X} cy={TICK_Y} r="5" fill="#f59e0b" />
          <text
            x={TICK_X + 8}
            y={TICK_Y - 4}
            textAnchor="start"
            fontSize="9"
            fill="#f59e0b"
            fontWeight="bold"
          >
            {PASS_SCORE}
          </text>

          {/* Score number */}
          <text
            x="100"
            y="82"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            fill={scoreTextColor}
          >
            {result.score}
          </text>
          {/* Pass/Fail label */}
          <text
            x="100"
            y="97"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={scoreTextColor}
            letterSpacing="1"
          >
            {passed ? 'PASS' : 'NEEDS WORK'}
          </text>
          {/* correct/total */}
          <text x="100" y="112" textAnchor="middle" fontSize="9" fill="#9ca3af">
            {result.correctAnswers}/{result.totalQuestions} correct
          </text>
        </svg>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Passing score: {PASS_SCORE} / {MAX_SCORE}
        </p>
      </div>

      {/* Domain breakdown */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-5 border border-gray-100 dark:border-gray-800"
        style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base">
          Domain Breakdown
        </h3>
        <div className="space-y-4">
          {Object.entries(result.domainScores).map(([domId, scores], idx) => {
            const domain = domains.find((d) => d.id === domId);
            const pct = Math.round((scores.correct / scores.total) * 100);
            const barColor = DOMAIN_BAR_COLORS[domId] ?? '#6b7280';
            const passThreshold = Math.round((PASS_SCORE / MAX_SCORE) * 100);
            return (
              <div key={domId} style={{ animation: `slideInUp 0.35s ease-out ${idx * 0.07}s both` }}>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                      {domain?.name ?? domId}
                    </span>
                    {domain?.weight != null && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                        {domain.weight}% exam
                      </span>
                    )}
                  </div>
                  <span
                    className="font-semibold text-sm tabular-nums"
                    style={{ color: pct >= passThreshold ? '#16a34a' : '#dc2626' }}
                  >
                    {scores.correct}/{scores.total}
                    <span className="font-normal text-gray-400 ml-1">({pct}%)</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColor,
                      transition: 'width 0.8s ease-out',
                      boxShadow: `0 0 6px ${barColor}60`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-3 text-white font-semibold rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
          }}
        >
          Try Again
        </button>
        <button
          onClick={onMenu}
          className="flex-1 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 focus:outline-none"
        >
          Back to Menu
        </button>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(180px) rotate(720deg); opacity: 0; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
