// EnvList must be defined locally (not re-exported from shared) because
// config/env.ts is loaded during Vite config resolution, which runs in
// Node's native ESM loader and cannot resolve .ts package entry points.
export const EnvList = [
  'local',
  'development',
  'qa',
  'staging',
  'production',
] as const;

export type { AuthData, LanguageType, ApiEndpointUrl } from 'shared';
