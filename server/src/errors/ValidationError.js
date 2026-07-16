import ApiError from './ApiError.js';

class ValidationError extends ApiError {
  constructor(message = 'Validation failed.') {
    super(400, message);
  }
}

export default ValidationError;