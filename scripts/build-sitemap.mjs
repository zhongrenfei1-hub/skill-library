#!/usr/bin/env node
// Build sitemap.xml + rss.xml from the skill index.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INDEX = join(ROOT, 'src', '_generated', 'skill-index.json');
const PUBLIC = join(ROOT, 'public');

const BASE_URL = process.env.SITE_URL || 'https://zhongrenfei1-hub.github.io/skill-library';
const NOW = new Date().toISOString();

const STATIC_ROUTES = ['', '/categories', '/skills', '/local', '/philosophy', '/about'];

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

async function main() {
  if (!existsSync(INDEX)) {
    console.error('skill-index.json not found — run prebuild first');
    process.exit(1);
  }
  const { skills } = JSON.parse(await readFile(INDEX, 'utf-8'));

  // ---- sitemap.xml ----
  const urls = [
    ...STATIC_ROUTES.map((p) => ({ loc: `${BASE_URL}${p}`, priority: p === '' ? 1.0 : 0.6 })),
    ...new Set(skills.map((s) => s.category)).values(),
  ];
  // dedupe + categories
  const cats = [...new Set(skills.map((s) => s.category))];
  const allUrls = [
    ...STATIC_ROUTES.map((p) => ({ loc: `${BASE_URL}${p}`, priority: p === '' ? 1.0 : 0.7, changefreq: 'weekly' })),
    ...cats.map((c) => ({ loc: `${BASE_URL}/categories/${c}`, priority: 0.6, changefreq: 'weekly' })),
    ...skills.map((s) => ({ loc: `${BASE_URL}/skills/${s.slug}`, priority: s.featured ? 0.8 : 0.5, changefreq: 'monthly', lastmod: s.updated || NOW.slice(0, 10) })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`;

  // ---- rss.xml ----
  const rssItems = skills
    .filter((s) => s.updated)
    .slice(0, 50)
    .map((s) => `    <item>
      <title>${xmlEscape(s.title)}</title>
      <link>${BASE_URL}/skills/${s.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/skills/${s.slug}</guid>
      <description>${xmlEscape(s.description)}</description>
      <category>${xmlEscape(s.category)}</category>
      <pubDate>${new Date(s.updated).toUTCString()}</pubDate>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Skill Library · 技能资料库</title>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>按类别整理的 Claude Skills 资料库 — markdown 驱动、可拖拽、本地文件夹联动。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`;

  // ---- robots.txt ----
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  // ---- Public skills.json API ----
  // metadata-only (no body) — for AI agents / external consumers
  const apiPayload = {
    meta: {
      site: BASE_URL,
      total: skills.length,
      generated: NOW,
      categories: cats,
      license: 'MIT (skills text adapted from rampstackco/claude-skills, MIT)',
    },
    skills: skills.map((s) => ({
      slug: s.slug,
      title: s.title,
      description: s.description,
      category: s.category,
      tags: s.tags,
      featured: s.featured,
      author: s.author,
      updated: s.updated,
      source: s.source,
      url: `${BASE_URL}/skills/${s.slug}`,
    })),
  };

  await mkdir(PUBLIC, { recursive: true });
  await writeFile(join(PUBLIC, 'sitemap.xml'), sitemap);
  await writeFile(join(PUBLIC, 'rss.xml'), rss);
  await writeFile(join(PUBLIC, 'robots.txt'), robots);
  await writeFile(join(PUBLIC, 'skills.json'), JSON.stringify(apiPayload, null, 2));

  console.log(`✓ sitemap.xml (${allUrls.length} urls)`);
  console.log(`✓ rss.xml (${Math.min(skills.length, 50)} items)`);
  console.log(`✓ robots.txt`);
  console.log(`✓ skills.json (${skills.length} skills, public API)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
