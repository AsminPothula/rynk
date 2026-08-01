import { test, expect } from '@playwright/test';

test.describe('Sign up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
  });

  test('successful registration redirects to dashboard', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.getByPlaceholder('email').fill(uniqueEmail);
    await page
      .getByPlaceholder('password', { exact: true })
      .fill('TestPassword123!');
    await page.getByPlaceholder('confirm password').fill('TestPassword123!');

    // Fill invite code if present (admin-portal has it)
    const inviteCode = page.getByPlaceholder('Enter invite code');
    if (await inviteCode.isVisible()) {
      await inviteCode.fill('ADMIN-INVITE-123');
    }

    // Accept terms checkbox if present (user-portal has it)
    const termsCheckbox = page.getByRole('checkbox');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.dispatchEvent('click');
    }

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
  });

  test('navigate to sign-in page', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(/sign-in/);
  });
});
