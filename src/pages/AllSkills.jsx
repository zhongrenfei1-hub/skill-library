import { useState, useMemo } from 'react';
import { allSkills, allCategories } from '../lib/content.js';
import SkillCard from '../components/SkillCard.jsx';

export default function AllSkills() {
  const [activeCat, setActiveCat] = useState('all');
  const [q, setQ] = useState('');

  const categoryNameMap = useMemo(
    () => Object.fromEntries(allCategories.map((c) => [c.slug, c.name])),
    []
  );

  const filtered = useMemo(() => {
    let list = allSkills;
    if (activeCat !== 'all') list = list.filter((s) => s.category === activeCat);
    if (q.trim()) {
      const query = q.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return list;
  }, [activeCat, q]);

  return (
    <div className="container-wide py-16 md:py-24">
      <span className="eyebrow">全部 Skills</span>
      <h1 className="mt-4 text-4xl md:text-5xl font-serif font-medium">所有 Skills</h1>
      <p className="mt-4 text-ink-soft max-w-prose leading-relaxed">
        共 {allSkills.length} 份 skill。可按分类筛选或全文搜索。
      </p>

      {/* Filters */}
      <div className="mt-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between border-b border-ink-line pb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat('all')}
            className={`pill ${activeCat === 'all' ? 'pill-active' : 'hover:border-ink'}`}
          >
            全部({allSkills.length})
          </button>
          {allCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCat(c.slug)}
              className={`pill ${activeCat === c.slug ? 'pill-active' : 'hover:border-ink'}`}
            >
              {c.name}({c.count})
            </button>
          ))}
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索标题 / 描述 / 标签..."
          className="w-full md:w-64 bg-transparent border-b border-ink-line focus:border-ink
                     text-sm py-2 outline-none placeholder-ink-mute"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-ink-mute italic">
            没有匹配的 skill。
          </div>
        ) : (
          filtered.map((skill) => (
            <SkillCard
              key={skill.slug}
              skill={skill}
              categoryName={categoryNameMap[skill.category]}
            />
          ))
        )}
      </div>
    </div>
  );
}
