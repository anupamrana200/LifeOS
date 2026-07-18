import {
  DEFAULT_DOCUMENT_TYPE,
  MAX_DOCUMENT_CHARACTERS,
  SYSTEM_PROMPT,
} from './constants.js';

const sanitizeText = (text = '') =>
  text
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, MAX_DOCUMENT_CHARACTERS);

export const buildPrompt = ({
  documentType = DEFAULT_DOCUMENT_TYPE,
  instructions = '',
  schema,
  text,
}) => {
  if (!schema) {
    throw new Error(
      'Prompt schema is required.'
    );
  }

  const cleanedText = sanitizeText(text);

  return {
    system: SYSTEM_PROMPT,

    user: `
Document Type:
${documentType}

Instructions:
${instructions || 'Extract all relevant information.'}

Expected JSON Schema:
${JSON.stringify(schema, null, 2)}

Document Content:
"""
${cleanedText}
"""

Return ONLY valid JSON.
`.trim(),
  };
};
