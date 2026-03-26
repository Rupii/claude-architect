/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {

      /* ── Domain brand colours ───────────────── */
      colors: {
        'domain-1': '#3B82F6', // blue
        'domain-2': '#8B5CF6', // purple
        'domain-3': '#10B981', // green
        'domain-4': '#F59E0B', // orange/amber
        'domain-5': '#EF4444', // red
      },

      /* ── Custom transition timing functions ─── */
      transitionTimingFunction: {
        // Springy overshoot — good for buttons / scale entrances
        'bounce':        'cubic-bezier(0.34, 1.56, 0.64, 1)',
        // Smooth deceleration — good for slides / fades
        'smooth':        'cubic-bezier(0.22, 1, 0.36, 1)',
        // Snappy ease-in-out for short durations
        'snappy':        'cubic-bezier(0.4, 0, 0.2, 1)',
        // Soft ease for colour / opacity transitions
        'soft':          'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },

      /* ── Extended transition durations ─────── */
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      /* ── Keyframes ──────────────────────────── */
      keyframes: {

        /* Existing — kept + tuned */
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        pingOnce: {
          '0%':   { transform: 'scale(1)',   opacity: '0.4' },
          '80%':  { transform: 'scale(1.6)', opacity: '0'   },
          '100%': { transform: 'scale(1.6)', opacity: '0'   },
        },

        /* New */
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-22px)' },
          to:   { opacity: '1', transform: 'translateX(0)'      },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(22px)' },
          to:   { opacity: '1', transform: 'translateX(0)'    },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.6)'  },
          '55%':  { opacity: '1', transform: 'scale(1.08)' },
          '75%':  {               transform: 'scale(0.96)' },
          '90%':  {               transform: 'scale(1.02)' },
          '100%': {               transform: 'scale(1)'    },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)'    },
          '50%':      { transform: 'translateY(-7px)' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0%   50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0%   50%' },
        },
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(10px)', filter: 'blur(2px)' },
          to:   { opacity: '1', transform: 'translateY(0)',    filter: 'blur(0)'   },
        },
        staggerFadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
      },

      /* ── Named animation utilities ──────────── */
      animation: {
        // Existing
        'fade-in-up':  'fadeInUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in':    'scaleIn  0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'shimmer':     'shimmer  1.6s  linear infinite',
        'ping-once':   'pingOnce 0.65s cubic-bezier(0.4, 0, 0.6, 1) forwards',

        // New
        'slide-in-left':  'slideInLeft   0.4s  cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slideInRight  0.4s  cubic-bezier(0.22, 1, 0.36, 1) both',
        'bounce-in':      'bounceIn      0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'float':          'float         3.6s  ease-in-out infinite',
        'gradient':       'gradientShift 6s    ease infinite',
        'page-enter':     'pageEnter     0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'stagger-item':   'staggerFadeUp 0.4s  cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
