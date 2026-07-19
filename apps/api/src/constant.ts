import { randomUUID } from 'crypto';

export const METADATA = Object.freeze({
  IS_PUBLIC_KEY: 'isPublic',
  PERMISSION: 'permission',
  DEV_API_PERMISSION: 'devApiPermission',
  STATUS: 'status',
  ROLE: 'role',
});

export const REGEX = Object.freeze({
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,15}$/,
  COLOR: /^[A-Fa-f0-9]{6}$/,
  COLOR_CODE: /^#[0-9A-Fa-f]{6}$/,
  ROUTING_NUMBER: /^\d{9}$/,
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PHONE: /^\d{10}$/,
});

export const assetsLocation = '3d-assets';

export const SAMPLE_EMAIL = 'Myemail@domain.com';

export const SAMPLE_PHONE = '9898989898';

export const SAMPLE_NAME = 'Jane Doe';

export const SAMPLE_FIRST_NAME = 'Jane';

export const SAMPLE_LAST_NAME = 'Doe';

export const SAMPLE_INT = 13;

export const SAMPLE_DECIMAL = 12.34;

export const SAMPLE_NUMBER_STRING = '12.34';

export const SAMPLE_PASSWORD = 'Mypassword123';

export const SAMPLE_DESCRIPTION = 'This is a description message';

export const SAMPLE_ACCOUNT_NAME = 'Acme';

export const SAMPLE_UUID = randomUUID();

export const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJBY3RpdmUiLCJwcm9ncmFtSWQiOm51bGwsInBlcm1pc3Npb25MaXN0IjpbIlBDIiwiUEYiLCJQUCIsIlBTIiwiU0EiLCJTTyIsIlNEIiwiU1IiLCJTUCJdLCJzdWIiOiI2NzU0MTFGOC1DOTMxLTRGMDQtQTZCQS02OUE2NTY1Nzk0OEUiLCJpYXQiOjE2NzA2OTE3NTEsImV4cCI6MTY3MDY5ODk1MX0.4zRehlOD615AtNuQSZiuvEUm5psXP5bY9IbtXyC5nKk';

export const SAMPLE_CODE_VERIFIER = '3e52c3e5-b627-4915-8fb3-abdcf9f5a8f0';

export const FILE_FIELD_NAME = 'file';

export const FILES_FIELD_NAME = 'files';

export const SAMPLE_ROLE = 'admin';

export const SAMPLE_GUEST_ROLE = 'Coach';

export const SAMPLE_BOOL = true;

export const DEFAULT_TEMPLATE_FIT_PRICING_COLUMN = 'purpleLabel';

export const SAMPLE_API_KEY =
  'fb85bebbc42220fd66e8b806503d60ad88ef8dbdb9789c07fd1b6c119dc4d0cf';
