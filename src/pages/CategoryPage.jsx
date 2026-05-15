import { useParams, Link } from 'react-router-dom';
import { getCategory, skillsByCategory, allCategories } from '../lib/content.js';
import SkillCard from '../components/SkillCard.jsx';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategory(slug);
  const skills = skillsByCategory(slug);

  if (!category) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="text-3xl font-serif font-medium">未找到该分类</h1>
        <p className="mt-3 text-ink-mute">该分类可能还未在 <code>content/categories.json</code> 中定义。</p>
        <Link to="/categories" className="btn btn-link mt-6 inline-block">看全部分类 →</Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-16 md:py-24">
      <Link to="/categories" className="text-sm text-ink-mute hover:text-clay">
        ← 返回分类
      </Link>

      <div className="mt-6 max-w-3xl">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-4xl">{category.icon || '✦'}</span>
          <span className="text-sm text-ink-mute font-mono">
            {skills.length} skill{skills.length === 1 ? '' : 's'}
          </span>
        </div>
        <span className="eyebrow">{category.tagline || '分类'}</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-serif font-medium">{category.name}</h1>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed">{category.description}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.length === 0 ? (
          <div className="col-span-full card text-center py-16">
            <p className="text-ink-mute italic mb-3">这个分类还是空的。</p>
            <p className="text-sm text-ink-soft">
              添加一份 markdown 到{' '}
              <code className="text-xs bg-cream-200 px-1.5 py-0.5 rounded">
                content/skills/{category.slug}/your-skill.md
              </code>
              {' '}就会自动出现在这里。
            </p>
          </div>
        ) : (
          skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} categoryName={category.name} />
          ))
        )}
      </div>
    </div>
  );
}
