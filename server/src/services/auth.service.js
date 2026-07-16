import User from '../models/User.js';
import AuthenticationError from '../errors/AuthenticationError.js';
import AuthorizationError from '../errors/AuthorizationError.js';
import ConflictError from '../errors/ConflictError.js';
import { generateAccessToken, generateRefreshToken } from './jwt.service.js';
import { createSession } from './session.service.js';

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const register = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ConflictError('An account with this email already exists.');
  }

  try {
    return await User.create({ fullName, email, password });
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError('An account with this email already exists.');
    }

    throw error;
  }
};

export const login = async (credentials, requestInfo) => {
  const user = await User.findOne({ email: credentials.email }).select('+password');

  if (!user) {
    throw new AuthenticationError('Invalid email or password.');
  }

  const isPasswordValid = await user.comparePassword(credentials.password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password.');
  }

  if (user.accountStatus !== 'active') {
    throw new AuthorizationError('This account is not active.');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await createSession({
    userId: user._id,
    refreshToken,
    ipAddress: requestInfo?.ipAddress,
    userAgent: requestInfo?.userAgent,
    browser: requestInfo?.browser,
    operatingSystem: requestInfo?.operatingSystem,
    deviceName: requestInfo?.deviceName,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
  });

  user.lastLogin = new Date();
  await user.save();

  user.password = undefined;

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};
