import ValidationError from '../../errors/ValidationError.js';

export const validateTextResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new ValidationError('Invalid AI response.');
  }

  if (typeof response.text !== 'string') {
    throw new ValidationError('AI response must contain text.');
  }

  const trimmed = response.text.trim();

  if (!trimmed) {
    throw new ValidationError('AI response is empty.');
  }

  return trimmed;
};

export const validateJsonResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new ValidationError('Invalid AI response.');
  }

  if (typeof response.text !== 'string') {
    throw new ValidationError('AI response must contain text.');
  }

  try {
    return JSON.parse(response.text);
  } catch {
    throw new ValidationError('AI returned invalid JSON.');
  }
};