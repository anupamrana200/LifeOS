import dotenv from 'dotenv';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '5000', 10);

const env = Object.freeze({
  // Application
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.isNaN(port) ? 5000 : port,

  // Database
  mongoUri: process.env.MONGODB_URI?.trim(),

  // CORS
  corsOrigin: process.env.CORS_ORIGIN ?? '',

  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET?.trim(),
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET?.trim(),

  // JWT Configuration
  jwtIssuer: 'LifeOS',
  jwtAudience: 'LifeOS-Client',

  cookieSameSite: process.env.COOKIE_SAME_SITE ?? 'lax',
});

export default env;