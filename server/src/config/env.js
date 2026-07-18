import dotenv from 'dotenv';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '5000', 10);

const env = Object.freeze({
    // AI
  openAiApiKey: process.env.OPENAI_API_KEY?.trim(),
  openAiModel: process.env.OPENAI_MODEL ?? 'gpt-5-mini',

  geminiApiKey: process.env.GEMINI_API_KEY?.trim(),
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',

  defaultAiProvider:
    process.env.DEFAULT_AI_PROVIDER ?? 'openai',

  // Pinecone
  pineconeApiKey: process.env.PINECONE_API_KEY?.trim(),
  pineconeIndexName:
    process.env.PINECONE_INDEX_NAME?.trim(),

  // OCR
  ocrConcurrency:
    Number.parseInt(process.env.OCR_CONCURRENCY ?? '4', 10),

  ocrLanguage:
    process.env.OCR_LANGUAGE ?? 'eng',

  pdfRenderDpi:
    Number.parseInt(process.env.PDF_RENDER_DPI ?? '300', 10),

  ocrImageDensity:
    Number.parseInt(process.env.OCR_IMAGE_DENSITY ?? '300', 10),

  aiMaxDocumentCharacters:
    Number.parseInt(
      process.env.AI_MAX_DOCUMENT_CHARACTERS ?? '20000',
      10
    ),

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

  fileEncryptionKey: process.env.FILE_ENCRYPTION_KEY ?? '',

  documentStorageDir: process.env.DOCUMENT_STORAGE_DIR?.trim() ?? 'src/uploads/encrypted',
});

export default env;