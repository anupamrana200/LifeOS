import { validationResult } from 'express-validator';

import ValidationError from '../errors/ValidationError.js';

const validateMiddleware = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ValidationError(
        'Validation failed.',
        errors.array(),
      ),
    );
  }

  next();
};

export default validateMiddleware;