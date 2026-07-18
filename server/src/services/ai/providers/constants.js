export const PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
};

export const DEFAULT_PROVIDER =
  process.env.DEFAULT_AI_PROVIDER ||
  PROVIDERS.OPENAI;

export const DEFAULT_OPENAI_MODEL =
  process.env.OPENAI_MODEL ||
  'gpt-5-mini';

export const DEFAULT_GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  'gemini-2.5-flash';