import env from './env.js';

const requiredEnvVariables = {
  MONGODB_URI: env.mongoUri,
  JWT_ACCESS_SECRET: env.jwtAccessSecret,
  JWT_REFRESH_SECRET: env.jwtRefreshSecret,
  DATA_ENCRYPTION_KEY: env.dataEncryptionKey,
  OPENAI_API_KEY: env.openAiApiKey,
  PINECONE_API_KEY: env.pineconeApiKey,
  PINECONE_INDEX_NAME: env.pineconeIndexName,
};

const validateEnv = () => {
  for (const [key, value] of Object.entries(requiredEnvVariables)) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  if (
    env.defaultAiProvider === 'gemini' &&
    (!env.geminiApiKey || env.geminiApiKey.trim() === '')
  ) {
    throw new Error(
      'GEMINI_API_KEY is required when DEFAULT_AI_PROVIDER is "gemini".'
    );
  }
};

export default validateEnv;
