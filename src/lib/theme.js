// Theme support: light (default) / sepia / dark.
// State stored in localStorage, applied via data-theme on <html>.

const KEY = 'sl_theme_v1';
export const THEMES = ['light', 'sepia', 'dark'];

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(KEY);
    return THEMES.includes(v) ? v : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = 'light';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(KEY, theme); } catch {}
}

// Apply at boot, before React renders, to avoid FOUC.
export function bootTheme() {
  applyTheme(getStoredTheme());
}
