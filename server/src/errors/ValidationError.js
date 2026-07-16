import ApiError from './ApiError.js';

class ValidationError extends ApiError {
  constructor(message = 'Validation failed.', details = []) {
    super(400, message);

    this.details = details;
  }
}

export default ValidationError;