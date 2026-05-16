#!/usr/bin/env node
// Pre-build: generate src/_generated/skill-index.json
//
// Why: 不让所有 markdown body 进入主 chunk。
// 主 chunk 只读 metadata(< 50KB),body 由 SkillPage / Search 按需 lazy import。

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SKILLS_DIR = join(ROOT, 'content', 'skills');
const OUT_DIR = join(ROOT, 'src', '_generated');
const OUT_FILE = join(OUT_DIR, 'skill-index.json');

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const [, fmRaw, body] = m;
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
      const buf = []; i++;
      while (i < lines.length && lines[i].startsWith('  ')) {
        buf.push(lines[i].slice(2)); i++;
      }
      meta[key] = buf.join('\n'); continue;
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      i++; continue;
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      meta[key] = value.slice(1, -1); i++; continue;
    }
    meta[key] = value; i++;
  }
  return { meta, body };
}

async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...await walk(p));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      out.push(p);
    }
  }
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = await walk(SKILLS_DIR);
  const skills = [];
  for (const file of files) {
    const raw = await readFile(file, 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    const rel = file.replace(ROOT + '/', '/');
    const fileName = file.split('/').pop().replace(/\.md$/, '');
    const category = meta.category || file.split('/').slice(-2, -1)[0];
    skills.push({
      slug: meta.slug || fileName,
      category,
      title: meta.title || fileName,
      description: meta.description || '',
      tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
      icon: meta.icon || '',
      featured: meta.featured === 'true' || meta.featured === true,
      author: meta.author || '',
      updated: meta.updated || '',
      source: meta.source || '',
      // search excerpt — first ~300 chars of body for in-list search hits
      excerpt: body.replace(/^#.*$/gm, '').replace(/\s+/g, ' ').trim().slice(0, 300),
      path: rel,
    });
  }

  // sort: featured first, then updated desc, then alpha
  skills.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.updated && b.updated) return a.updated < b.updated ? 1 : -1;
    return a.title.localeCompare(b.title, 'zh-CN');
  });

  await writeFile(OUT_FILE, JSON.stringify({ skills, generatedAt: new Date().toISOString() }, null, 2));
  console.log(`✓ wrote ${skills.length} skills to ${OUT_FILE.replace(ROOT + '/', '')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
