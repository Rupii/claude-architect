import { useState, useEffect, useRef } from 'react';

const PRESETS = [
  { label: '5m', seconds: 5 * 60, hint: 'break' },
  { label: '15m', seconds: 15 * 60, hint: 'short' },
  { label: '25m', seconds: 25 * 60, hint: 'focus' },
];

const R = 22;
const CIRC = 2 * Math.PI * R; // 138.23

function playDone() {
  try {
    const ctx = new AudioContext();
    [880, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.3);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.3);
    });
  } catch {
    // AudioContext not available — silent fallback
  }
}

export default function PomodoroTimer() {
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [flash, setFlash] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Countdown tick
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          setDone(true);
          setFlash(true);
          playDone();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Flash fades after 2s
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 2000);
    return () => clearTimeout(t);
  }, [flash]);

  function selectPreset(seconds: number) {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(false);
    setDone(false);
  }

  function toggle() {
    if (done) {
      setRemaining(duration);
      setDone(false);
      setRunning(false);
      return;
    }
    setRunning((r) => !r);
  }

  // Delay hiding presets so quick mouse-out doesn't flicker
  function handleMouseEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovered(true);
  }
  function handleMouseLeave() {
    leaveTimer.current = setTimeout(() => setHovered(false), 300);
  }

  const progress = remaining / duration; // 1 → 0
  const dashOffset = CIRC * (1 - progress);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const ringColor = done
    ? '#22c55e'
    : progress > 0.5
      ? '#3b82f6'
      : progress > 0.25
        ? '#f59e0b'
        : '#ef4444';

  const statusLabel = done
    ? 'done!'
    : running
      ? '▶'
      : remaining === duration
        ? 'start'
        : 'paused';

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Preset buttons — float up on hover */}
      <div
        className={`flex gap-1 bg-white dark:bg-gray-800 rounded-xl px-2 py-1.5 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-200 ${
          hovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => selectPreset(p.seconds)}
            title={p.hint}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              duration === p.seconds
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main circle button */}
      <button
        onClick={toggle}
        title={running ? 'Pause' : done ? 'Reset' : 'Start'}
        className={`relative flex items-center justify-center rounded-full transition-transform duration-150 active:scale-95 focus:outline-none ${
          flash ? 'animate-ping-once' : ''
        }`}
        style={{ width: 56, height: 56 }}
      >
        {/* SVG ring */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx="28" cy="28" r={R}
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx="28" cy="28" r={R}
            fill="none"
            strokeWidth="3"
            stroke={ringColor}
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.6s ease' }}
          />
        </svg>

        {/* Inner disc */}
        <div
          className="absolute rounded-full bg-white dark:bg-gray-800 shadow-sm"
          style={{ inset: 5 }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center leading-none gap-0.5">
          <span
            className="font-mono font-bold text-gray-800 dark:text-gray-100"
            style={{ fontSize: 11 }}
          >
            {timeStr}
          </span>
          <span
            className="font-semibold"
            style={{ fontSize: 8, color: done ? '#22c55e' : running ? ringColor : '#9ca3af' }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Running pulse ring */}
        {running && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: ringColor }}
          />
        )}
      </button>
    </div>
  );
}
