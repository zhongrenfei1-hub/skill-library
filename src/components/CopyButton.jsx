import { useState } from 'react';

export default function CopyButton({ text, label = '复制 markdown' }) {
  const [state, setState] = useState('idle');

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text || '');
      setState('done');
      setTimeout(() => setState('idle'), 1500);
    } catch {
      setState('err');
      setTimeout(() => setState('idle'), 1500);
    }
  };

  return (
    <button onClick={onClick} className="btn btn-ghost text-xs" disabled={!text}>
      {state === 'done' ? '✓ 已复制' : state === 'err' ? '复制失败' : label}
    </button>
  );
}
