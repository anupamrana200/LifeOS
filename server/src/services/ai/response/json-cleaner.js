const CODE_BLOCK_REGEX = /^```(?:json)?\s*|\s*```$/gi;

export const cleanJson = (text = '') => {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replace(CODE_BLOCK_REGEX, '')
    .trim();
};