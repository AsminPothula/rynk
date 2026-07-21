import type { Page } from '@playwright/test';
import { type TestUser, getTestUser } from './test-users';

/**
 * Log in via the UI and wait for the dashboard to load.
 *
 * When `user` is omitted, uses the admin credentials for the current portal
 * (derived from the page's base URL).
 */
export async function login(page: Page, user?: TestUser) {
  const creds = user ?? getTestUser(getPortal(page));

  await page.goto('/sign-in');
  await page.getByText('Login').first().waitFor({ state: 'visible' });
  await page.getByPlaceholder('email').fill(creds.email);
  await page.getByPlaceholder('password').fill(creds.password);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForURL('**/dashboard', { timeout: 10_000 });
  await page.waitForTimeout(2_000);
}

/** Derive the Playwright project name from the page's base URL. */
function getPortal(page: Page): string {
  const url = page.url();
  if (url.includes(':3022')) return 'admin-portal';
  return 'user-portal';
}
