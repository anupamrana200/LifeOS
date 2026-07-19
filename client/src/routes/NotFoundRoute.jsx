import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const NotFoundRoute = () => (
  <main className="grid min-h-screen place-items-center bg-canvas p-gutter text-center text-content-primary transition-colors duration-theme">
    <div className="space-y-4">
      <p className="font-mono text-sm text-content-muted">404</p>
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-content-secondary">The address does not match a LifeOS route.</p>
      <Link className="inline-flex rounded-control bg-primary px-4 py-2 text-sm font-medium text-content-inverse transition-opacity duration-theme hover:opacity-90" to={ROUTES.home}>
        Return home
      </Link>
    </div>
  </main>
);

