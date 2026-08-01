import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

/**
 * Cross-tab sync tests.
 *
 * These simulate another tab's localStorage writes by directly
 * manipulating localStorage and dispatching StorageEvents.
 * Fully MSW-independent.
 */
test.describe('Cross-tab sync', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('logout in another tab logs out current tab', async ({ page }) => {
    // Simulate another tab clearing auth from localStorage
    await page.evaluate(() => {
      const key = 'app:auth';
      // Write a logged-out state (null authData)
      const loggedOut = JSON.stringify({
        state: { authData: null },
        version: 0,
      });
      localStorage.setItem(key, loggedOut);

      // Dispatch a storage event as if another tab made the change
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: loggedOut,
          storageArea: localStorage,
        }),
      );
    });

    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });

  test('theme change in another tab reflects in current tab', async ({
    page,
  }) => {
    // Start with light theme
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Light' }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Simulate another tab switching to dark
    await page.evaluate(() => {
      const key = 'app:theme';
      const darkTheme = JSON.stringify({
        state: { theme: 'dark' },
        version: 0,
      });
      localStorage.setItem(key, darkTheme);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: darkTheme,
          storageArea: localStorage,
        }),
      );
    });

    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5_000 });
  });

  test('language change in another tab reflects in current tab', async ({
    page,
  }) => {
    // Navigate to settings where the title translates visibly
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await expect(page.getByText('Settings').first()).toBeVisible();

    // Simulate another tab switching to German
    await page.evaluate(() => {
      const key = 'app:language-preference';
      const german = JSON.stringify({
        state: { language: 'de' },
        version: 0,
      });
      localStorage.setItem(key, german);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: german,
          storageArea: localStorage,
        }),
      );
    });

    // Settings title should update to German "Einstellungen"
    await expect(page.getByText('Einstellungen')).toBeVisible({
      timeout: 5_000,
    });
  });

  test('localStorage.clear() in another tab triggers logout', async ({
    page,
  }) => {
    // Simulate another tab calling localStorage.clear()
    await page.evaluate(() => {
      localStorage.clear();
      // clear() fires a storage event with key=null
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: null,
          newValue: null,
          storageArea: localStorage,
        }),
      );
    });

    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });
});
