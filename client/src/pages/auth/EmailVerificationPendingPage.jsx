import { MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader } from '@/components/auth';
import { ROUTES } from '@/constants';

export const EmailVerificationPendingPage = () => (
  <AuthCard className="text-center">
    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-card bg-accent/15 text-accent">
      <MailCheck aria-hidden="true" size={26} />
    </div>
    <AuthHeader description="Check your inbox and open the verification link to activate email-based account features." title="Verify your email" />
    <Link className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90" to={ROUTES.signIn}>
      Back to sign in
    </Link>
  </AuthCard>
);
