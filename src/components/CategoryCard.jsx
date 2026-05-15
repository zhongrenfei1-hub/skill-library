import { Link } from 'react-router-dom';

export default function CategoryCard({ category, featured = false }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`card relative overflow-hidden ${
        featured ? 'md:col-span-2 lg:col-span-2 bg-cream-200 hover:bg-cream-300' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl" aria-hidden>{category.icon || '✦'}</span>
        <span className="numeral text-xs text-ink-mute font-mono">
          {category.count} skill{category.count === 1 ? '' : 's'}
        </span>
      </div>
      <h3 className="text-xl font-serif font-medium text-ink">
        {category.name}
      </h3>
      {category.tagline && (
        <p className="mt-1 text-sm text-clay">{category.tagline}</p>
      )}
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        {category.description}
      </p>
      {featured && (
        <div className="absolute top-4 right-4">
          <span className="pill pill-active">精选</span>
        </div>
      )}
    </Link>
  );
}
