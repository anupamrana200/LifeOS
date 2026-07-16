import jwt from 'jsonwebtoken';

import env from '../config/env.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const getUserId = (user) => {
  const userId = user?._id ?? user?.id;

  if (!userId) {
    throw new Error('A user with an identifier is required to generate a token.');
  }

  return userId.toString();
};

const verifyToken = (token, secret, tokenType) => {
  if (!token || typeof token !== 'string') {
    throw new Error(`A valid ${tokenType} token is required.`);
  }

  try {
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    });
  } catch (error) {
    throw new Error(`Invalid or expired ${tokenType} token.`, {
      cause: error,
    });
  }
};

export const generateAccessToken = (user) => {
  const userId = getUserId(user);

  if (!user?.email) {
    throw new Error('User email is required to generate an access token.');
  }

  if (!user?.role) {
    throw new Error('User role is required to generate an access token.');
  }

  return jwt.sign(
    {
      userId,
      email: user.email,
      role: user.role,
    },
    env.jwtAccessSecret,
    {
      algorithm: 'HS256',
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: getUserId(user),
    },
    env.jwtRefreshSecret,
    {
      algorithm: 'HS256',
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }
  );
};

export const verifyAccessToken = (token) => {
  return verifyToken(token, env.jwtAccessSecret, 'access');
};

export const verifyRefreshToken = (token) => {
  return verifyToken(token, env.jwtRefreshSecret, 'refresh');
};