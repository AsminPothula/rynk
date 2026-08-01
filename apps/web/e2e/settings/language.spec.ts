import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

test.describe('Language switching', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('default language is English', async ({ page }) => {
    // Navigate to settings — title should be in English
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await expect(page.getByText('Settings').first()).toBeVisible();
  });

  test('switch to German', async ({ page }) => {
    // Navigate to settings so we can observe a translated title
    await page.getByRole('link', { name: 'Settings' }).first().click();

    await page.getByRole('button', { name: /toggle language/i }).click();
    await page.getByRole('menuitem', { name: 'German' }).click();

    // Settings page h1 title changes to "Einstellungen" in German
    await expect(page.locator('h1')).toHaveText('Einstellungen', {
      timeout: 5_000,
    });
  });

  test('language persists after reload', async ({ page }) => {
    // Switch to German
    await page.getByRole('button', { name: /toggle language/i }).click();
    await page.getByRole('menuitem', { name: 'German' }).click();

    // Verify localStorage
    const stored = await page.evaluate(() =>
      localStorage.getItem('app:language-preference'),
    );
    expect(stored).toContain('de');

    // Reload and verify German persists
    await page.reload();
    await page.waitForTimeout(2_000);

    const storedAfterReload = await page.evaluate(() =>
      localStorage.getItem('app:language-preference'),
    );
    expect(storedAfterReload).toContain('de');
  });

  test('switch back to English from German', async ({ page }) => {
    // Navigate to settings
    await page.getByRole('link', { name: 'Settings' }).first().click();

    // Switch to German first
    await page.getByRole('button', { name: /toggle language/i }).click();
    await page.getByRole('menuitem', { name: 'German' }).click();
    await expect(page.locator('h1')).toHaveText('Einstellungen', {
      timeout: 5_000,
    });

    // Switch back to English
    await page.getByRole('button', { name: /toggle language/i }).click();
    await page.getByRole('menuitem', { name: 'English' }).click();

    await expect(page.getByText('Settings').first()).toBeVisible({
      timeout: 5_000,
    });
  });
});
