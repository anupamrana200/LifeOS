import * as authService from '../services/auth.service.js';
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
} from '../services/cookie.service.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import sendResponse from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Registration successful.',
    data: { user },
  });
});

export const login = asyncHandler(async (req, res) => {
  const requestInfo = {
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    browser: req.body.browser,
    operatingSystem: req.body.operatingSystem,
    deviceName: req.body.deviceName,
  };

  const { user, accessToken, refreshToken } = await authService.login(
    req.body,
    requestInfo,
  );

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Login successful.',
    data: { user },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  console.log("Cookies:", req.cookies);
  const refreshToken = req.cookies?.refreshToken;
  const requestInfo = {
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    browser: req.body?.browser,
    operatingSystem: req.body?.operatingSystem,
    deviceName: req.body?.deviceName,
  };

  const {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  } = await authService.refresh(refreshToken, requestInfo);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, newRefreshToken);

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Token refreshed successfully.',
    data: { user },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Current user fetched successfully.',
    data: { user },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await authService.logout(refreshToken);

  clearAuthCookies(res);

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Logout successful.',
  });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user._id);

  clearAuthCookies(res);

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Logged out from all devices successfully.',
  });
});