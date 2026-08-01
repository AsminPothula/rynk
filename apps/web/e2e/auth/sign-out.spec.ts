import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity } from '../fixtures/helpers';

test.describe('Sign out', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('logout via settings clears session and redirects', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await expect(page).toHaveURL(/settings/);

    // Click the logout trigger button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Confirm in the dialog
    await page.getByRole('alertdialog').waitFor({ state: 'visible' });
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Logout' })
      .click();

    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });

  test('auth is cleared from localStorage after logout', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.getByRole('alertdialog').waitFor({ state: 'visible' });
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Logout' })
      .click();

    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });

    const authData = await page.evaluate(() =>
      localStorage.getItem('app:auth'),
    );
    const parsed = authData ? JSON.parse(authData) : null;
    // Auth data should be null or have null state
    expect(!parsed || !parsed.state?.authData).toBeTruthy();
  });

  test('visiting dashboard after logout redirects to landing', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.getByRole('alertdialog').waitFor({ state: 'visible' });
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Logout' })
      .click();
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });
});
