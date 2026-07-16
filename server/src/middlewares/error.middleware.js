import env from '../config/env.js';

const errorMiddleware = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode ?? error.status ?? 500;
  let message = error.message || 'Internal server error';

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier.';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists.';
  }

  if (env.nodeEnv !== 'production') {
    console.error(error);
  }

  const response = {
    success: false,
    message:
      env.nodeEnv === 'production' && statusCode >= 500
        ? 'Internal server error'
        : message,
  };

  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
};

export default errorMiddleware;