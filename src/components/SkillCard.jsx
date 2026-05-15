import { Link } from 'react-router-dom';

export default function SkillCard({ skill, categoryName }) {
  return (
    <Link to={`/skills/${skill.slug}`} className="card group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="pill">{categoryName || skill.category}</span>
        {skill.featured && (
          <span className="text-xs text-clay">★ 精选</span>
        )}
      </div>
      <h3 className="text-lg font-serif font-medium text-ink group-hover:text-clay transition-colors">
        {skill.title}
      </h3>
      <p className="mt-2 text-sm text-ink-soft line-clamp-3 leading-relaxed">
        {skill.description}
      </p>
      {skill.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs text-ink-mute">#{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
