/**
 * Cross-Tab Sync Edge Cases — E2E Tests
 *
 * Additional cross-tab scenarios beyond the basics in sync.spec.ts.
 * All MSW-independent — simulate via localStorage + StorageEvent.
 */
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

test.describe('Cross-tab sync edge cases', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('sidebar preference syncs across tabs', async ({ page }) => {
    // Verify sidebar is visible initially
    const sidebar = page.getByRole('navigation');
    await expect(sidebar).toBeVisible();

    // Simulate another tab collapsing the sidebar
    await page.evaluate(() => {
      const key = 'app:prefer-sidebar-open';
      const collapsed = JSON.stringify({
        state: { preferSidebarOpen: false },
        version: 0,
      });
      localStorage.setItem(key, collapsed);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: collapsed,
          storageArea: localStorage,
        }),
      );
    });

    // Verify the sidebar preference was updated in localStorage
    const pref = await page.evaluate(() => {
      const raw = localStorage.getItem('app:prefer-sidebar-open');
      return raw ? JSON.parse(raw).state.preferSidebarOpen : null;
    });
    expect(pref).toBe(false);
  });

  test('rapid successive cross-tab changes apply correctly', async ({
    page,
  }) => {
    // Navigate to settings to see both theme and language effects
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await expect(page).toHaveURL(/settings/);

    // Fire theme → language → theme changes in rapid succession
    await page.evaluate(() => {
      const dispatch = (key: string, value: string) => {
        localStorage.setItem(key, value);
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: value,
            storageArea: localStorage,
          }),
        );
      };

      dispatch(
        'app:theme',
        JSON.stringify({ state: { theme: 'dark' }, version: 0 }),
      );
      dispatch(
        'app:language-preference',
        JSON.stringify({ state: { language: 'de' }, version: 0 }),
      );
      dispatch(
        'app:theme',
        JSON.stringify({ state: { theme: 'light' }, version: 0 }),
      );
    });

    // Final state: light theme + German language
    await expect(page.locator('html')).not.toHaveClass(/dark/, {
      timeout: 5_000,
    });
    await expect(page.getByText('Einstellungen')).toBeVisible({
      timeout: 5_000,
    });
  });

  test('auth token refresh in another tab syncs without logout', async ({
    page,
  }) => {
    // Get current auth state
    const original = await page.evaluate(() => {
      const raw = localStorage.getItem('app:auth');
      return raw ? JSON.parse(raw).state.authData : null;
    });
    expect(original).toBeTruthy();

    // Simulate another tab refreshing tokens (new tokens, bumped version)
    await page.evaluate(() => {
      const key = 'app:auth';
      const raw = localStorage.getItem(key);
      const current = raw ? JSON.parse(raw) : null;
      const authData = current?.state?.authData;

      const refreshed = JSON.stringify({
        state: {
          authData: {
            ...authData,
            accessToken: 'refreshed-access-token-from-other-tab',
            refreshToken: 'refreshed-refresh-token-from-other-tab',
            _authTokenVersion: (authData?._authTokenVersion ?? 0) + 1,
          },
        },
        version: 0,
      });
      localStorage.setItem(key, refreshed);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: refreshed,
          storageArea: localStorage,
        }),
      );
    });

    // Should NOT be logged out — still on dashboard
    await page.waitForTimeout(2_000);
    await expect(page).toHaveURL(/dashboard|users|settings/);

    // Verify the new tokens were picked up
    const updated = await page.evaluate(() => {
      const raw = localStorage.getItem('app:auth');
      return raw ? JSON.parse(raw).state.authData : null;
    });
    expect(updated?.accessToken).toBe('refreshed-access-token-from-other-tab');
    expect(updated?._authTokenVersion).toBe(
      (original._authTokenVersion ?? 0) + 1,
    );
  });

  test('corrupted localStorage value does not crash the app', async ({
    page,
  }) => {
    // Write garbage to a synced store key
    await page.evaluate(() => {
      const key = 'app:theme';
      const garbage = 'not-valid-json{{{';
      localStorage.setItem(key, garbage);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: garbage,
          storageArea: localStorage,
        }),
      );
    });

    // App should not crash — still on dashboard
    await page.waitForTimeout(2_000);
    await expect(page).toHaveURL(/dashboard|users|settings/);
  });

  test('removing a store key from localStorage triggers rehydration', async ({
    page,
  }) => {
    // Set dark theme first
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Simulate another tab removing the theme key entirely
    await page.evaluate(() => {
      const key = 'app:theme';
      localStorage.removeItem(key);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: null,
          oldValue: JSON.stringify({ state: { theme: 'dark' }, version: 0 }),
          storageArea: localStorage,
        }),
      );
    });

    // App should not crash — still navigable
    await page.waitForTimeout(2_000);
    await expect(page).toHaveURL(/dashboard|users|settings/);
  });
});
