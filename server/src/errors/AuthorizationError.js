import ApiError from './ApiError.js';

class AuthorizationError extends ApiError {
  constructor(message = 'Access denied.') {
    super(403, message);
  }
}

export default AuthorizationError;