import { useSearchParams, Link } from 'react-router-dom';
import { searchSkills, allCategories } from '../lib/content.js';
import SkillCard from '../components/SkillCard.jsx';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const results = q ? searchSkills(q) : [];
  const categoryNameMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.name]));

  return (
    <div className="container-wide py-16 md:py-24">
      <span className="eyebrow">搜索结果</span>
      <h1 className="mt-4 text-3xl md:text-4xl font-serif font-medium">
        “{q}”
      </h1>
      <p className="mt-4 text-ink-mute">
        共找到 {results.length} 条结果
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-ink-mute italic">没有匹配的 skill。</p>
            <Link to="/skills" className="btn btn-link mt-6 inline-block">浏览全部 →</Link>
          </div>
        ) : (
          results.map((s) => (
            <SkillCard key={s.slug} skill={s} categoryName={categoryNameMap[s.category]} />
          ))
        )}
      </div>
    </div>
  );
}
