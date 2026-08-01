import { EnvList } from '../type'; // do not use alias here. required in vite.config manually
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE__ADMIN_PORTAL__',

  client: {
    VITE__ADMIN_PORTAL__APP_ENV: z.enum(EnvList),
    VITE__ADMIN_PORTAL__API_ENDPOINT: z.string().url(),
    VITE__ADMIN_PORTAL__REACT_QUERY_DEBUGGING: z
      .string() // only allow "true" or "false"
      .refine((s) => s === 'true' || s === 'false')
      // // transform to boolean
      .transform((s) => s === 'true'),
    VITE__ADMIN_PORTAL__MOCK_API: z
      .string()
      .optional()
      .default('false')
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true'),
    VITE__ADMIN_PORTAL__PUBLIC_URL: z.string().url().optional(),
    VITE__ADMIN_PORTAL__STORE_DEVTOOLS: z
      .string()
      .optional()
      .default('false')
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true'),
    VITE__ADMIN_PORTAL__INACTIVITY_TIMEOUT_SECONDS: z
      .string()
      .optional()
      .default('1800')
      .transform(Number),
    VITE__ADMIN_PORTAL__INACTIVITY_WARNING_SECONDS: z
      .string()
      .optional()
      .default('900')
      .transform(Number),
    VITE__ADMIN_PORTAL__INACTIVITY_ENABLED: z
      .string()
      .optional()
      .default('false')
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true'),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});

export const envName = env.VITE__ADMIN_PORTAL__APP_ENV;
export const apiEndpoint = env.VITE__ADMIN_PORTAL__API_ENDPOINT;
export const reactQueryDebugging =
  env.VITE__ADMIN_PORTAL__REACT_QUERY_DEBUGGING;
export const mockApiEnabled = env.VITE__ADMIN_PORTAL__MOCK_API;
export const storeDevtools = env.VITE__ADMIN_PORTAL__STORE_DEVTOOLS;
export const inactivityTimeoutMs =
  env.VITE__ADMIN_PORTAL__INACTIVITY_TIMEOUT_SECONDS * 1000;
export const inactivityWarningMs =
  env.VITE__ADMIN_PORTAL__INACTIVITY_WARNING_SECONDS * 1000;
export const inactivityEnabled = env.VITE__ADMIN_PORTAL__INACTIVITY_ENABLED;
