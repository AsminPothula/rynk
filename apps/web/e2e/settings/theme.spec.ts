import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

test.describe('Theme switching', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('switch to dark theme', async ({ page }) => {
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('switch to light theme', async ({ page }) => {
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Light' }).click();

    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('theme persists after reload', async ({ page }) => {
    // Switch to dark
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Verify localStorage
    const stored = await page.evaluate(() => localStorage.getItem('app:theme'));
    expect(stored).toContain('dark');

    // Reload and verify
    await page.reload();
    await page.waitForTimeout(2_000);
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('switch to system theme', async ({ page }) => {
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'System' }).click();

    const stored = await page.evaluate(() => localStorage.getItem('app:theme'));
    expect(stored).toContain('system');
  });
});
