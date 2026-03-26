import { useState } from 'react';

const PREDICTIONS = [
  "Mercury is in retrograde, but your memory palace is perfectly aligned. You will ace Domain 1 on your very first attempt.",
  "The stars whisper: the answer is never C… unless it is. Trust your instincts on Tool Design & MCP.",
  "Jupiter smiles upon engineers who run mock tests before 10am. Your score rises by exactly 72 points this week.",
  "The cosmos reveal a hidden truth — you already know the passing score is 720. Coincidence? The universe thinks not.",
  "Saturn's rings spell out 'multi-agent orchestration' in ancient Vedic script. Domain 1 is your destiny.",
  "A shooting star passed over your city last night. It was definitely a metaphor for your upcoming PASS result.",
  "The moon aligns with your keyboard. Tonight is the perfect night to re-read Context Management one more time.",
  "Your astral chart shows an unusual convergence of focus, chai tolerance, and dark-mode preference — exam day conditions: optimal.",
  "The cosmos are clear: you will second-guess the correct answer on exactly 3 questions. Do not.",
  "Venus and Mars argued about prompt engineering for three cosmic hours. As always, chain-of-thought reasoning won.",
];

export default function Astrology() {
  const [question, setQuestion] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function predict() {
    if (spinning) return;
    setSpinning(true);
    setRevealed(false);
    setPrediction(null);

    setTimeout(() => {
      const idx = Math.floor(Math.random() * PREDICTIONS.length);
      setPrediction(PREDICTIONS[idx]);
      setSpinning(false);
      setRevealed(true);
    }, 1200);
  }

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🔮</div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Astrology for Rajesh
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ask the cosmos. Receive wisdom. Pass the exam.
        </p>
      </div>

      {/* Input card */}
      <div
        className="rounded-2xl p-6 border border-purple-200 dark:border-purple-900/50 mb-4"
        style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)' }}
      >
        <label className="block text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2">
          Your question for the universe
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') predict(); }}
          placeholder="e.g. Will I pass the exam?"
          className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-900 font-medium text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 placeholder:font-normal mb-4"
        />
        <button
          onClick={predict}
          disabled={spinning}
          className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)' }}
        >
          {spinning ? '✨ Reading the stars…' : '🔮 Predict My Fate'}
        </button>
      </div>

      {/* Prediction reveal */}
      {revealed && prediction && (
        <div
          className="rounded-2xl p-6 border-2 border-purple-300 dark:border-purple-700 animate-scale-in"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}
        >
          <div className="text-center text-2xl mb-3">⭐</div>
          {question && (
            <p className="text-center text-xs text-purple-300/70 italic mb-3">
              "{question}"
            </p>
          )}
          <p className="text-center text-white font-semibold text-base leading-relaxed">
            {prediction}
          </p>
          <p className="text-center text-purple-400/50 text-[10px] uppercase tracking-widest mt-4">
            — The Cosmos
          </p>
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-6 uppercase tracking-widest">
        For entertainment purposes · Stars not liable for exam outcomes
      </p>
    </div>
  );
}
