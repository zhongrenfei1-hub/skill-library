import { useEffect, useMemo, useState } from 'react';

// Extract h2/h3 headings from a rendered markdown HTML element after mount.
// Generates anchor ids if not present and tracks the currently-visible section.
export default function TableOfContents({ container, watch }) {
  const [headings, setHeadings] = useState([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!container) return;
    const els = Array.from(container.querySelectorAll('h2, h3'));
    const items = els.map((el) => {
      if (!el.id) {
        el.id = el.textContent
          .toLowerCase()
          .replace(/[^\w一-龥]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return { id: el.id, text: el.textContent, level: parseInt(el.tagName[1], 10) };
    });
    setHeadings(items);

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.offsetTop - b.target.offsetTop);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [container, watch]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="目录" className="text-sm">
      <div className="text-xs uppercase tracking-wider text-ink-mute mb-3">目录</div>
      <ul className="space-y-1.5 border-l border-ink-line">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-6' : 'pl-3'}>
            <a
              href={`#${h.id}`}
              className={`block py-1 truncate transition-colors ${
                active === h.id ? 'text-clay' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
