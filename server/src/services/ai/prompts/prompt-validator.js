import {
  DEFAULT_DOCUMENT_TYPE,
  SUPPORTED_DOCUMENT_TYPES,
} from './constants.js';

export const validatePrompt = ({
  documentType = DEFAULT_DOCUMENT_TYPE,
  schema,
  text,
}) => {
  if (!SUPPORTED_DOCUMENT_TYPES.includes(documentType)) {
    throw new Error(
      `Unsupported document type: ${documentType}`
    );
  }

  if (!schema || typeof schema !== 'object') {
    throw new Error(
      'A valid schema object is required.'
    );
  }

  if (typeof text !== 'string') {
    throw new Error(
      'Document text must be a string.'
    );
  }

  if (!text.trim()) {
    throw new Error(
      'Document text cannot be empty.'
    );
  }

  return true;
};
