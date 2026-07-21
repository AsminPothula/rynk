import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

test.describe('Sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('navigate to users via sidebar', async ({ page }) => {
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Users' })
      .click();
    await expect(page).toHaveURL(/users/);
  });

  test('navigate to settings via sidebar', async ({ page }) => {
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Settings' })
      .click();
    await expect(page).toHaveURL(/settings/);
  });

  test('navigate to dashboard via sidebar', async ({ page }) => {
    // Navigate away first
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Settings' })
      .click();
    await expect(page).toHaveURL(/settings/);

    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Dashboard' })
      .click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('sidebar preference persists across reload', async ({ page }) => {
    // Read initial preference
    const initialPref = await page.evaluate(() =>
      localStorage.getItem('app:prefer-sidebar-open'),
    );

    // Toggle sidebar (click the collapse/expand chevron button)
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .locator('visible=true');
    // Find the sidebar toggle — it's the small round button on the sidebar edge
    const sidebarToggle = page
      .locator('aside button, nav button')
      .filter({
        has: page.locator('svg.lucide-chevron-left, svg.lucide-chevron-right'),
      })
      .first();

    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      await page.waitForTimeout(500);

      const updatedPref = await page.evaluate(() =>
        localStorage.getItem('app:prefer-sidebar-open'),
      );

      // Preference should have changed
      expect(updatedPref).not.toEqual(initialPref);

      // Reload and verify persistence
      await page.reload();
      await page.waitForTimeout(2_000);

      const reloadedPref = await page.evaluate(() =>
        localStorage.getItem('app:prefer-sidebar-open'),
      );
      expect(reloadedPref).toEqual(updatedPref);
    }
  });
});
