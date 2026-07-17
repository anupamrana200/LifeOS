import { body } from 'express-validator';
import { DOCUMENT_CATEGORIES } from '../constants/document.constants.js';

export const uploadDocumentValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Document title is required.')
    .bail()
    .isLength({ min: 2, max: 200 })
    .withMessage('Document title must be between 2 and 200 characters.'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Document category is required.')
    .bail()
    .isIn(DOCUMENT_CATEGORIES)
    .withMessage('Invalid document category.'),

  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters.'),

  body('expiryDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO-8601 date.')
    .toDate(),

  body('tags')
    .optional({ values: 'falsy' })
    .customSanitizer((value) => {
      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === 'string') {
        return value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      return [];
    })
    .isArray()
    .withMessage('Tags must be an array.'),
];

export const updateDocumentValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Document title is required.')
    .bail()
    .isLength({ min: 2, max: 200 })
    .withMessage('Document title must be between 2 and 200 characters.'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Document category is required.')
    .bail()
    .isIn(DOCUMENT_CATEGORIES)
    .withMessage('Invalid document category.'),

  body('description')
    .optional()
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters.'),

  body('expiryDate')
    .optional()
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO-8601 date.')
    .toDate(),

  body('tags')
    .optional({ values: 'falsy' })
    .customSanitizer((value) => {
      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === 'string') {
        return value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      return [];
    })
    .isArray()
    .withMessage('Tags must be an array.'),
];