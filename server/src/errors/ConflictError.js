import ApiError from './ApiError.js';

class ConflictError extends ApiError {
  constructor(message = 'Resource already exists.') {
    super(409, message);
  }
}

export default ConflictError;