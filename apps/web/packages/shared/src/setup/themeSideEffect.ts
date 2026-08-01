import { useThemeStore, type Theme } from '../state/useThemeStore';

function applyTheme(theme: Theme) {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(theme);
}

export function registerThemeSideEffect() {
  // Apply current theme immediately
  applyTheme(useThemeStore.getState().theme);

  // React to future changes
  useThemeStore.subscribe((state) => {
    applyTheme(state.theme);
  });
}
