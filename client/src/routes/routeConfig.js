import { ROUTES } from '@/constants';

export const publicRoutes = Object.freeze([
  { index: true },
]);

export const guestRoutes = Object.freeze([
  { path: ROUTES.signIn, key: 'login' },
  { path: ROUTES.signUp, key: 'register' },
  { path: ROUTES.forgotPassword, key: 'forgot-password' },
  { path: ROUTES.resetPassword, key: 'reset-password' },
  { path: ROUTES.verifyEmail, key: 'verify-email' },
  { path: ROUTES.verifyEmailPending, key: 'verify-email-pending' },
  { path: ROUTES.verificationSuccess, key: 'verification-success' },
  { path: ROUTES.invalidToken, key: 'invalid-token' },
]);

export const protectedRoutes = Object.freeze({
  dashboard: [{ path: ROUTES.dashboard }, { path: ROUTES.documents }, { path: ROUTES.search }, { path: ROUTES.profile }],
  chat: [{ path: ROUTES.chat }],
  settings: [{ path: ROUTES.settings }],
});
