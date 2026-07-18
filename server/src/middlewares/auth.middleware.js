import AuthenticationError from '../errors/AuthenticationError.js';
import AuthorizationError from '../errors/AuthorizationError.js';
import User from '../models/User.js';
import { verifyAccessToken } from '../services/jwt.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const bearerToken =
  req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const accessToken =
    req.cookies?.accessToken || bearerToken;

  // const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw new AuthenticationError('Authentication token is required.');
  }

  let payload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch (_error) {
    throw new AuthenticationError('Invalid or expired access token.');
  }

  const user = await User.findById(payload.userId).select('-password');

  if (!user) {
    throw new AuthenticationError('Authentication failed.');
  }

  if (user.accountStatus !== 'active') {
    throw new AuthorizationError('This account is not active.');
  }

  req.user = user;
  next();
});
