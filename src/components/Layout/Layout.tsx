import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';


const navItems = [
  { to: '/', label: 'Study Plan', icon: '📅', subtext: 'Daily goals', end: true },
  { to: '/guide', label: 'Study Guide', icon: '📚', subtext: '5 domains' },
  { to: '/test', label: 'Mock Test', icon: '🎯', subtext: '30 questions' },
  { to: '/exam', label: 'Exam Sim', icon: '📝', subtext: 'Full simulation' },
  { to: '/progress', label: 'Progress', icon: '📊', subtext: 'Track stats' },
  { to: '/astrology', label: 'Astrology ✨', icon: '🔮', subtext: 'Insights' },
];

export default function Layout() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem('sidebar-collapsed') === 'true'
  );
  const [pageKey, setPageKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = () => {
    setSidebarOpen(false);
    setPageKey((k) => k + 1);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c14]">
      {/* ── Top Header ── */}
      <header
        className="sticky top-0 z-30 border-b border-white/10"
        style={{
          background: 'linear-gradient(135deg, #0b1120 0%, #112240 45%, #0b1120 100%)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-4 py-0 flex items-center justify-between h-14">
          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect y="2" width="16" height="1.75" rx="0.875" />
                <rect y="7.125" width="16" height="1.75" rx="0.875" />
                <rect y="12.25" width="16" height="1.75" rx="0.875" />
              </svg>
            </button>

            {/* Clickable brand → navigate to "/" */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label="Go to home"
            >
              {/* Logo mark */}
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6d28d9 100%)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <polygon points="8,2 14,5.5 14,10.5 8,14 2,10.5 2,5.5" fill="white" opacity="0.2" />
                  <polygon points="8,4.5 12,6.75 12,10.25 8,12.5 4,10.25 4,6.75" fill="white" opacity="0.55" />
                  <polygon points="8,7 10,8.15 10,10.35 8,11.5 6,10.35 6,8.15" fill="white" />
                </svg>
              </div>

              <div className="text-left">
                <p className="font-bold text-white text-sm leading-tight tracking-tight group-hover:text-blue-300 transition-colors duration-200">
                  Claude Certified Architect
                </p>
                <p className="text-[10px] text-blue-400/50 hidden sm:block tracking-widest uppercase">
                  Foundations · 720 to pass
                </p>
              </div>
            </button>
          </div>

          {/* Right: attribution + theme toggle */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden sm:block select-none">© Rupesh M</span>
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg text-sm transition-all duration-200 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 hover:text-white"
              title="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Mobile overlay ── */}
        <div
          className={`fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-20 flex flex-col pt-14 md:pt-0 overflow-hidden
            transition-all duration-300 ease-in-out
            ${collapsed ? 'w-[60px]' : 'w-[220px]'}
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{
            background: dark
              ? 'linear-gradient(180deg, rgba(11,17,32,0.98) 0%, rgba(10,15,28,0.98) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,255,0.97) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)',
            boxShadow: dark
              ? '4px 0 40px rgba(0,0,0,0.5), inset -1px 0 0 rgba(255,255,255,0.03)'
              : '4px 0 32px rgba(0,0,0,0.08)',
          }}
        >
          {/* Nav section label + collapse toggle */}
          <div className={`flex items-center mt-4 mb-1 ${collapsed ? 'justify-center px-2' : 'px-4 justify-between'}`}>
            {!collapsed && (
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600 select-none">
                Navigation
              </p>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden md:flex items-center justify-center w-5 h-5 rounded-md text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                {collapsed ? (
                  <path d="M3.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M6.5 2L3.5 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  [
                    'group relative flex items-center rounded-xl transition-all duration-200 overflow-hidden',
                    collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5',
                    isActive
                      ? [
                          'text-blue-700 dark:text-blue-300',
                          dark
                            ? 'bg-blue-500/10'
                            : 'bg-blue-50',
                        ].join(' ')
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-white/[0.05]',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left accent bar for active state */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300 ${
                        isActive ? 'h-6 bg-blue-500' : 'h-0 bg-transparent'
                      }`}
                    />

                    {/* Icon */}
                    <span
                      className={`text-base leading-none flex-shrink-0 transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    >
                      {item.icon}
                    </span>

                    {/* Label + subtext */}
                    {!collapsed && (
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm leading-tight truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                          {item.label}
                        </span>
                        <span
                          className={`block text-[10px] leading-tight truncate transition-colors duration-200 ${
                            isActive
                              ? 'text-blue-500/70 dark:text-blue-400/60'
                              : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-500'
                          }`}
                        >
                          {item.subtext}
                        </span>
                      </span>
                    )}

                    {/* Active dot indicator for collapsed */}
                    {collapsed && isActive && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer — passing score card */}
          {!collapsed && (
            <div className="p-3 mt-2">
              <div
                className="rounded-xl p-3 text-center border"
                style={{
                  background: dark
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(109,40,217,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(219,234,254,0.7) 0%, rgba(237,233,254,0.7) 100%)',
                  borderColor: dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.18)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-0.5">
                  Passing Score
                </p>
                <p className="text-2xl font-black text-blue-800 dark:text-blue-200 leading-none">
                  720
                  <span className="text-xs font-medium text-blue-500/60 dark:text-blue-400/50"> / 1000</span>
                </p>
                <p className="text-[9px] text-blue-500/60 dark:text-blue-500/40 mt-1 tracking-wide uppercase">
                  5 domains · certification
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content with page transition ── */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto"
          style={{ minWidth: 0 }}
        >
          <div
            key={pageKey}
            className="p-4 md:p-6 min-h-full"
            style={{
              animation: 'fadeSlideUp 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Page transition keyframes ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}
