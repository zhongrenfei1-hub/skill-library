import { useEffect, useState } from 'react';
import { THEMES, getStoredTheme, applyTheme } from '../lib/theme.js';

const LABELS = {
  light: { icon: '○', name: '原色' },
  sepia: { icon: '◐', name: '羊皮' },
  dark:  { icon: '●', name: '夜色' },
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const cycle = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    applyTheme(next);
    setTheme(next);
  };

  const info = LABELS[theme] || LABELS.light;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`切换主题(当前 ${info.name})`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-ink-mute border border-ink-line rounded hover:border-ink hover:text-ink transition-colors"
      title={`主题:${info.name} — 点击切换`}
    >
      <span aria-hidden>{info.icon}</span>
      <span className="hidden sm:inline">{info.name}</span>
    </button>
  );
}
