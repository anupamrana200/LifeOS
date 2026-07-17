import multer from 'multer';

import env from '../config/env.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const errorMiddleware = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode =
    error.statusCode ??
    error.status ??
    HTTP_STATUS.INTERNAL_SERVER_ERROR;

  let message = error.message || 'Internal server error';

  /**
   * Mongoose Cast Error
   */
  if (error.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid resource identifier.';
  }

  /**
   * Mongoose Validation Error
   */
  if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation failed.';
  }

  /**
   * Mongo Duplicate Key
   */
  if (error.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'A record with this value already exists.';
  }

  /**
   * Multer Errors
   */
  if (error instanceof multer.MulterError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size exceeds the maximum limit of 10 MB.';
        break;

      case 'LIMIT_FILE_COUNT':
        message = 'Only one document can be uploaded at a time.';
        break;

      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field received.';
        break;

      default:
        message = error.message;
    }
  }

  /**
   * Invalid File Type
   */
  if (
    error.message ===
    'Unsupported file type. Only PDF, images, Word, and Excel documents are allowed.'
  ) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  if (env.nodeEnv !== 'production') {
    console.error(error);
  }

  const response = {
    success: false,
    message:
      env.nodeEnv === 'production' &&
      statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : message,
  };

  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
};

export default errorMiddleware;