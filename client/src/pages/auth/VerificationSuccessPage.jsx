import { BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader } from '@/components/auth';
import { ROUTES } from '@/constants';

export const VerificationSuccessPage = () => (
  <AuthCard className="text-center">
    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-card bg-success/15 text-success">
      <BadgeCheck aria-hidden="true" size={28} />
    </div>
    <AuthHeader description="Your email address has been verified and your account is ready." title="Email verified" />
    <Link className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90" to={ROUTES.signIn}>
      Continue to sign in
    </Link>
  </AuthCard>
);
