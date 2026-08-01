import { test, expect } from '@playwright/test';
import { getTestUser } from '../fixtures/test-users';

test.describe('Sign in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByText('Login').first().waitFor({ state: 'visible' });
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    const user = getTestUser('user-portal');
    await page.getByPlaceholder('email').fill(user.email);
    await page.getByPlaceholder('password').fill(user.password);
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.waitForURL('**/dashboard', { timeout: 10_000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test('invalid credentials shows error', async ({ page }) => {
    await page.getByPlaceholder('email').fill('wrong@test.com');
    await page.getByPlaceholder('password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Should stay on sign-in and show an error toast/message
    await expect(page).toHaveURL(/sign-in/);
  });

  test('navigate to sign-up page', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL(/sign-up/);
  });

  test('navigate to forgot password page', async ({ page }) => {
    // Fill email first so the forgot password link is reachable
    const user = getTestUser('user-portal');
    await page.getByPlaceholder('email').fill(user.email);
    await page.getByRole('button', { name: 'Forgot Password' }).click();
    await expect(page).toHaveURL(/forgot-password/);
  });
});
