import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSkill, getCategory, allSkills, getSkillBody } from '../lib/content.js';
import Markdown from '../components/Markdown.jsx';
import SkillCard from '../components/SkillCard.jsx';

export default function SkillPage() {
  const { slug } = useParams();
  const skill = getSkill(slug);

  const [body, setBody] = useState('');
  const [bodyLoading, setBodyLoading] = useState(true);

  useEffect(() => {
    if (!skill) {
      setBodyLoading(false);
      return;
    }
    setBodyLoading(true);
    let cancelled = false;
    getSkillBody(skill.slug).then((b) => {
      if (!cancelled) {
        setBody(b || '');
        setBodyLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [skill?.slug]);

  if (!skill) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="text-3xl font-serif font-medium">未找到该 skill</h1>
        <p className="mt-3 text-ink-mute">slug: <code className="text-xs">{slug}</code></p>
        <Link to="/skills" className="btn btn-link mt-6 inline-block">看全部 skills →</Link>
      </div>
    );
  }

  const category = getCategory(skill.category);
  const related = allSkills
    .filter((s) => s.category === skill.category && s.slug !== skill.slug)
    .slice(0, 3);

  return (
    <article>
      <div className="container-prose pt-16 md:pt-24 pb-12">
        <nav className="text-sm text-ink-mute mb-8 flex flex-wrap gap-2 items-center">
          <Link to="/" className="hover:text-clay">首页</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-clay">分类</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/categories/${category.slug}`} className="hover:text-clay">{category.name}</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 mb-4">
          {category && (
            <Link to={`/categories/${category.slug}`}>
              <span className="pill">{category.name}</span>
            </Link>
          )}
          {skill.featured && <span className="pill pill-active">★ 精选</span>}
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight">
          {skill.title}
        </h1>

        {skill.description && (
          <p className="mt-6 text-xl text-ink-soft leading-relaxed whitespace-pre-line">
            {skill.description}
          </p>
        )}

        {(skill.author || skill.updated || skill.tags.length > 0) && (
          <div className="mt-8 pt-6 border-t border-ink-line flex flex-wrap gap-6 text-sm text-ink-mute">
            {skill.author && <span>作者:<span className="text-ink">{skill.author}</span></span>}
            {skill.updated && <span>更新:<span className="text-ink">{skill.updated}</span></span>}
            {skill.tags.length > 0 && (
              <span className="flex gap-2 flex-wrap">
                {skill.tags.map((t) => <span key={t}>#{t}</span>)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="container-prose pb-20">
        {bodyLoading ? (
          <div className="text-ink-mute italic py-12 text-center">正在加载正文...</div>
        ) : (
          <Markdown source={body} />
        )}
      </div>

      {related.length > 0 && (
        <div className="border-t border-ink-line bg-cream-50">
          <div className="container-wide py-16">
            <h2 className="text-2xl font-serif font-medium mb-8">同分类下的其他 skill</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((s) => (
                <SkillCard key={s.slug} skill={s} categoryName={category?.name} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
