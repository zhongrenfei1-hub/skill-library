import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink-line mt-24 bg-cream-50">
      <div className="container-wide py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-serif text-lg font-medium">Skill Library</div>
          <p className="mt-3 text-sm text-ink-soft max-w-xs">
            按类别整理的 Claude Skills 资料库。 一份 markdown,一个 skill。
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-mute mb-3">浏览</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-clay">首页</Link></li>
            <li><Link to="/categories" className="hover:text-clay">分类</Link></li>
            <li><Link to="/skills" className="hover:text-clay">全部 Skills</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-mute mb-3">关于</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-clay">关于</Link></li>
            <li><Link to="/about#contribute" className="hover:text-clay">如何添加 skill</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-mute mb-3">参考</div>
          <ul className="space-y-2 text-sm">
            <li><a href="https://docs.anthropic.com" className="hover:text-clay" target="_blank" rel="noreferrer">Claude Docs ↗</a></li>
            <li><a href="https://github.com/rampstackco/claude-skills" className="hover:text-clay" target="_blank" rel="noreferrer">rampstack skills ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-line">
        <div className="container-wide py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-mute">
          <span>© {new Date().getFullYear()} Skill Library</span>
          <span>Built with React · Vite · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
