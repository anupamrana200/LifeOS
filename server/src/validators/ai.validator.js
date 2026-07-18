import { body } from 'express-validator';

export const processDocumentValidator = [
  body('task')
    .optional()
    .isIn([
      'summary',
      'extract',
    ])
    .withMessage('Unsupported AI task.'),

  body('documentType')
    .optional()
    .isIn([
      'generic',
      'invoice',
      'receipt',
      'identity',
      'bank',
    ])
    .withMessage('Unsupported document type.'),

  body('modelProvider')
    .trim()
    .notEmpty()
    .withMessage('Model provider is required.')
    .isIn([
      'gemini',
      'openai',
    ])
    .withMessage('Unsupported model provider.'),

  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required.'),

  body('password')
    .optional()
    .isString()
    .withMessage('Password must be a string.'),
];