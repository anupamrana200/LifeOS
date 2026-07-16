import ApiError from './ApiError.js';

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed.') {
    super(401, message);
  }
}

export default AuthenticationError;