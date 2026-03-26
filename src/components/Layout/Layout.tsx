import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';

const navItems = [
  { to: '/', label: 'Study Plan', icon: '📅', end: true },
  { to: '/guide', label: 'Study Guide', icon: '📚' },
  { to: '/test', label: 'Mock Test', icon: '🎯' },
  { to: '/exam', label: 'Exam Sim', icon: '📝' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/astrology', label: 'Astrology ✨', icon: '🔮' },
];

export default function Layout() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem('sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top bar — always dark gradient for enterprise feel */}
      <header
        className="border-b border-slate-700/60 px-4 py-3 flex items-center justify-between sticky top-0 z-30"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
      >
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1.5 rounded text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <rect y="2" width="18" height="2" rx="1" />
              <rect y="8" width="18" height="2" rx="1" />
              <rect y="14" width="18" height="2" rx="1" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Brand mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polygon points="8,2 14,5.5 14,10.5 8,14 2,10.5 2,5.5" fill="white" opacity="0.25" />
                <polygon points="8,4.5 12,6.75 12,10.25 8,12.5 4,10.25 4,6.75" fill="white" opacity="0.6" />
                <polygon points="8,7 10,8.15 10,10.35 8,11.5 6,10.35 6,8.15" fill="white" />
              </svg>
            </div>

            <div>
              <h1 className="font-bold text-white text-sm md:text-base leading-tight tracking-tight">
                Claude Certified Architect
              </h1>
              <p className="text-xs text-blue-300/60 hidden sm:block tracking-wide">
                Foundations Exam Prep · 720 to pass
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400/70 hidden sm:block">© Rupesh M</span>
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-sm transition-all border border-slate-600/40 hover:border-slate-500/60"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            title="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-20
            ${collapsed ? 'w-14' : 'w-56'} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800/80
            transform transition-all duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            flex flex-col pt-16 md:pt-0 overflow-hidden
          `}
          style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.07)' }}
        >
          <nav className="flex-1 p-2 mt-3 space-y-0.5">
            {/* Nav header row with collapse toggle */}
            <div className={`flex items-center mb-2 ${collapsed ? 'justify-center px-1' : 'px-3'}`}>
              {!collapsed && (
                <p className="flex-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                  Navigation
                </p>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden md:flex items-center justify-center w-6 h-6 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  {collapsed ? (
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  ) : (
                    <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  )}
                </svg>
              </button>
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-150 border ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                <span className="text-base leading-none">{item.icon}</span>
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer card — hidden when collapsed */}
          {!collapsed && (
            <div className="p-3">
              <div
                className="rounded-xl p-3 border border-blue-100 dark:border-blue-900/40 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(219,234,254,0.6) 0%, rgba(224,231,255,0.6) 100%)' }}
              >
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">Passing Score</div>
                <div className="text-lg font-black text-blue-800 dark:text-blue-300 leading-tight">720<span className="text-xs font-medium opacity-60"> / 1000</span></div>
                <div className="text-[10px] text-blue-500/70 dark:text-blue-500/50 mt-0.5">5 domains · certification</div>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      <PomodoroTimer />
    </div>
  );
}
