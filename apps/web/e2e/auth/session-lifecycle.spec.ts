/**
 * Auth Session Lifecycle — E2E Tests
 *
 * Edge cases around login, logout, and token lifecycle that go beyond
 * the basic flows in sign-in/sign-out specs.
 *
 * MSW-dependent tests are marked individually.
 */
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { neutralizeInactivity, msw } from '../fixtures/helpers';

test.describe('Session lifecycle', () => {
  test.describe('Logout edge cases', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
      await neutralizeInactivity(page);
    });

    test('cancel logout dialog keeps user on page', async ({ page }) => {
      await page.getByRole('link', { name: 'Settings' }).first().click();
      await expect(page).toHaveURL(/settings/);

      await page.getByRole('button', { name: 'Logout' }).click();
      await page.getByRole('alertdialog').waitFor({ state: 'visible' });

      // Cancel the dialog
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: 'Cancel' })
        .click();

      // Should remain on settings
      await expect(page).toHaveURL(/settings/);

      // Should still be authenticated
      const authData = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData : null;
      });
      expect(authData).toBeTruthy();
    });

    test('logout clears sidebar preference from localStorage', async ({
      page,
    }) => {
      // Set a sidebar preference first
      await page.evaluate(() => {
        localStorage.setItem(
          'app:prefer-sidebar-open',
          JSON.stringify({ state: { preferSidebarOpen: true }, version: 0 }),
        );
      });

      // Verify it's set
      const before = await page.evaluate(() =>
        localStorage.getItem('app:prefer-sidebar-open'),
      );
      expect(before).toBeTruthy();

      // Logout
      await page.getByRole('link', { name: 'Settings' }).first().click();
      await page.getByRole('button', { name: 'Logout' }).click();
      await page.getByRole('alertdialog').waitFor({ state: 'visible' });
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: 'Logout' })
        .click();
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });

      // Sidebar preference should be reset to false (removeSidebarPreference sets it to false)
      const after = await page.evaluate(() => {
        const raw = localStorage.getItem('app:prefer-sidebar-open');
        return raw ? JSON.parse(raw).state.preferSidebarOpen : false;
      });
      expect(after).toBe(false);
    });

    test('logout clears inactivity state from localStorage', async ({
      page,
    }) => {
      // Stamp some inactivity state
      await page.evaluate(() => {
        localStorage.setItem(
          'app:inactivity',
          JSON.stringify({
            state: { lastActiveAt: Date.now() },
            version: 0,
          }),
        );
      });

      // Logout
      await page.getByRole('link', { name: 'Settings' }).first().click();
      await page.getByRole('button', { name: 'Logout' }).click();
      await page.getByRole('alertdialog').waitFor({ state: 'visible' });
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: 'Logout' })
        .click();
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });

      // Stop the keepalive interval before checking, otherwise it re-stamps lastActiveAt
      await page.evaluate(() => {
        if (window.__keepAlive) clearInterval(window.__keepAlive);
      });

      // Inactivity state should be cleared
      const after = await page.evaluate(() => {
        const raw = localStorage.getItem('app:inactivity');
        return raw ? JSON.parse(raw).state.lastActiveAt : 'missing';
      });
      expect(after === null || after === 'missing').toBeTruthy();
    });
  });

  test.describe('Re-login after logout', () => {
    test('can log in again after logging out', async ({ page }) => {
      await login(page);
      await neutralizeInactivity(page);

      // Logout
      await page.getByRole('link', { name: 'Settings' }).first().click();
      await page.getByRole('button', { name: 'Logout' }).click();
      await page.getByRole('alertdialog').waitFor({ state: 'visible' });
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: 'Logout' })
        .click();
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });

      // Log in again
      await login(page);

      // Should have fresh auth data
      const authData = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData : null;
      });
      expect(authData).toBeTruthy();
      expect(authData.accessToken).toBeTruthy();
      expect(authData._authTokenVersion).toBe(0);
    });
  });

  test.describe('Token exchange edge cases (MSW-dependent)', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
      await neutralizeInactivity(page);
    });

    test('concurrent API calls with expired token only trigger one exchange', async ({
      page,
    }) => {
      // Invalidate access token so next API calls get 401
      await msw(page, 'invalidateAllAccessTokens()');

      // Trigger multiple concurrent API calls by rapid navigation
      // Navigate to Users (triggers user list fetch)
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();

      // Should recover — exchange happens once, all calls retry
      await page
        .getByText('Admin User')
        .waitFor({ state: 'visible', timeout: 15_000 });
      await expect(page).toHaveURL(/users/);

      // Token version should have incremented exactly once
      const authData = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData : null;
      });
      expect(authData?._authTokenVersion).toBe(1);
    });

    test('token auto-expiry via MSW triggers exchange transparently', async ({
      page,
    }) => {
      // Set access token to expire in 1 second
      await msw(page, 'setAccessTokenExpiry(1000)');

      // Wait for expiry
      await page.waitForTimeout(1_500);

      // Navigate — should trigger 401 → exchange → retry → success
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();
      await page
        .getByText('Admin User')
        .waitFor({ state: 'visible', timeout: 15_000 });
      await expect(page).toHaveURL(/users/);

      // Clean up
      await msw(page, 'resetTokenExpiry()');
    });

    test('refresh token time-based expiry triggers logout', async ({
      page,
    }) => {
      // Set a short refresh token expiry for newly issued tokens.
      // Keep access token expiry long so background fetches don't 401 during wait.
      await msw(page, 'setRefreshTokenExpiry(2000)');

      // Force a token exchange so a new refresh token is issued with 2s expiry
      await msw(page, 'invalidateAllAccessTokens()');
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();
      await page
        .getByText('Admin User')
        .waitFor({ state: 'visible', timeout: 15_000 });

      // Wait for the refresh token to expire (access token still valid)
      await page.waitForTimeout(3_000);

      // Now invalidate access tokens — forces a 401 → exchange needed,
      // but the refresh token has expired → exchange fails → logout
      await msw(page, 'invalidateAllAccessTokens()');
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Dashboard' })
        .click();
      await expect(page).toHaveURL(/sign-in|landing/, { timeout: 10_000 });

      await msw(page, 'resetTokenExpiry()');
    });

    test('post-exchange navigation works without re-exchanging', async ({
      page,
    }) => {
      // Force one exchange
      await msw(page, 'invalidateAllAccessTokens()');

      // Navigate to Users — triggers exchange
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();
      await page
        .getByText('Admin User')
        .waitFor({ state: 'visible', timeout: 15_000 });

      const versionAfterExchange = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData?._authTokenVersion : null;
      });
      expect(versionAfterExchange).toBe(1);

      // Navigate to Dashboard — should use the refreshed token without another exchange
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Dashboard' })
        .click();
      await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });

      // Navigate to Settings — still no new exchange needed
      await page.getByRole('link', { name: 'Settings' }).first().click();
      await expect(page).toHaveURL(/settings/, { timeout: 10_000 });

      // Token version should not have changed
      const versionAfterNav = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData?._authTokenVersion : null;
      });
      expect(versionAfterNav).toBe(1);
    });

    test('app survives multiple token exchanges in one session', async ({
      page,
    }) => {
      // Cycle 1: invalidate → navigate → should recover
      await msw(page, 'invalidateAllAccessTokens()');
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();
      await page
        .getByText('Admin User')
        .waitFor({ state: 'visible', timeout: 15_000 });
      await expect(page).toHaveURL(/users/);
      await page.waitForTimeout(2_000);

      // Cycle 2: invalidate again → navigate → should recover again
      await msw(page, 'invalidateAllAccessTokens()');
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Dashboard' })
        .click();
      await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
      await page.waitForTimeout(2_000);

      // Cycle 3: one more round
      await msw(page, 'invalidateAllAccessTokens()');
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();
      await page
        .getByText('Admin User')
        .waitFor({ state: 'visible', timeout: 15_000 });

      // Still authenticated after 3 exchange cycles
      const authData = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData : null;
      });
      expect(authData).toBeTruthy();
      expect(authData.accessToken).toBeTruthy();
    });

    test('rapid navigation during in-flight exchange does not break app', async ({
      page,
    }) => {
      await msw(page, 'invalidateAllAccessTokens()');

      // Click Users (triggers 401 → exchange)
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Users' })
        .click();

      // Immediately click Dashboard before exchange completes
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Dashboard' })
        .click();

      // App should eventually settle — not crash or infinite loop
      // Could land on either page depending on timing
      await page.waitForTimeout(5_000);
      await expect(page).toHaveURL(/dashboard|users/, { timeout: 10_000 });

      // Should still be authenticated
      const authData = await page.evaluate(() => {
        const raw = localStorage.getItem('app:auth');
        return raw ? JSON.parse(raw).state.authData : null;
      });
      expect(authData).toBeTruthy();
    });
  });
});
