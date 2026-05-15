import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/categories', label: '分类' },
  { to: '/skills',     label: '全部 Skills' },
  { to: '/about',      label: '关于' },
];

export default function Header() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    if (q.trim()) {
      nav(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-cream-100/85 backdrop-blur-sm border-b border-ink-line">
      <div className="container-wide flex items-center justify-between py-4">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="text-xl font-serif font-medium tracking-tight group-hover:text-clay transition-colors">
            Skill Library
          </span>
          <span className="hidden sm:inline text-xs text-ink-mute tracking-widest uppercase">
            技能资料库
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-ink border-b border-ink pb-0.5' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={submitSearch} className="hidden md:flex items-center">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索 skill..."
              className="w-48 bg-transparent border-b border-ink-line focus:border-ink
                         text-sm py-1.5 px-1 outline-none placeholder-ink-mute transition-colors"
              aria-label="搜索"
            />
          </form>

          <button
            className="md:hidden p-1 -mr-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="菜单"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open
                ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
                : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink-line bg-cream-100">
          <div className="container-wide py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base py-1 ${isActive ? 'text-ink' : 'text-ink-soft'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <form onSubmit={submitSearch} className="mt-2">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索 skill..."
                className="w-full bg-transparent border-b border-ink-line text-base py-2 outline-none"
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
