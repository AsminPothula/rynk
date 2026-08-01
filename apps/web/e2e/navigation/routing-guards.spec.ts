import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

test.describe('Routing guards', () => {
  test.describe('unauthenticated', () => {
    test('visiting /dashboard redirects to landing', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
    });

    test('visiting /settings redirects to landing', async ({ page }) => {
      await page.goto('/settings');
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
    });

    test('visiting /users redirects to landing', async ({ page }) => {
      await page.goto('/users');
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
    });

    test('visiting unknown route redirects to landing', async ({ page }) => {
      await page.goto('/nonexistent-page');
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
    });

    test('landing page shows get started button', async ({ page }) => {
      await page.goto('/landing');
      await expect(
        page.getByRole('button', { name: 'Get Started' }),
      ).toBeVisible();
    });

    test('get started navigates to sign-in', async ({ page }) => {
      await page.goto('/landing');
      await page.getByRole('button', { name: 'Get Started' }).click();
      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('authenticated', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
      await neutralizeInactivity(page);
    });

    test('visiting /sign-in redirects to dashboard', async ({ page }) => {
      await page.goto('/sign-in');
      await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
    });

    test('visiting unknown route redirects to home', async ({ page }) => {
      await page.goto('/nonexistent-page');
      await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
    });

    test('visiting / redirects to dashboard', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
    });
  });
});
