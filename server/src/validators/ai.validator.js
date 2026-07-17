import { body } from 'express-validator';

export const generateSummaryValidator = [
  body('modelProvider')
    .trim()
    .notEmpty()
    .withMessage('Model provider is required.')
    .isIn(['gemini', 'openai'])
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