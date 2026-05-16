// Hybrid content loader:
//
//   - allSkills / allCategories: synchronous (from pre-built index, ~100KB).
//     Used by Home, Categories, AllSkills, Search (cheap operations).
//
//   - getSkillBody(slug): async, dynamic import.
//     Loads a single markdown file's body when SkillPage opens it.
//
//   - getAllBodies(): async, parallel import.
//     Used only by deep full-text search.

import skillIndex from '../_generated/skill-index.json';

const categoriesJSON = import.meta.glob('/content/categories.json', {
  eager: true,
  import: 'default',
});

// Lazy markdown raw imports (NOT eager — keeps body out of initial bundle).
const bodyLoaders = import.meta.glob('/content/skills/**/*.md', {
  query: '?raw',
  import: 'default',
});

export const allSkills = skillIndex.skills;

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

// In-index search — uses title/description/tags/excerpt only.
export function searchSkills(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allSkills.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.tags.some((t) => t.toLowerCase().includes(q)) ||
    (s.excerpt && s.excerpt.toLowerCase().includes(q))
  );
}

// Strip frontmatter from a raw markdown string.
function stripFrontmatter(raw) {
  const m = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return m ? m[1] : raw;
}

/** Lazy-load one skill's markdown body. */
export async function getSkillBody(slug) {
  const skill = getSkill(slug);
  if (!skill) return null;
  const loader = bodyLoaders[skill.path];
  if (!loader) return null;
  const raw = await loader();
  return stripFrontmatter(raw);
}

/** Lazy full-text search across bodies — heavier; only call on demand. */
export async function deepSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const indexHits = new Set(searchSkills(q).map((s) => s.slug));
  // Also scan bodies for skills NOT already matched
  const remaining = allSkills.filter((s) => !indexHits.has(s.slug));
  const matched = await Promise.all(remaining.map(async (s) => {
    const body = await getSkillBody(s.slug);
    return body && body.toLowerCase().includes(q) ? s : null;
  }));
  return [
    ...allSkills.filter((s) => indexHits.has(s.slug)),
    ...matched.filter(Boolean),
  ];
}
