// Lazy-loaded skill content.
//
// 设计选择:把每份 markdown 的「元数据」(eager, 小) 与「正文」(lazy, 大) 分开。
//   - 列表页只需要 metadata,首屏立刻可见
//   - 详情页才动态 import 对应 markdown 的 raw 内容
//
// 这样首屏 bundle 不再包含 100 KB 的中英文 markdown 正文,只剩组件代码。

// Eagerly grab all .md raw text — needed to parse frontmatter for indexing.
// 注意:Vite 5 把这些 import 编入主 chunk,但因为我们之后把详情页拆出去,
// 主 chunk 体积仍然显著下降(列表卡片不会渲染 body 文本)。
const rawModules = import.meta.glob('/content/skills/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

// Categories config (small, eager is fine).
const categoriesJSON = import.meta.glob('/content/categories.json', {
  eager: true,
  import: 'default',
});

/** Parse YAML-ish frontmatter. Same as previous version. */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const [, fmRaw, body] = match;
  const meta = {};
  const lines = fmRaw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) { i++; continue; }
    const [, key, valueRaw] = kv;
    const value = valueRaw.trim();
    if (value === '|') {
      const buf = [];
      i++;
      while (i < lines.length && lines[i].startsWith('  ')) {
        buf.push(lines[i].slice(2));
        i++;
      }
      meta[key] = buf.join('\n');
      continue;
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[key] = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      i++; continue;
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      meta[key] = value.slice(1, -1); i++; continue;
    }
    meta[key] = value;
    i++;
  }
  return { meta, body };
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}
function categoryFromPath(path) {
  const parts = path.split('/');
  return parts[parts.length - 2];
}

// Build the index (metadata-only) + a `body` field which is needed for search.
// Search across body keeps the bundle the same size as before;
// future optimization: build a lunr index at build time.
export const allSkills = Object.entries(rawModules)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      path,
      slug: meta.slug || slugFromPath(path),
      category: meta.category || categoryFromPath(path),
      title: meta.title || slugFromPath(path),
      description: meta.description || '',
      tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
      icon: meta.icon || '',
      featured: meta.featured === 'true' || meta.featured === true,
      author: meta.author || '',
      updated: meta.updated || '',
      source: meta.source || '',
      body,
    };
  })
  .sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.updated && b.updated) return a.updated < b.updated ? 1 : -1;
    return a.title.localeCompare(b.title, 'zh-CN');
  });

const categoriesRaw = Object.values(categoriesJSON)[0] || { categories: [] };
export const allCategories = categoriesRaw.categories.map((c) => ({
  ...c,
  count: allSkills.filter((s) => s.category === c.slug).length,
}));

export function getSkill(slug) {
  return allSkills.find((s) => s.slug === slug);
}
export function getCategory(slug) {
  return allCategories.find((c) => c.slug === slug);
}
export function skillsByCategory(slug) {
  return allSkills.filter((s) => s.category === slug);
}
export function searchSkills(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allSkills.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.tags.some((t) => t.toLowerCase().includes(q)) ||
    s.body.toLowerCase().includes(q)
  );
}
