import crypto from 'node:crypto';

import Session from '../models/Session.js';

const hashRefreshToken = (refreshToken) => {
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new Error('A valid refresh token is required.');
  }

  return crypto.createHash('sha256').update(refreshToken).digest('hex');
};

export const createSession = async ({
  userId,
  refreshToken,
  ipAddress,
  userAgent,
  browser,
  operatingSystem,
  deviceName,
  expiresAt,
}) => {
  if (!(expiresAt instanceof Date) || Number.isNaN(expiresAt.getTime())) {
    throw new Error('A valid expiration date is required.');
  }

  return Session.create({
    user: userId,
    hashedRefreshToken: hashRefreshToken(refreshToken),
    ipAddress,
    userAgent,
    browser,
    operatingSystem,
    deviceName,
    expiresAt,
  });
};

export const findSessionByRefreshToken = async (refreshToken) =>
  Session.findOne({
    hashedRefreshToken: hashRefreshToken(refreshToken),
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

export const updateLastActivity = async (sessionId) =>
  Session.findOneAndUpdate(
    {
      _id: sessionId,
      isRevoked: false,
    },
    {
      lastActivity: new Date(),
    },
    {
      new: true,
    },
  );

export const revokeSession = async (sessionId) =>
  Session.findByIdAndUpdate(sessionId, { isRevoked: true }, { new: true });

export const revokeAllSessions = async (userId) =>
  Session.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });

export const updateSessionRefreshToken = async ({
    sessionId,
    refreshToken,
    expiresAt
}) => {
  if (!(expiresAt instanceof Date) || Number.isNaN(expiresAt.getTime())) {
    throw new Error('A valid expiration date is required.');
  }

  return Session.findOneAndUpdate(
    {
      _id: sessionId,
      isRevoked: false,
    },
    {
      hashedRefreshToken: hashRefreshToken(refreshToken),
      expiresAt,
      lastActivity: new Date(),
    },
    {
      new: true,
    },
  );
};

export const deleteSession = async (sessionId) =>
  Session.findByIdAndDelete(sessionId);