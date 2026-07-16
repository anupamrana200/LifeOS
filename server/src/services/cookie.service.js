import env from '../config/env.js';

const ACCESS_TOKEN_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getAuthCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.cookieSameSite,
  path: '/',
  maxAge,
});

export const setAccessTokenCookie = (res, accessToken) =>
  res.cookie(
    'accessToken',
    accessToken,
    getAuthCookieOptions(ACCESS_TOKEN_COOKIE_MAX_AGE)
  );

export const setRefreshTokenCookie = (res, refreshToken) =>
  res.cookie(
    'refreshToken',
    refreshToken,
    getAuthCookieOptions(REFRESH_TOKEN_COOKIE_MAX_AGE)
  );

export const clearAuthCookies = (res) => {
  res.clearCookie(
    'accessToken',
    getAuthCookieOptions(ACCESS_TOKEN_COOKIE_MAX_AGE)
  );

  res.clearCookie(
    'refreshToken',
    getAuthCookieOptions(REFRESH_TOKEN_COOKIE_MAX_AGE)
  );
};