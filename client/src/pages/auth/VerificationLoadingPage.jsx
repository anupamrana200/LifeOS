import { AuthCard, AuthHeader, LoadingOverlay } from '@/components/auth';

export const VerificationLoadingPage = ({ inline = false }) => {
  if (!inline) return <LoadingOverlay label="Verifying your email" />;

  return (
    <AuthCard>
      <AuthHeader description="Please wait while we securely verify your email address." title="Verifying email" />
    </AuthCard>
  );
};
