/**
 * Token Exchange Race Condition — E2E Tests
 *
 * ⚠️  MSW-dependent: these tests use window.msw helpers to simulate
 *     token invalidation. They only run when MOCK_API=true.
 *
 * See packages/shared/docs/token-exchange-flow.md for architecture details.
 */
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity, msw } from '../fixtures/helpers';

test.describe('Token exchange race condition', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await neutralizeInactivity(page);
  });

  test('happy path — exchange succeeds on 401', async ({ page }) => {
    await msw(page, 'invalidateAllAccessTokens()');

    // SPA-navigate to Users — triggers API call → 401 → exchange → retry → 200
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Users' })
      .click();
    await page
      .getByText('Admin User')
      .waitFor({ state: 'visible', timeout: 15_000 });
    await expect(page).toHaveURL(/users/);
  });

  test('cross-tab rescue — exchange fails but rehydrate picks up fresh tokens', async ({
    page,
  }) => {
    // Invalidate all tokens + plant fresh tokens in localStorage + MSW
    // to simulate another tab having successfully refreshed
    await page.evaluate(() => {
      window.msw!.invalidateAllAccessTokens();
      window.msw!.invalidateAllRefreshTokens();
      window.msw!.simulateCrossTabRefresh();
    });

    // SPA-navigate to Users
    // Flow: 401 → exchange fails → rehydrate → retry with fresh token → 200
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Users' })
      .click();

    await page
      .getByText('Admin User')
      .waitFor({ state: 'visible', timeout: 15_000 });
    await expect(page).toHaveURL(/users/);
  });

  test('truly invalid session — logout when no tab can rescue', async ({
    page,
  }) => {
    await msw(page, 'invalidateAllTokens()');

    // SPA-navigate → 401 → exchange fails → no rescue → logout
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Users' })
      .click();
    await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });
  });
});
