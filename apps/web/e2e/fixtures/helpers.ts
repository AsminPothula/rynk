import type { Page } from '@playwright/test';

/**
 * Dispatch periodic activity events so the inactivity timer
 * never fires during headless Playwright execution.
 *
 * MSW-independent — works with any backend.
 */
export async function neutralizeInactivity(page: Page) {
  await page.evaluate(() => {
    window.__keepAlive = setInterval(() => {
      window.dispatchEvent(new MouseEvent('mousedown'));
      window.dispatchEvent(new MouseEvent('click'));
      window.dispatchEvent(new KeyboardEvent('keydown'));
      try {
        const raw = localStorage.getItem('app:inactivity');
        if (raw) {
          const data = JSON.parse(raw);
          data.state.lastActiveAt = Date.now();
          localStorage.setItem('app:inactivity', JSON.stringify(data));
        }
      } catch {
        /* ignore */
      }
    }, 200);
  });
}

/**
 * Execute an MSW helper exposed on `window.msw`.
 *
 * Only available when the app is running with MOCK_API=true.
 * Tests that call this are MSW-dependent.
 */
export function msw(page: Page, expr: string) {
  return page.evaluate(`window.msw.${expr}`);
}
