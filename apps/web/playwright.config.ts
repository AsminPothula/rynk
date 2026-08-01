import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: '.env.e2e' });

const USER_PORT = process.env.USER_PORTAL_DEV_PORT || '3021';
const ADMIN_PORT = process.env.ADMIN_PORTAL_DEV_PORT || '3022';
const INACTIVITY_PORT = process.env.E2E_INACTIVITY_DEV_PORT || '3023';
const WITH_INACTIVITY = process.env.E2E_INACTIVITY_ENABLED === 'true';

export default defineConfig({
  testDir: './e2e',
  testIgnore: WITH_INACTIVITY ? undefined : /inactivity/,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 1,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'user-portal',
      testIgnore: /inactivity/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${USER_PORT}`,
      },
    },
    {
      name: 'admin-portal',
      testIgnore: /inactivity/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${ADMIN_PORT}`,
      },
    },
    ...(WITH_INACTIVITY
      ? [
          {
            name: 'user-portal-inactivity',
            testMatch: /inactivity\/.+\.spec\.ts/,
            use: {
              ...devices['Desktop Chrome'],
              baseURL: `http://localhost:${INACTIVITY_PORT}`,
            },
          },
        ]
      : []),
  ],
  webServer: [
    {
      command:
        'VITE__USER_PORTAL__MOCK_API=true VITE__USER_PORTAL__INACTIVITY_ENABLED=false npm run user:dev',
      url: `http://localhost:${USER_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command:
        'VITE__ADMIN_PORTAL__MOCK_API=true VITE__ADMIN_PORTAL__INACTIVITY_ENABLED=false npm run admin:dev',
      url: `http://localhost:${ADMIN_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    ...(WITH_INACTIVITY
      ? [
          {
            command: [
              'VITE__USER_PORTAL__MOCK_API=true',
              'VITE__USER_PORTAL__INACTIVITY_ENABLED=true',
              'VITE__USER_PORTAL__INACTIVITY_TIMEOUT_SECONDS=6',
              'VITE__USER_PORTAL__INACTIVITY_WARNING_SECONDS=4',
              `USER_PORTAL_DEV_PORT=${INACTIVITY_PORT}`,
              'npm run user:dev',
            ].join(' '),
            url: `http://localhost:${INACTIVITY_PORT}`,
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
          },
        ]
      : []),
  ],
});
