import { parseResponse } from './response-parser.js';
import { validateSchema } from './schema-validator.js';
import { normalizeResponse } from './normalizer.js';

export const processResponse = ({
  response,
  schema,
}) => {
  const parsed = parseResponse(response);

  const validated =
    validateSchema({
      data: parsed,
      schema,
    });

  return normalizeResponse(validated);
};