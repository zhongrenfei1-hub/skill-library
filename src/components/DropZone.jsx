import { useState, useRef, useCallback } from 'react';
import { parseDroppedFiles, parseFileList } from '../lib/localSkills.js';

export default function DropZone({ onSkills }) {
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState('');
  const inputRef = useRef(null);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const items = e.dataTransfer.items ? Array.from(e.dataTransfer.items) : null;
    let skills = [];
    try {
      if (items && items.length && items[0].webkitGetAsEntry) {
        skills = await parseDroppedFiles(items);
      } else {
        skills = await parseFileList(e.dataTransfer.files);
      }
      if (skills.length === 0) {
        setHint('没有 .md 文件。请拖入 markdown 或包含 markdown 的文件夹。');
        return;
      }
      setHint(`已导入 ${skills.length} 份 skill`);
      onSkills(skills);
    } catch (err) {
      setHint(`导入失败:${err.message}`);
    }
  }, [onSkills]);

  const handleFiles = useCallback(async (e) => {
    const skills = await parseFileList(e.target.files);
    if (skills.length === 0) {
      setHint('没有选到 .md 文件。');
      return;
    }
    setHint(`已导入 ${skills.length} 份 skill`);
    onSkills(skills);
  }, [onSkills]);

  return (
    <div
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragging ? 'border-clay bg-clay/5' : 'border-ink-line bg-cream-50 hover:border-ink/40'
      }`}
    >
      <div className="text-5xl mb-4" aria-hidden>{dragging ? '⬇' : '📥'}</div>
      <p className="text-lg font-serif font-medium">
        {dragging ? '松手即可导入' : '把 .md 文件或文件夹拖到这里'}
      </p>
      <p className="mt-2 text-sm text-ink-mute">
        支持单文件、多文件、整个目录(递归)
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-ghost"
        >
          选择文件...
        </button>
      </div>
      {hint && (
        <p className="mt-4 text-sm text-clay">{hint}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".md,text/markdown"
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
