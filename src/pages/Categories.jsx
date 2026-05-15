import { allCategories } from '../lib/content.js';
import CategoryCard from '../components/CategoryCard.jsx';

export default function Categories() {
  const featured = allCategories.filter((c) => c.featured);
  const rest = allCategories.filter((c) => !c.featured);

  return (
    <div className="container-wide py-16 md:py-24">
      <span className="eyebrow">分类 · Categories</span>
      <h1 className="mt-4 text-4xl md:text-5xl font-serif font-medium">所有分类</h1>
      <p className="mt-4 text-ink-soft max-w-prose leading-relaxed">
        skills 按主题划分,方便检索与扩展。每个分类下可以放任意多份 markdown。
      </p>

      {featured.length > 0 && (
        <>
          <h2 className="mt-16 mb-6 text-2xl font-serif font-medium">精选</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} featured />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-16 mb-6 text-2xl font-serif font-medium">全部</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}
