// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const Config = {
  Server: {
    Port: parseInt(process.env.PORT as string),
    AdminPortal: process.env.ADMIN_PORTAL_URL as string,
    EditorPortal: process.env.EDITOR_PORTAL_URL as string,
    AppName: process.env.APP_NAME as string,
    IsLocalEnv: process.env.NODE_ENV === 'local',
    IsDevEnv: process.env.NODE_ENV === 'development',
    IsQaEnv: process.env.NODE_ENV === 'qa',
    IsStagingEnv: process.env.NODE_ENV === 'staging',
    IsProductionEnv: process.env.NODE_ENV === 'production',
    Env: process.env.NODE_ENV as string,
    Endpoint: process.env.BACKEND_ENDPOINT as string,
  },
  Database: {
    Type: process.env.DATABASE_TYPE as string,
    Host: process.env.DATABASE_HOST as string,
    Port: parseInt(process.env.DATABASE_PORT as string),
    Username: process.env.DATABASE_USERNAME as string,
    Password: process.env.DATABASE_PASSWORD as string,
    Name: process.env.DATABASE_NAME as string,
  },
  Auth: {
    JwtSecret: process.env.JWT_TOKEN_SECRET as string,
    PasswordSaltRound: parseInt(process.env.PASSWORD_SALT_ROUND as string),
    AccessTokenExpireDurationInHour: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRE_DURATION_IN_HOUR as string,
    ),
    RefreshTokenExpireDurationInHour: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXPIRE_DURATION_IN_HOUR as string,
    ),
    PasswordTokenExpireDurationInMinute: parseInt(
      process.env.JWT_PASSWORD_TOKEN_EXPIRE_DURATION_IN_MINUTE as string,
    ),
    OldPasswordCountThreshold:
      parseInt(process.env.OLD_PASSWORD_COUNT_THRESHOLD as string) || 1,

    EmailVerificationTokenExpireDurationInHour:
      parseInt(
        process.env.EMAIL_VERIFICATION_TOKEN_EXPIRE_DURATION_IN_HOUR as string,
      ) || 48,
    ResendEmailVerificationTokenDelayInMinutes:
      parseInt(
        process.env.RESEND_EMAIL_VERIFICATION_TOKEN_DELAY_IN_MINUTES as string,
      ) || 2,
  },
  Cache: {
    RedisHost: process.env.REDIS_HOST as string,
    RedisPort: parseInt(process.env.REDIS_PORT as string),
    DefaultCacheDuration: parseInt(
      process.env.DEFAULT_CACHE_DURATION_IN_SECOND as string,
    ),
  },
  AWSConfig: {
    CFBaseUrl: process.env.AWS_CF_BASE_URL || '',
    CFPrivateKey: process.env.AWS_CF_PRIVATE_KEY || '',
    CFPublicKey: process.env.AWS_CF_PUBLIC_KEY_ID || '',
    maxExpiryMs: +(process.env.AWS_CF_MAX_EXPIRY_MS || 60 * 60 * 1000), // in ms 60min?
    cacheLinkIntervalMins: +(process.env.AWS_CF_CACHE_LINK_INTERVAL_MINS || 15), //min; Set to 0 to get a new link every time, or set to mins to repeat same link in that time interval
    BucketName: process.env.AWS_S3_BUCKET_NAME || '',
    Region: process.env.AWS_S3_REGION || '',
    Path: process.env.AWS_S3_PATH || 'unsorted',
    Profile: process.env.AWS_PROFILE || undefined,
  },
  Email: {
    ApiKey: process.env.MAILGUN_API_KEY as string,
    DomainName: process.env.MAILGUN_DOMAIN_NAME as string,
    SystemEmail: process.env.SYSTEM_EMAIL as string,
  },
  DevApi: {
    DevApiKeySecret: process.env.DEV_API_KEY_SECRET as string,
    DevApiKeyHeaderName: 'x-tagger-server-key',
  },
} as const;
