import ValidationError from '../../../errors/ValidationError.js';
import { cleanJson } from './json-cleaner.js';

export const parseResponse = (response) => {
  if (!response || typeof response.text !== 'string') {
    throw new ValidationError(
      'Invalid AI response.',
    );
  }

  const cleaned = cleanJson(response.text);

  if (!cleaned) {
    throw new ValidationError(
      'AI returned an empty response.',
    );
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new ValidationError(
      'AI returned invalid JSON.',
    );
  }
};