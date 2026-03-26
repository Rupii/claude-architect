import { useState, useCallback } from 'react';
import { questions as allQuestions } from '../../data/questions';
import { domains } from '../../data/domains';
import { useProgress } from '../../hooks/useProgress';
import type { Question, TestResult } from '../../types';
import { PASS_SCORE, MAX_SCORE } from '../../constants/exam';

type Mode = 'select' | 'running' | 'review' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MockTest() {
  const { addTestResult } = useProgress();
  const [mode, setMode] = useState<Mode>('select');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // index -> chosen option
  const [result, setResult] = useState<TestResult | null>(null);
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
    setMode('running');
  }, []);

  const handleAnswer = useCallback((optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  }, [selectedOption, currentIdx]);

  const handleNext = useCallback(() => {
    if (currentIdx < testQuestions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    } else {
      // Calculate results
      const domainScores: Record<string, { correct: number; total: number }> = {};

      // Update last answer
      const finalAnswers = { ...answers, [currentIdx]: selectedOption ?? -1 };
      let finalCorrect = 0;
      testQuestions.forEach((q, i) => {
        if (finalAnswers[i] === q.correctIndex) finalCorrect++;

        if (!domainScores[q.domainId]) {
          domainScores[q.domainId] = { correct: 0, total: 0 };
        }
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

  if (mode === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Mock Test</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Test your knowledge · Passing score: <span className="font-semibold text-blue-600 dark:text-blue-400">{PASS_SCORE}/{MAX_SCORE}</span>
        </p>

        <div className="grid gap-3">
          <button
            onClick={() => startTest(null)}
            className="p-5 text-white rounded-2xl text-left transition-all hover:opacity-90 active:scale-[0.99] shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎯</span>
              <span className="font-bold text-xl tracking-tight">Full Practice Test</span>
            </div>
            <div className="text-blue-200 text-sm">25 questions · All 5 domains · ~30 min</div>
            <div className="mt-3 flex items-center gap-1 text-blue-200 text-xs font-medium">
              <span>Start exam simulation</span>
              <span>→</span>
            </div>
          </button>

          <div className="mt-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Or practice by domain:</p>
            <div className="grid gap-2">
              {domains.map((d) => {
                const count = allQuestions.filter((q) => q.domainId === d.id).length;
                const colors: Record<string, string> = {
                  blue: 'border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20',
                  purple: 'border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20',
                  green: 'border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20',
                  orange: 'border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20',
                  red: 'border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20',
                };
                const dotColors: Record<string, string> = {
                  blue: 'bg-blue-500',
                  purple: 'bg-purple-500',
                  green: 'bg-green-500',
                  orange: 'bg-amber-500',
                  red: 'bg-red-500',
                };
                return (
                  <button
                    key={d.id}
                    onClick={() => startTest(d.id)}
                    className={`p-3.5 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all hover:shadow-md ${colors[d.color]}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColors[d.color]}`} />
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{d.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{count} questions</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 pl-4">{d.weight}% of exam</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'running') {
    const q = testQuestions[currentIdx];
    const answered = selectedOption !== null;
    const isCorrect = selectedOption === q.correctIndex;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Question {currentIdx + 1} of {testQuestions.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {domains.find(d => d.id === testQuestions[currentIdx]?.domainId)?.name.split(' ')[0] ?? ''}
            </span>
          </div>
          <button onClick={() => setMode('select')} className="text-xs text-gray-400 hover:text-gray-600">
            ✕ Exit
          </button>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-6 overflow-hidden shadow-inner">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / testQuestions.length) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)' }}>
          {/* Domain tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {domains.find((d) => d.id === q.domainId)?.name ?? q.domainId}
            </span>
            <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              q.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
              q.difficulty === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            }`}>{q.difficulty}</span>
          </div>

          {/* Scenario */}
          {q.scenario && (
            <div className="rounded-xl p-4 mb-4 text-sm text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/40" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)' }}>
              {q.scenario}
            </div>
          )}

          {/* Question */}
          <p className="font-semibold text-gray-900 dark:text-white mb-4 text-base leading-relaxed">
            {q.text}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let cls = 'border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-900 dark:text-white cursor-pointer shadow-sm hover:shadow-md transition-all';
              if (answered) {
                if (i === q.correctIndex) {
                  cls = 'border-2 border-green-400 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 cursor-default shadow-sm';
                } else if (i === selectedOption) {
                  cls = 'border-2 border-red-400 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 cursor-default shadow-sm';
                } else {
                  cls = 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-400 cursor-default opacity-50';
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${cls}`}
                  disabled={answered}
                >
                  <span className="font-mono mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className={`mt-4 p-4 rounded-xl border-2 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`} style={{ boxShadow: isCorrect ? '0 4px 12px rgba(34,197,94,0.1)' : '0 4px 12px rgba(239,68,68,0.1)' }}>
              <div className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{q.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="mt-4 w-full py-3.5 text-white font-semibold rounded-xl transition-all hover:opacity-90 active:scale-[0.99] shadow-md"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
          >
            {currentIdx < testQuestions.length - 1 ? 'Next Question →' : '🎉 See Results'}
          </button>
        )}
      </div>
    );
  }

  if (mode === 'done' && result) {
    const passed = result.score >= PASS_SCORE;

    // SVG gauge constants (pre-computed, no Math.cos at render time)
    // Arc: M 20 100 A 80 80 0 0 1 180 100  — semicircle, radius=80, total arc length = π*80 ≈ 251.327
    const ARC_LENGTH = 251.327;
    const scoreFill = (result.score / MAX_SCORE) * ARC_LENGTH;

    // Threshold tick at 72%: θ = 180 * 0.72 = 129.6°
    // cos(129.6° → 2.2619 rad) ≈ -0.6347  →  x = 100 - 80*(-0.6347) ≈ 150.78
    // sin(129.6° → 2.2619 rad) ≈  0.7729  →  y = 100 - 80*0.7729   ≈  38.17
    const TICK_X = 150.78;
    const TICK_Y = 38.17;

    const scoreColor = passed ? '#22c55e' : '#ef4444';
    const scoreTextColor = passed ? '#16a34a' : '#dc2626';

    const domainBarColors: Record<string, string> = {
      'domain-1': '#3b82f6',
      'domain-2': '#a855f7',
      'domain-3': '#22c55e',
      'domain-4': '#f59e0b',
      'domain-5': '#ef4444',
    };

    return (
      <div className="max-w-2xl mx-auto">
        {/* Score Gauge Card */}
        <div
          className={`rounded-2xl p-6 mb-6 flex flex-col items-center border-2 ${
            passed
              ? 'border-green-200 dark:border-green-800'
              : 'border-red-200 dark:border-red-800'
          }`}
          style={{
            background: passed
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            boxShadow: passed ? '0 8px 32px rgba(34,197,94,0.15)' : '0 8px 32px rgba(239,68,68,0.15)'
          }}
        >
          <svg
            viewBox="0 0 200 110"
            width="200"
            aria-label={`Score gauge: ${result.score} out of ${MAX_SCORE}`}
          >
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Score arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={scoreColor}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${scoreFill} ${ARC_LENGTH}`}
              strokeDashoffset="0"
            />

            {/* Pass threshold tick at 72% */}
            <circle cx={TICK_X} cy={TICK_Y} r="5" fill="#f59e0b" />

            {/* Pass score label near threshold tick */}
            <text
              x={TICK_X + 10}
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
              y="85"
              textAnchor="middle"
              fontSize="28"
              fontWeight="bold"
              fill={scoreTextColor}
            >
              {result.score}
            </text>

            {/* PASS / FAIL label */}
            <text
              x="100"
              y="99"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={scoreTextColor}
            >
              {passed ? 'PASS' : 'NEEDS WORK'}
            </text>

            {/* correct/total sub-label */}
            <text
              x="100"
              y="110"
              textAnchor="middle"
              fontSize="9"
              fill="#6b7280"
            >
              {result.correctAnswers}/{result.totalQuestions} correct
            </text>
          </svg>

          <p className="text-xs text-gray-400 mt-1">Passing score: {PASS_SCORE} / {MAX_SCORE}</p>
        </div>

        {/* Domain breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Domain Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(result.domainScores).map(([domId, scores]) => {
              const domain = domains.find((d) => d.id === domId);
              const pct = Math.round((scores.correct / scores.total) * 100);
              const barColor = domainBarColors[domId] ?? '#6b7280';
              return (
                <div key={domId}>
                  <div className="flex justify-between items-baseline text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: barColor }}
                      />
                      <span className="text-gray-700 dark:text-gray-300">{domain?.name ?? domId}</span>
                      {domain?.weight != null && (
                        <span className="text-xs text-gray-400">{domain.weight}% exam</span>
                      )}
                    </div>
                    <span
                      className="font-medium"
                      style={{ color: pct >= (PASS_SCORE / MAX_SCORE) * 100 ? '#16a34a' : '#dc2626' }}
                    >
                      {scores.correct}/{scores.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => startTest(selectedDomainId)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => setMode('select')}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return null;
}
