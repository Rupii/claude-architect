import { useState, useMemo, useEffect, useRef } from 'react';
import { questions as allQuestions } from '../../data/questions';
import { domains } from '../../data/domains';
import type { Question } from '../../types';

type Mode = 'select' | 'running' | 'review';

const PASS_SCORE = 720;
const MAX_SCORE = 1000;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Score Gauge (SVG arc, same style as MockTest) ─────────────────────────
function ScoreGauge({ score, correct, total }: { score: number; correct: number; total: number }) {
  const pass = score >= PASS_SCORE;
  const pct = score / MAX_SCORE;
  const r = 60;
  const cx = 80;
  const cy = 80;
  const startAngle = -210;
  const sweepAngle = 240;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (deg: number) => cx + r * Math.cos(toRad(deg));
  const arcY = (deg: number) => cy + r * Math.sin(toRad(deg));
  const endDeg = startAngle + sweepAngle * pct;
  const passLine = startAngle + sweepAngle * (PASS_SCORE / MAX_SCORE);

  const bgPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 1 1 ${arcX(startAngle + sweepAngle)} ${arcY(startAngle + sweepAngle)}`;
  const fgPath = pct > 0
    ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${sweepAngle * pct > 180 ? 1 : 0} 1 ${arcX(endDeg)} ${arcY(endDeg)}`
    : '';

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="130" viewBox="0 0 160 130">
        <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" className="dark:stroke-gray-700" />
        {fgPath && (
          <path d={fgPath} fill="none" stroke={pass ? '#22c55e' : '#ef4444'} strokeWidth="12" strokeLinecap="round" />
        )}
        {/* Pass threshold tick */}
        <line
          x1={cx + (r - 10) * Math.cos(toRad(passLine))}
          y1={cy + (r - 10) * Math.sin(toRad(passLine))}
          x2={cx + (r + 4) * Math.cos(toRad(passLine))}
          y2={cy + (r + 4) * Math.sin(toRad(passLine))}
          stroke="#f59e0b" strokeWidth="2.5"
        />
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-gray-900 dark:fill-white" fill="currentColor" fontSize="22" fontWeight="800">{score}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="11">{correct}/{total} correct</text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill={pass ? '#22c55e' : '#ef4444'} fontSize="12" fontWeight="700">{pass ? '✓ PASS' : '✗ NEEDS WORK'}</text>
      </svg>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Pass threshold: 720 / 1000</p>
    </div>
  );
}

