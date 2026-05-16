import { Link } from 'react-router-dom';
import { allCategories, allSkills } from '../lib/content.js';
import CategoryCard from '../components/CategoryCard.jsx';
import SkillCard from '../components/SkillCard.jsx';

export default function Home() {
  const featuredCategory = allCategories.find((c) => c.featured) || allCategories[0];
  const otherCategories = allCategories.filter((c) => c.slug !== featuredCategory?.slug);
  const recent = allSkills.slice(0, 6);

  const categoryNameMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.name]));

  return (
    <>
      {/* Hero */}
      <section className="container-wide pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="max-w-3xl">
          <span className="eyebrow">Skill Library · 技能资料库</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-serif font-medium leading-[1.05] tracking-tight">
            按类别整理的<br />
            <span className="text-clay">Claude Skills</span>。
          </h1>
          <p className="mt-8 text-lg text-ink-soft max-w-2xl leading-relaxed">
            从电商品牌网站,到内容创作、SEO、设计、开发 ——
            把每一个可复用的工作流都整理成一份 markdown,放在它该在的位置。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/categories" className="btn btn-primary">浏览分类 →</Link>
            <Link to="/skills" className="btn btn-ghost">全部 skills</Link>
            <Link to="/local" className="btn btn-link">📂 本地导入</Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-ink-line bg-cream-50">
        <div className="container-wide py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat n={allSkills.length} label="收录 skills" />
          <Stat n={allCategories.length} label="分类" />
          <Stat n={allCategories.filter((c) => c.count > 0).length} label="活跃分类" />
          <Stat n={new Set(allSkills.flatMap((s) => s.tags)).size} label="标签" />
        </div>
      </section>

      {/* Featured category callout */}
      {featuredCategory && (
        <section className="container-wide py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="eyebrow">精选分类</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium leading-tight">
                {featuredCategory.name}
              </h2>
              {featuredCategory.tagline && (
                <p className="mt-3 text-xl text-clay">{featuredCategory.tagline}</p>
              )}
              <p className="mt-6 text-ink-soft leading-relaxed text-lg">
                {featuredCategory.description}
              </p>
              <div className="mt-8">
                <Link
                  to={`/categories/${featuredCategory.slug}`}
                  className="btn btn-link"
                >
                  进入 {featuredCategory.name} →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allSkills
                .filter((s) => s.category === featuredCategory.slug)
                .slice(0, 4)
                .map((skill) => (
                  <SkillCard key={skill.slug} skill={skill} categoryName={featuredCategory.name} />
                ))}
              {allSkills.filter((s) => s.category === featuredCategory.slug).length === 0 && (
                <div className="card text-ink-mute text-sm italic">
                  暂无 skill,请在 <code className="text-xs">content/skills/{featuredCategory.slug}/</code> 下添加 .md 文件
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* All categories grid */}
      <section className="container-wide pb-20 md:pb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl font-serif font-medium">全部分类</h2>
          <Link to="/categories" className="btn btn-link">看所有分类 →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherCategories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Recent skills */}
      {recent.length > 0 && (
        <section className="container-wide pb-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-serif font-medium">最近收录</h2>
            <Link to="/skills" className="btn btn-link">看全部 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((skill) => (
              <SkillCard
                key={skill.slug}
                skill={skill}
                categoryName={categoryNameMap[skill.category]}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-serif text-3xl md:text-4xl text-ink">{n}</div>
      <div className="text-xs uppercase tracking-wider text-ink-mute mt-1">{label}</div>
    </div>
  );
}
