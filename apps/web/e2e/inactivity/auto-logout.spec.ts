/**
 * Inactivity Auto-Logout — E2E Tests
 *
 * These tests run against the `user-portal-inactivity` project which starts
 * the dev server with short inactivity timeouts:
 *   - INACTIVITY_TIMEOUT_SECONDS=6  (logout after 6s idle)
 *   - INACTIVITY_WARNING_SECONDS=4  (warning shows at 2s idle)
 *
 * ⚠️  Do NOT call neutralizeInactivity() here — these tests rely on the
 *     inactivity timer firing.
 */
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';

test.describe('Inactivity auto-logout', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('warning dialog appears after inactivity threshold', async ({
    page,
  }) => {
    // Wait for the warning dialog to appear (timeout 6s − warning 4s = idle 2s)
    await expect(page.getByText('Session Timeout Warning')).toBeVisible({
      timeout: 8_000,
    });

    // Should show a countdown
    await expect(page.getByText(/logged out in/)).toBeVisible();
  });

  test('"Stay logged in" dismisses warning and resets timer', async ({
    page,
  }) => {
    // Wait for warning
    await expect(page.getByText('Session Timeout Warning')).toBeVisible({
      timeout: 8_000,
    });

    // Click "Stay logged in"
    await page.getByRole('button', { name: 'Stay logged in' }).click();

    // Warning should disappear
    await expect(page.getByText('Session Timeout Warning')).not.toBeVisible();

    // Should still be on the dashboard (not logged out)
    await expect(page).toHaveURL(/dashboard/);

    // Verify the inactivity store was reset
    const lastActiveAt = await page.evaluate(() => {
      const raw = localStorage.getItem('app:inactivity');
      return raw ? JSON.parse(raw).state.lastActiveAt : null;
    });
    expect(lastActiveAt).toBeTruthy();
    expect(Date.now() - lastActiveAt).toBeLessThan(5_000);
  });

  test('"Log out now" from warning dialog logs out immediately', async ({
    page,
  }) => {
    // Wait for warning
    await expect(page.getByText('Session Timeout Warning')).toBeVisible({
      timeout: 8_000,
    });

    // Click "Log out now"
    await page.getByRole('button', { name: 'Log out now' }).click();

    // Should redirect to sign-in/landing
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });

  test('auto-logout after full timeout period', async ({ page }) => {
    // Do nothing — let the full 6s timeout elapse
    // Warning appears at ~2s, logout at ~6s
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 15_000 });

    // Auth should be cleared
    const authData = await page.evaluate(() => {
      const raw = localStorage.getItem('app:auth');
      return raw ? JSON.parse(raw).state.authData : null;
    });
    expect(authData).toBeNull();
  });

  test('user activity (mouse/keyboard) resets inactivity timer', async ({
    page,
  }) => {
    // Wait 1.5s then generate activity (before warning at 2s)
    await page.waitForTimeout(1_500);
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.up();

    // Wait another 1.5s and generate more activity
    await page.waitForTimeout(1_500);
    await page.keyboard.press('Shift');

    // We should still be on the dashboard — timer was reset
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Session Timeout Warning')).not.toBeVisible();

    // Now stop activity and let it time out
    await expect(page.getByText('Session Timeout Warning')).toBeVisible({
      timeout: 8_000,
    });
  });

  test('warning countdown decrements over time', async ({ page }) => {
    // Wait for warning
    await expect(page.getByText('Session Timeout Warning')).toBeVisible({
      timeout: 8_000,
    });

    // Capture the initial remaining text
    const initial = await page.getByText(/logged out in/).textContent();

    // Wait 2 seconds for countdown to tick
    await page.waitForTimeout(2_000);

    const later = await page.getByText(/logged out in/).textContent();

    // They should differ (countdown is ticking)
    expect(initial).not.toEqual(later);
  });
});
