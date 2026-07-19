import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { VerificationLoadingPage } from './VerificationLoadingPage';

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.invalidToken, { replace: true });
      return undefined;
    }

    let isMounted = true;
    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        if (isMounted) {
          setStatus('success');
          navigate(ROUTES.verificationSuccess, { replace: true });
        }
      } catch {
        if (isMounted) {
          setStatus('invalid');
          navigate(ROUTES.invalidToken, { replace: true });
        }
      }
    };

    verify();
    return () => { isMounted = false; };
  }, [navigate, token]);

  return <VerificationLoadingPage inline={status === 'loading'} />;
};
