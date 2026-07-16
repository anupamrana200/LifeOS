import dotenv from 'dotenv';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '5000', 10);

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.isNaN(port) ? 5000 : port,
  mongoUri: process.env.MONGODB_URI ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? '',
});

export default env;
