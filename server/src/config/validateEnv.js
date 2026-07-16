import env from './env.js';

const requiredEnvVariables = {
  MONGODB_URI: env.mongoUri,
  JWT_ACCESS_SECRET: env.jwtAccessSecret,
  JWT_REFRESH_SECRET: env.jwtRefreshSecret,
};

const validateEnv = () => {
  for (const [key, value] of Object.entries(requiredEnvVariables)) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};

export default validateEnv;