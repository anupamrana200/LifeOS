import * as authService from '../services/auth.service.js';
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
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
