import User from '../models/User.js';
import AuthenticationError from '../errors/AuthenticationError.js';
import AuthorizationError from '../errors/AuthorizationError.js';
import ConflictError from '../errors/ConflictError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './jwt.service.js';
import {
  createSession,
  findSessionByRefreshToken,
  revokeSession,
  revokeAllSessions,
} from './session.service.js';

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

export const refresh = async (refreshToken, requestInfo) => {
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token is required.');
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_error) {
    throw new AuthenticationError('Invalid or expired refresh token.');
  }

  const session = await findSessionByRefreshToken(refreshToken);

  if (!session) {
    throw new AuthenticationError('Invalid or expired refresh token.');
  }

  if (session.isRevoked) {
    throw new AuthenticationError('Refresh token session has been revoked.');
  }

  const now = new Date();

  if (!session.expiresAt || session.expiresAt <= now) {
    throw new AuthenticationError('Refresh token session has expired.');
  }

  if (session.user.toString() !== payload.userId) {
    throw new AuthenticationError('Invalid refresh token session.');
  }

  const user = await User.findById(payload.userId).select('-password');;

  if (!user) {
    throw new AuthenticationError('Authentication failed.');
  }

  if (user.accountStatus !== 'active') {
    throw new AuthorizationError('This account is not active.');
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await revokeSession(session._id);
  await createSession({
    userId: user._id,
    refreshToken: newRefreshToken,
    ipAddress: requestInfo?.ipAddress,
    userAgent: requestInfo?.userAgent,
    browser: requestInfo?.browser,
    operatingSystem: requestInfo?.operatingSystem,
    deviceName: requestInfo?.deviceName,
    expiresAt: new Date(now.getTime() + REFRESH_TOKEN_MAX_AGE),
  });

  await User.findByIdAndUpdate(user._id, {
  lastLogin: now,
});
  await user.save();
  user.password = undefined;

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const session = await findSessionByRefreshToken(refreshToken);

  if (!session) {
    return;
  }

  await revokeSession(session._id);
};

export const getCurrentUser = async (userId) => {
  return User.findById(userId).select('-password');
};

export const logoutAll = async (userId) => {
  await revokeAllSessions(userId);
};