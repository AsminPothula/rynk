export type CustomSVGIconTypeProps = {
  variant?: 'on' | 'off' | undefined;
  className?: string;
};

export type CustomSVGIconType = ({
  variant,
  className,
}: CustomSVGIconTypeProps) => JSX.Element;

export type FlattenKeys<T> = T extends object
  ? {
      [K in keyof T]-?: `${K & string}${T[K] extends object ? '.' : ''}${FlattenKeys<T[K]>}`;
    }[keyof T]
  : '';

export type HttpClientMinState = {
  authData: { accessToken: string } | null;
  authTokenVersion: number | undefined;
  exchangeOnlyOnce: () => Promise<unknown>;
  logout: () => void;
  rehydrateAuth: () => Promise<void>;
};

export const EnvList = [
  'local',
  'development',
  'qa',
  'staging',
  'production',
] as const;

export interface AuthData {
  id: string;
  accessToken: string;
  refreshToken: string;
  _authTokenVersion: number;
}

export type LanguageType = 'en' | 'de';

export type ApiEndpointUrl = string;

/**
 * User roles for access gating. Defined by hand — the rynk backend's OpenAPI
 * doesn't emit this enum, but the shared role-gating code imports it as a
 * value. Backend roles are actually admin/developer/systemadmin; reconcile later.
 */
export enum UserProfileRole {
  User = 'user',
  Admin = 'admin',
  Guest = 'guest',
}
