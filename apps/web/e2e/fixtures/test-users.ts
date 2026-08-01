/**
 * E2E test users — portal-specific, role-based.
 *
 * Env vars are loaded from `.env.e2e` by playwright.config.ts via dotenv.
 * Defaults match the MSW mock user so tests work out of the box.
 * Override in `.env.e2e` when running against a real backend.
 *
 * To add a new role: add env vars to `.env.e2e.template`, extend TestRole,
 * add entries to USERS, and update MSW handlers to accept the new credentials.
 */

export interface TestUser {
  email: string;
  password: string;
}

export type TestRole = 'admin' | 'user';

const DEFAULT_EMAIL = 'admin@test.com';
const DEFAULT_PASSWORD = 'password123';

const USERS: Record<string, Record<TestRole, TestUser>> = {
  'user-portal': {
    admin: {
      email: process.env.E2E__USER_PORTAL__ADMIN_EMAIL || DEFAULT_EMAIL,
      password:
        process.env.E2E__USER_PORTAL__ADMIN_PASSWORD || DEFAULT_PASSWORD,
    },
    user: {
      email: process.env.E2E__USER_PORTAL__USER_EMAIL || DEFAULT_EMAIL,
      password: process.env.E2E__USER_PORTAL__USER_PASSWORD || DEFAULT_PASSWORD,
    },
  },
  'admin-portal': {
    admin: {
      email: process.env.E2E__ADMIN_PORTAL__ADMIN_EMAIL || DEFAULT_EMAIL,
      password:
        process.env.E2E__ADMIN_PORTAL__ADMIN_PASSWORD || DEFAULT_PASSWORD,
    },
    user: {
      email: process.env.E2E__ADMIN_PORTAL__USER_EMAIL || DEFAULT_EMAIL,
      password:
        process.env.E2E__ADMIN_PORTAL__USER_PASSWORD || DEFAULT_PASSWORD,
    },
  },
};

/**
 * Get test user credentials for a given project and role.
 * Unknown projects (e.g. `user-portal-inactivity`) fall back to user-portal.
 */
export function getTestUser(
  project: string,
  role: TestRole = 'admin',
): TestUser {
  const portal = USERS[project] ?? USERS['user-portal'];
  return portal[role];
}
