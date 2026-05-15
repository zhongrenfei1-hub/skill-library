// Auto-load all skill markdown files at build time via Vite's import.meta.glob.
// Skill files live at /content/skills/<category>/<slug>.md
// They use YAML-ish frontmatter for metadata.

const rawModules = import.meta.glob('/content/skills/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const categoriesJSON = import.meta.glob('/content/categories.json', {
  eager: true,
  import: 'default',
});

/**
 * Parse YAML-ish frontmatter. Supports flat key: value pairs and arrays:
 *   ---
 *   key: value
 *   tags: [a, b, c]
 *   description: |
 *     Multi-line description
 *     across lines
 *   ---
 */
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
    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) { i++; continue; }
    const [, key, valueRaw] = kvMatch;
    const value = valueRaw.trim();

    // Multi-line scalar (|)
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

    // Inline array
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      i++;
      continue;
    }

    // Quoted string
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      meta[key] = value.slice(1, -1);
      i++;
      continue;
    }

    meta[key] = value;
    i++;
  }
  return { meta, body };
}

function slugFromPath(path) {
  // /content/skills/ecommerce-brand/brand-positioning.md → "brand-positioning"
  const file = path.split('/').pop();
  return file.replace(/\.md$/, '');
}

function categoryFromPath(path) {
  // /content/skills/ecommerce-brand/brand-positioning.md → "ecommerce-brand"
  const parts = path.split('/');
  return parts[parts.length - 2];
}

/** All skills, parsed. */
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
      body,
    };
  })
  .sort((a, b) => {
    // featured first, then by updated date desc, then alpha
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.updated && b.updated) return a.updated < b.updated ? 1 : -1;
    return a.title.localeCompare(b.title, 'zh-CN');
  });

/** Categories from /content/categories.json */
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
  return allSkills.filter((s) => {
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.body.toLowerCase().includes(q)
    );
  });
}
