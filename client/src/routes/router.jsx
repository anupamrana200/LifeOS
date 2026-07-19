import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, ChatLayout, DashboardLayout, LandingLayout, SettingsLayout } from '@/layouts';
import { DashboardHomePage } from '@/pages/dashboard';
import { DocumentsPage } from '@/pages/documents';
import { ChatPage } from '@/pages/chat';
import { ProfilePage } from '@/pages/profile';
import { SearchPage } from '@/pages/search';
import { SettingsPage } from '@/pages/settings';
import { ROUTES } from '@/constants';
import { DocumentProvider } from '@/context';
import {
  EmailVerificationPendingPage,
  ForgotPasswordPage,
  InvalidTokenPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerificationSuccessPage,
  VerifyEmailPage,
} from '@/pages/auth';
import { GuestRoute } from './GuestRoute';
import { NotFoundRoute } from './NotFoundRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RouteSlot } from './RouteSlot';
import { guestRoutes, protectedRoutes, publicRoutes } from './routeConfig';

const toSlots = (routes) => routes.map((route) => ({ ...route, element: route.element || <RouteSlot /> }));
const dashboardPages = protectedRoutes.dashboard.map((route) => ({
  ...route,
  element: route.path === ROUTES.dashboard ? <DashboardHomePage /> : route.path === ROUTES.documents ? <DocumentProvider><DocumentsPage /></DocumentProvider> : route.path === ROUTES.profile ? <ProfilePage /> : route.path === ROUTES.search ? <SearchPage /> : <RouteSlot />,
}));
const chatPages = protectedRoutes.chat.map((route) => ({ ...route, element: <ChatPage /> }));
const authPageElements = {
  login: <LoginPage />,
  register: <RegisterPage />,
  'forgot-password': <ForgotPasswordPage />,
  'reset-password': <ResetPasswordPage />,
  'verify-email': <VerifyEmailPage />,
  'verify-email-pending': <EmailVerificationPendingPage />,
  'verification-success': <VerificationSuccessPage />,
  'invalid-token': <InvalidTokenPage />,
};
const authPages = guestRoutes.map(({ key, path }) => ({ element: authPageElements[key], path }));

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [{ element: <LandingLayout />, children: toSlots(publicRoutes.map((route) => ({ ...route, element: <Navigate replace to={ROUTES.dashboard} /> }))) }],
  },
  {
    element: <GuestRoute />,
    children: [{ element: <AuthLayout />, children: authPages }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { element: <DashboardLayout />, children: dashboardPages },
      { element: <ChatLayout />, children: chatPages },
      { element: <SettingsLayout />, children: protectedRoutes.settings.map((route) => ({ ...route, element: <SettingsPage /> })) },
    ],
  },
  { path: '*', element: <NotFoundRoute /> },
]);
