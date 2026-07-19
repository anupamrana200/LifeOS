import { Navigate, Outlet } from 'react-router-dom';
import { LoadingOverlay } from '@/components/auth';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';

export const GuestRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return <LoadingOverlay label="Checking your session" />;
  if (isAuthenticated) return <Navigate replace to={ROUTES.dashboard} />;
  return <Outlet />;
};
