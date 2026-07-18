export const MAX_DOCUMENT_CHARACTERS =
  Number(process.env.AI_MAX_DOCUMENT_CHARACTERS) || 20000;

export const DEFAULT_DOCUMENT_TYPE = 'generic';

export const SUPPORTED_DOCUMENT_TYPES = [
  'generic',
  'invoice',
  'receipt',
  'identity',
  'bank',
];

export const PROMPT_VERSION = '1.0.0';

export const RESPONSE_FORMAT = 'json';

export const SYSTEM_PROMPT = `
You are an expert document understanding assistant.

Your job is to extract structured information from documents.

Rules:

1. Never hallucinate values.
2. If a field is missing, return null.
3. Return ONLY valid JSON.
4. Do not include markdown.
5. Do not explain your reasoning.
6. Preserve original formatting whenever possible.
7. Dates should remain exactly as written unless instructed otherwise.
8. Currency symbols should be preserved.
`.trim();
