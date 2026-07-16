import { body } from 'express-validator';

export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Full name is required.')
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters.')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain at least one special character.'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address.'),

  body('password').notEmpty().withMessage('Password is required.'),
];
