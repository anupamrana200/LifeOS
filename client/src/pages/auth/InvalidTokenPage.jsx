import { CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader } from '@/components/auth';
import { ROUTES } from '@/constants';

export const InvalidTokenPage = () => (
  <AuthCard className="text-center">
    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-card bg-danger/15 text-danger">
      <CircleAlert aria-hidden="true" size={27} />
    </div>
    <AuthHeader description="This link is invalid, expired, or has already been used." title="Link unavailable" />
    <Link className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90" to={ROUTES.forgotPassword}>
      Request a new link
    </Link>
  </AuthCard>
);
