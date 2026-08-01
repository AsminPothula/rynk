/**
 * Inactivity Cross-Tab Sync — E2E Tests
 *
 * Runs against `user-portal-inactivity` (6s timeout, 4s warning).
 * Tests that activity in one tab extends the timer for other tabs
 * and that expired sessions are handled on tab open.
 *
 * ⚠️  Do NOT call neutralizeInactivity() — these tests rely on the timer.
 */
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';

test.describe('Inactivity cross-tab sync', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('activity in another tab extends timer for current tab', async ({
    page,
  }) => {
    // Wait 1.5s (before warning threshold at 2s)
    await page.waitForTimeout(1_500);

    // Simulate another tab stamping activity via storage event
    await page.evaluate(() => {
      const key = 'app:inactivity';
      const fresh = JSON.stringify({
        state: { lastActiveAt: Date.now() },
        version: 0,
      });
      localStorage.setItem(key, fresh);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: fresh,
          storageArea: localStorage,
        }),
      );
    });

    // Wait another 1.5s — total 3s since start but only 1.5s since "activity"
    await page.waitForTimeout(1_500);

    // Should still be on dashboard, no warning
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Session Timeout Warning')).not.toBeVisible();

    // Now let it expire naturally (wait full timeout from last activity)
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 15_000 });
  });

  test('opening tab with expired session in localStorage triggers immediate logout', async ({
    page,
  }) => {
    // Simulate an expired session: lastActiveAt was 30 seconds ago (way past 6s timeout)
    await page.evaluate(() => {
      const key = 'app:inactivity';
      const expired = JSON.stringify({
        state: { lastActiveAt: Date.now() - 30_000 },
        version: 0,
      });
      localStorage.setItem(key, expired);
    });

    // Reload the page to simulate opening a new tab with expired state
    await page.reload();

    // Should be redirected to login since session expired
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });

  test('cross-tab logout during warning dismisses dialog in current tab', async ({
    page,
  }) => {
    // Wait for warning dialog
    await expect(page.getByText('Session Timeout Warning')).toBeVisible({
      timeout: 8_000,
    });

    // Simulate another tab logging out
    await page.evaluate(() => {
      const key = 'app:auth';
      const loggedOut = JSON.stringify({
        state: { authData: null },
        version: 0,
      });
      localStorage.setItem(key, loggedOut);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: loggedOut,
          storageArea: localStorage,
        }),
      );
    });

    // Should redirect to login (warning no longer relevant)
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });
});