// ── Single review question card ────────────────────────────────────────────
function ReviewCard({
  q,
  index,
  userAnswer,
}: {
  q: Question;
  index: number;
  userAnswer: number | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const answered = userAnswer !== undefined;
  const correct = answered && userAnswer === q.correctIndex;

  return (
    <div className={`rounded-xl border overflow-hidden ${correct ? 'border-green-200 dark:border-green-800' : answered ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 flex items-start gap-3">
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${correct ? 'bg-green-500' : answered ? 'bg-red-500' : 'bg-gray-400'}`}>
          {correct ? '✓' : answered ? '✗' : '–'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">Q{index + 1}</span>
            {q.source === 'official' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Official
              </span>
            )}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {domains.find(d => d.id === q.domainId)?.name.split(' ')[0]}
            </span>
          </div>
          {q.scenario && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 italic">{q.scenario}</p>
          )}
          <p className="text-sm font-medium text-gray-900 dark:text-white">{q.text}</p>
        </div>
      </div>

      {/* Options */}
      <div className="px-4 pb-3 bg-white dark:bg-gray-800 space-y-1.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isUserPick = i === userAnswer;
          let cls = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
          if (isCorrect) cls = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 font-medium';
          else if (isUserPick && !isCorrect) cls = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 line-through';

          return (
            <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${cls}`}>
              <span className="font-mono font-bold flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
              {isCorrect && <span className="ml-auto text-green-600 dark:text-green-400 flex-shrink-0 text-xs font-bold">✓ Correct</span>}
              {isUserPick && !isCorrect && <span className="ml-auto text-red-500 flex-shrink-0 text-xs font-bold">Your pick</span>}
            </div>
          );
        })}
      </div>

      {/* Explanation toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 text-xs font-medium text-left bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
      >
        {expanded ? '▲ Hide explanation' : '▼ Show explanation'}
      </button>
      {expanded && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ── Exam Timer — Pomodoro-style circular ring, fixed top-right ──────────────
const TIMER_R = 26;
const TIMER_CIRC = 2 * Math.PI * TIMER_R; // ~163.36

function ExamTimer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [flash, setFlash] = useState(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => { setRemaining(totalSeconds); }, [totalSeconds]);

  useEffect(() => {
    if (remaining <= 0) { onExpireRef.current(); return; }
    const id = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  // Flash on last minute
  useEffect(() => {
    if (remaining === 60) { setFlash(true); setTimeout(() => setFlash(false), 800); }
  }, [remaining]);

  const progress = remaining / totalSeconds; // 1 → 0
  const dashOffset = TIMER_CIRC * (1 - progress);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const ringColor =
    remaining < 60 ? '#ef4444' :
    remaining < 300 ? '#f59e0b' :
    '#3b82f6';

  const label =
    remaining < 60 ? 'urgent' :
    remaining < 300 ? 'warning' :
    'exam';

  return (
    <div
      className="fixed top-[70px] right-4 z-40 select-none"
      title={`${timeStr} remaining`}
    >
      <button
        className={`relative flex items-center justify-center rounded-full shadow-lg transition-transform duration-150 active:scale-95 focus:outline-none ${
          flash ? 'animate-ping-once' : ''
        }`}
        style={{ width: 64, height: 64 }}
        onClick={() => {}} // no-op — display only
        tabIndex={-1}
      >
        {/* SVG ring */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx="32" cy="32" r={TIMER_R}
            fill="none" strokeWidth="4" stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx="32" cy="32" r={TIMER_R}
            fill="none" strokeWidth="4"
            stroke={ringColor}
            strokeDasharray={TIMER_CIRC}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.6s ease' }}
          />
        </svg>

        {/* Inner disc */}
        <div
          className="absolute rounded-full bg-white dark:bg-gray-900 shadow-sm"
          style={{ inset: 6 }}
        />

        {/* Running pulse ring when < 5 min */}
        {remaining < 300 && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: ringColor }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center leading-none gap-0.5">
          <span
            className="font-mono font-bold text-gray-800 dark:text-gray-100"
            style={{ fontSize: 11 }}
          >
            {timeStr}
          </span>
          <span
            className="font-semibold uppercase tracking-wider"
            style={{ fontSize: 7, color: ringColor }}
          >
            {label}
          </span>
        </div>
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ExamSimulator() {
  const [mode, setMode] = useState<Mode>('select');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testLabel, setTestLabel] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  function startTest(pool: Question[], label: string) {
    const secs = Math.round((pool.length / 65) * 120 * 60); // scale: 65Q = 120min
    setQuestions(pool);
    setCurrent(0);
    setAnswers({});
    setTestLabel(label);
    setTimerSeconds(secs);
    setTimerActive(true);
    setMode('running');
  }

  function selectAnswer(optionIndex: number) {
    setAnswers(prev => ({ ...prev, [current]: optionIndex }));
  }

  function submitExam() {
    setTimerActive(false);
    setMode('review');
  }

  // ── Score calculations ───────────────────────────────────────────────────
  const { score, correct, domainScores } = useMemo(() => {
    if (mode !== 'review') return { score: 0, correct: 0, domainScores: {} };
    let c = 0;
    const ds: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!ds[q.domainId]) ds[q.domainId] = { correct: 0, total: 0 };
      ds[q.domainId].total++;
      if (answers[i] === q.correctIndex) {
        c++;
        ds[q.domainId].correct++;
      }
    });
    return {
      score: Math.round((c / questions.length) * MAX_SCORE),
      correct: c,
      domainScores: ds,
    };
  }, [mode, questions, answers]);

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const officialCount = allQuestions.filter(q => q.source === 'official').length;
  const communityQ = allQuestions.filter(q => q.source !== 'official');

  // Build practice tests — each 65 Q, non-overlapping slices
  const practiceTests = useMemo(() => {
    const shuffled = [...communityQ].sort((a, b) => a.id.localeCompare(b.id));
    const tests = [];
    const size = 65;
    for (let i = 0; i * size < shuffled.length; i++) {
      const slice = shuffled.slice(i * size, (i + 1) * size);
      if (slice.length >= 20) tests.push(slice); // only show tests with 20+ Q
    }
    return tests;
  }, [communityQ]);

  // ── SELECT screen ────────────────────────────────────────────────────────
  if (mode === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Simulator</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Answer all questions — results + full review revealed only at the end · 2 hr timer
          </p>
        </div>

        {/* Practice Tests */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Practice Tests</h2>
          <div className="space-y-3">
            {practiceTests.map((pool, i) => (
              <button
                key={i}
                onClick={() => startTest(shuffle(pool), `Practice Test ${i + 1} (${pool.length} Q)`)}
                className="w-full text-left p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-base">Practice Test {i + 1}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {pool.length} questions · all domains · {Math.round((pool.length / 65) * 120)} min timer
                    </div>
                  </div>
                  <span className="text-2xl">📋</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Official sample */}
        {officialCount > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Official Questions</h2>
            <button
              onClick={() => startTest(shuffle(allQuestions.filter(q => q.source === 'official')), `Official Sample (${officialCount} Q)`)}
              className="w-full text-left p-5 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-base">Official Sample Questions</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Official</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{officialCount} questions · from the official CCAF exam guide · {Math.round((officialCount / 65) * 120)} min timer</div>
                </div>
                <span className="text-2xl">⭐</span>
              </div>
            </button>
          </div>
        )}

        {/* Domain-specific */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">By Domain</h2>
          <div className="space-y-2">
            {domains.map(domain => {
              const pool = allQuestions.filter(q => q.domainId === domain.id);
              const count = Math.min(pool.length, 20);
              return (
                <button
                  key={domain.id}
                  onClick={() => startTest(shuffle(pool).slice(0, count), `${domain.name} (${count} Q)`)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{domain.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{pool.length} available · {domain.weight}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── RUNNING screen ───────────────────────────────────────────────────────
  if (mode === 'running') {
    const q = questions[current];
    const progressPct = (Object.keys(answers).length / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Fixed circular timer — top right */}
        {timerActive && (
          <ExamTimer
            totalSeconds={timerSeconds}
            onExpire={() => { setTimerActive(false); submitExam(); }}
          />
        )}

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{testLabel}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {current + 1} / {questions.length}
            </span>
          </div>
          {/* Progress bar — shows answered count, not position */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {Object.keys(answers).length} of {questions.length} answered
          </p>
        </div>

        {/* Question card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4 shadow-sm">
          {q.scenario && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-sm text-blue-700 dark:text-blue-300 italic">
              {q.scenario}
            </div>
          )}
          <div className="flex items-start gap-2 mb-4">
            {q.source === 'official' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex-shrink-0 mt-0.5">
                Official
              </span>
            )}
            <p className="text-base font-semibold text-gray-900 dark:text-white leading-snug">{q.text}</p>
          </div>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border text-sm transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-medium'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={`font-mono font-bold flex-shrink-0 ${selected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          <div className="flex-1 flex justify-center gap-1 overflow-x-auto py-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-6 h-6 rounded text-[10px] font-bold flex-shrink-0 transition-colors ${
                  i === current
                    ? 'bg-blue-600 text-white'
                    : answers[i] !== undefined
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitExam}
              disabled={!allAnswered}
              className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: allAnswered ? 'linear-gradient(135deg, #1e3a5f, #3b82f6)' : undefined, backgroundColor: allAnswered ? undefined : '#9ca3af' }}
              title={!allAnswered ? 'Answer all questions before submitting' : undefined}
            >
              Submit Exam
            </button>
          )}
        </div>

        {/* Submit button — also shown floating when all answered but not on last */}
        {allAnswered && current < questions.length - 1 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={submitExam}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)' }}
            >
              All answered — Submit Exam
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── REVIEW screen ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{testLabel}</p>
      </div>

      {/* Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4 shadow-sm flex flex-col items-center">
        <ScoreGauge score={score} correct={correct} total={questions.length} />
      </div>

      {/* Domain breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Domain Breakdown</h2>
        <div className="space-y-2">
          {Object.entries(domainScores).map(([domainId, ds]) => {
            const domain = domains.find(d => d.id === domainId);
            const pct = Math.round((ds.correct / ds.total) * 100);
            return (
              <div key={domainId}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{domain?.name ?? domainId}</span>
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{ds.correct}/{ds.total} · {pct}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pct >= 72 ? '#22c55e' : '#ef4444' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setMode('running'); setCurrent(0); setAnswers({}); }}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Retake Same Test
        </button>
        <button
          onClick={() => setMode('select')}
          className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)' }}
        >
          Back to Menu
        </button>
      </div>

      {/* Per-question review */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Question Review</h2>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <ReviewCard key={q.id} q={q} index={i} userAnswer={answers[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}
