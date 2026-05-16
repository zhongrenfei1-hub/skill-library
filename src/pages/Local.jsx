import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DropZone from '../components/DropZone.jsx';
import Markdown from '../components/Markdown.jsx';
import { FSA_SUPPORTED, pickDirectoryAndLoad, reReadDir } from '../lib/localSkills.js';

const STORAGE_KEY = 'sl_local_skills_v1';

export default function Local() {
  const [skills, setSkills] = useState([]);
  const [dirHandle, setDirHandle] = useState(null);
  const [dirName, setDirName] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [err, setErr] = useState('');

  // Persist drag-imported skills in session storage so a refresh doesn't lose them.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setSkills(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    } catch {}
  }, [skills]);

  const addSkills = useCallback((incoming) => {
    setSkills((prev) => {
      const map = new Map(prev.map((s) => [s.slug + s.source, s]));
      for (const s of incoming) map.set(s.slug + s.source, s);
      return Array.from(map.values());
    });
  }, []);

  const openFolder = useCallback(async () => {
    setErr('');
    try {
      const { dirHandle, skills } = await pickDirectoryAndLoad();
      setDirHandle(dirHandle);
      setDirName(dirHandle.name);
      addSkills(skills);
    } catch (e) {
      if (e.name !== 'AbortError') setErr(e.message);
    }
  }, [addSkills]);

  const refresh = useCallback(async () => {
    if (!dirHandle) return;
    setErr('');
    try {
      const fresh = await reReadDir(dirHandle);
      // remove old fsa: skills, replace with fresh
      setSkills((prev) => {
        const nonFsa = prev.filter((s) => !s.source?.startsWith('fsa:'));
        return [...nonFsa, ...fresh];
      });
    } catch (e) {
      setErr(e.message);
    }
  }, [dirHandle]);

  const clearAll = () => {
    setSkills([]);
    setSelectedSlug('');
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(skills, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-skills-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selected = skills.find((s) => s.slug + s.source === selectedSlug);

  return (
    <div className="container-wide py-16 md:py-20">
      <span className="eyebrow">本地工作区 · Local</span>
      <h1 className="mt-4 text-4xl md:text-5xl font-serif font-medium">把本地 markdown 接进来</h1>
      <p className="mt-4 text-ink-soft max-w-prose leading-relaxed">
        两种方式:**直接拖**(任意 .md 或目录)、或**打开整个文件夹**(File System Access API,
        修改后点"重新读取"同步)。导入的 skill 只活在你的浏览器,不上传任何服务器。
      </p>

      {/* Action row */}
      <div className="mt-10 flex flex-wrap gap-3 items-center">
        <button onClick={openFolder} className="btn btn-primary" disabled={!FSA_SUPPORTED}>
          📂 打开本地文件夹
        </button>
        {dirHandle && (
          <button onClick={refresh} className="btn btn-ghost">
            🔄 重新读取 {dirName}
          </button>
        )}
        {skills.length > 0 && (
          <>
            <button onClick={exportAll} className="btn btn-ghost">📦 导出 JSON</button>
            <button onClick={clearAll} className="btn btn-link text-clay">清空</button>
          </>
        )}
        {!FSA_SUPPORTED && (
          <span className="text-xs text-ink-mute">
            当前浏览器不支持 File System Access(用 Chrome / Edge 可启用文件夹模式)
          </span>
        )}
      </div>

      {err && <p className="mt-4 text-sm" style={{ color: '#8B2E2E' }}>{err}</p>}

      {/* Drop zone */}
      <div className="mt-8">
        <DropZone onSkills={addSkills} />
      </div>

      {/* Results */}
      {skills.length > 0 && (
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          {/* List */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="text-xs uppercase tracking-wider text-ink-mute mb-3">
              本地 {skills.length} 份
            </div>
            <ul className="divide-y divide-ink-line border-y border-ink-line">
              {skills.map((s) => {
                const id = s.slug + s.source;
                const isActive = id === selectedSlug;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setSelectedSlug(id)}
                      className={`block w-full text-left py-3 px-1 transition-colors ${
                        isActive ? 'text-clay' : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium truncate">{s.icon} {s.title}</span>
                        <span className="text-xs text-ink-mute">{s.category}</span>
                      </div>
                      <p className="mt-1 text-xs text-ink-mute truncate">{s.source}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Detail */}
          <div>
            {selected ? (
              <article>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="pill">{selected.category}</span>
                  {selected.featured && <span className="pill pill-active">★ 精选</span>}
                  <code className="text-xs text-ink-mute">{selected._localName}</code>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-medium">{selected.title}</h2>
                {selected.description && (
                  <p className="mt-3 text-lg text-ink-soft leading-relaxed">{selected.description}</p>
                )}
                <div className="mt-8 pt-4 border-t border-ink-line">
                  <Markdown source={selected.body} />
                </div>
              </article>
            ) : (
              <div className="card text-ink-mute">
                <p>左侧选一份 skill 查看内容。</p>
                <p className="mt-2 text-sm">
                  小提示:文件需要包含 frontmatter(`---` 包裹的 title / description / category)
                  才会显示在列表里。
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {skills.length === 0 && (
        <section className="mt-16 grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon="📥"
            title="拖拽即导入"
            body="把单个 .md 或整个目录拖到上方区域,自动解析 frontmatter 与正文。"
          />
          <FeatureCard
            icon="📂"
            title="本地文件夹联动"
            body="授权一个本地目录后,任意编辑都可一键重新同步,无需重新拖拽。"
          />
          <FeatureCard
            icon="🔒"
            title="不上传"
            body="一切在浏览器里完成。session 存储,关浏览器即清空。"
          />
        </section>
      )}

      <div className="mt-20 pt-8 border-t border-ink-line">
        <h3 className="text-xl font-serif font-medium">导入后做什么?</h3>
        <ul className="mt-4 space-y-2 text-ink-soft">
          <li>
            想正式收录:把文件复制进
            <code className="mx-1 text-xs bg-cream-200 px-1 rounded">content/skills/&lt;category&gt;/</code>
            然后 commit + push,Actions 会自动重建并部署。详见
            <Link to="/about" className="link ml-1">关于</Link>。
          </li>
          <li>仅本地参考:用上面的"导出 JSON"备份,关闭浏览器后丢失。</li>
        </ul>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, body }) {
  return (
    <div className="card">
      <div className="text-2xl mb-3" aria-hidden>{icon}</div>
      <h4 className="font-serif text-lg">{title}</h4>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
