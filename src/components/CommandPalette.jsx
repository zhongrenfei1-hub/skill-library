import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { allSkills, allCategories, searchSkills } from '../lib/content.js';

const STATIC_ROUTES = [
  { kind: 'page', title: '首页',          subtitle: '/',           url: '/' },
  { kind: 'page', title: '分类',          subtitle: '/categories', url: '/categories' },
  { kind: 'page', title: '全部 Skills',   subtitle: '/skills',     url: '/skills' },
  { kind: 'page', title: '本地工作区',    subtitle: '/local',      url: '/local' },
  { kind: 'page', title: '布局哲学',      subtitle: '/philosophy', url: '/philosophy' },
  { kind: 'page', title: '关于',          subtitle: '/about',      url: '/about' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === '/' && !open) {
        const target = e.target;
        const tag = target?.tagName?.toLowerCase();
        const editable = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
        if (!editable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) {
      // Default suggestions: pages + 5 featured skills
      const featured = allSkills.filter((s) => s.featured).slice(0, 5);
      return [
        ...STATIC_ROUTES,
        ...featured.map((s) => ({
          kind: 'skill', title: s.title, subtitle: s.description.slice(0, 80),
          url: `/skills/${s.slug}`, badge: s.category,
        })),
      ];
    }
    const skillHits = searchSkills(q).slice(0, 12).map((s) => ({
      kind: 'skill', title: s.title, subtitle: s.description.slice(0, 80),
      url: `/skills/${s.slug}`, badge: s.category,
    }));
    const catHits = allCategories
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.slug.includes(q.toLowerCase()))
      .map((c) => ({
        kind: 'category', title: c.name, subtitle: c.tagline || c.slug,
        url: `/categories/${c.slug}`, badge: `${c.count} skills`,
      }));
    const pageHits = STATIC_ROUTES.filter((r) =>
      r.title.toLowerCase().includes(q.toLowerCase()) || r.subtitle.toLowerCase().includes(q.toLowerCase())
    );
    return [...pageHits, ...catHits, ...skillHits];
  }, [q]);

  useEffect(() => { setCursor(0); }, [q]);

  const choose = (item) => {
    if (!item) return;
    setOpen(false);
    navigate(item.url);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[cursor]); }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl bg-cream-50 border border-ink-line rounded-lg shadow-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-ink-line flex items-center gap-3">
          <span className="text-ink-mute" aria-hidden>⌘K</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="搜索 skills、分类、页面..."
            className="flex-1 bg-transparent outline-none text-base placeholder-ink-mute"
            aria-label="命令面板搜索"
          />
          <kbd className="hidden sm:inline-block text-xs text-ink-mute border border-ink-line rounded px-1.5">ESC</kbd>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <li className="px-5 py-8 text-center text-ink-mute text-sm">没有匹配</li>
          ) : (
            results.map((item, idx) => (
              <li key={item.kind + item.url + idx}>
                <button
                  onClick={() => choose(item)}
                  onMouseEnter={() => setCursor(idx)}
                  className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-colors ${
                    idx === cursor ? 'bg-cream-200' : 'hover:bg-cream-100'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider text-ink-mute font-mono mt-1 w-14 flex-shrink-0">
                    {item.kind}
                  </span>
                  <span className="flex-1 min-w-0">
                    <div className="font-medium text-ink truncate">{item.title}</div>
                    <div className="text-xs text-ink-mute truncate">{item.subtitle}</div>
                  </span>
                  {item.badge && (
                    <span className="text-xs text-ink-mute font-mono whitespace-nowrap">{item.badge}</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="px-5 py-2 border-t border-ink-line bg-cream-100 flex items-center gap-4 text-xs text-ink-mute">
          <span><kbd className="font-mono">↑↓</kbd> 选</span>
          <span><kbd className="font-mono">↵</kbd> 打开</span>
          <span><kbd className="font-mono">/</kbd> 或 <kbd className="font-mono">⌘K</kbd> 唤起</span>
        </div>
      </div>
    </div>
  );
}
