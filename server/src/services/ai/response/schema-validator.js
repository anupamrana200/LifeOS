import ValidationError from '../../../errors/ValidationError.js';

const isObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value);

export const validateSchema = ({
  data,
  schema,
}) => {
  if (!isObject(data)) {
    throw new ValidationError(
      'Parsed AI response must be an object.',
    );
  }

  if (!isObject(schema)) {
    throw new ValidationError(
      'Invalid prompt schema.',
    );
  }

  for (const key of Object.keys(schema)) {
    if (!(key in data)) {
      throw new ValidationError(
        `Missing field: ${key}`,
      );
    }
  }

  return data;
};