import { registerAs } from '@nestjs/config';

export default registerAs('secret', () => ({
  env: process.env.NODE_ENV,
  server: {
    logLevel: process.env.LOG_LEVEL || 'debug',
    corsDomain:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_DOMAIN]
        : ['http://localhost', process.env.FRONTEND_DOMAIN],
    port: process.env.WEB_PORT || 3000,
  },
  db: {
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    maxConnection: parseInt(process.env.DB_MAX_CONNECTION, 10),
  },
  mail: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT, 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    enableTLS: process.env.SMTP_ENABLE_TLS !== 'false',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    forgotPWSecret: process.env.FORGOT_PW_JWT_SECRET,
  },
  aws: {
    region: process.env.AWS_REGION,
    s3: {
      s3bucket: process.env.AWS_S3_BUCKET,
      rootPath: process.env.AWS_S3_BUCKET_ROOT_PATH,
    }
  }
}));
