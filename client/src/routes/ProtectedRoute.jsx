import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingOverlay } from '@/components/auth';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return <LoadingOverlay label="Restoring your secure session" />;
  if (!isAuthenticated) return <Navigate replace state={{ from: location }} to={ROUTES.signIn} />;

  return <Outlet />;
};
