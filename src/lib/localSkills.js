// Local skill loading — drag-drop + File System Access API.
// Re-uses the same frontmatter parser as the bundled content loader for parity.

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

function slugFromName(name) {
  return name.replace(/\.md$/i, '').toLowerCase().replace(/[^a-z0-9-_]+/g, '-');
}

function toSkill(name, raw, sourceLabel) {
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug: meta.slug || slugFromName(name),
    title: meta.title || slugFromName(name),
    description: meta.description || '',
    category: meta.category || 'local',
    tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
    icon: meta.icon || '📄',
    featured: meta.featured === 'true' || meta.featured === true,
    author: meta.author || '本地',
    updated: meta.updated || new Date().toISOString().slice(0, 10),
    source: sourceLabel || 'local',
    body,
    _localName: name,
  };
}

// ---- Drag & drop ----

export async function parseDroppedFiles(items) {
  const skills = [];
  const work = [];
  for (const item of items) {
    const entry = item.webkitGetAsEntry?.() || item;
    if (!entry) continue;
    work.push(traverseEntry(entry, skills));
  }
  await Promise.all(work);
  return skills;
}

async function traverseEntry(entry, out) {
  if (entry.isFile) {
    await new Promise((res) => {
      entry.file(async (file) => {
        if (file.name.toLowerCase().endsWith('.md')) {
          const text = await file.text();
          out.push(toSkill(file.name, text, `drag:${entry.fullPath || file.name}`));
        }
        res();
      });
    });
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    await new Promise((res) => {
      const all = [];
      const readBatch = () => {
        reader.readEntries(async (entries) => {
          if (!entries.length) {
            await Promise.all(all);
            res();
            return;
          }
          for (const e of entries) all.push(traverseEntry(e, out));
          readBatch();
        });
      };
      readBatch();
    });
  }
}

// Also accept plain File[] (e.g. from <input type="file" multiple>)
export async function parseFileList(fileList) {
  const out = [];
  const files = Array.from(fileList);
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.md')) {
      const text = await file.text();
      out.push(toSkill(file.name, text, `file:${file.webkitRelativePath || file.name}`));
    }
  }
  return out;
}

// ---- File System Access API ----

export const FSA_SUPPORTED =
  typeof window !== 'undefined' && 'showDirectoryPicker' in window;

export async function pickDirectoryAndLoad() {
  if (!FSA_SUPPORTED) throw new Error('当前浏览器不支持 File System Access API。请用 Chrome / Edge / Arc。');
  const dirHandle = await window.showDirectoryPicker({
    mode: 'read',
    startIn: 'documents',
  });
  const skills = await readDirHandle(dirHandle, '');
  return { dirHandle, skills };
}

async function readDirHandle(dirHandle, prefix) {
  const out = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file' && name.toLowerCase().endsWith('.md')) {
      const file = await handle.getFile();
      const text = await file.text();
      const skill = toSkill(name, text, `fsa:${prefix}${name}`);
      // category = parent folder if available
      if (prefix) skill.category = prefix.replace(/\/$/, '');
      out.push(skill);
    } else if (handle.kind === 'directory') {
      const sub = await readDirHandle(handle, `${prefix}${name}/`);
      out.push(...sub);
    }
  }
  return out;
}

export async function reReadDir(dirHandle) {
  return readDirHandle(dirHandle, '');
}
