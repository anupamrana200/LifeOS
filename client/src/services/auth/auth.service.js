import { httpClient } from '@/lib';

const unwrap = (response) => response.data?.data || {};

export const login = async (credentials) => unwrap(await httpClient.post('/auth/login', credentials, { skipAuthRefresh: true }));

export const register = async (payload) => unwrap(await httpClient.post('/auth/register', payload, { skipAuthRefresh: true }));

export const logout = async () => unwrap(await httpClient.post('/auth/logout', {}, { skipAuthRefresh: true }));

export const forgotPassword = async (payload) => unwrap(await httpClient.post('/auth/forgot-password', payload, { skipAuthRefresh: true }));

export const resetPassword = async (token, payload) => unwrap(await httpClient.post(`/auth/reset-password/${token}`, payload, { skipAuthRefresh: true }));

export const verifyEmail = async (token) => unwrap(await httpClient.post(`/auth/verify-email/${token}`, {}, { skipAuthRefresh: true }));

export const refreshToken = async () => unwrap(await httpClient.post('/auth/refresh', {}, { skipAuthRefresh: true }));

export const getCurrentUser = async () => unwrap(await httpClient.get('/auth/me'));
