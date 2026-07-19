import { CircleAlert } from 'lucide-react';

export const ErrorState = ({ action, description = 'Please try again in a moment.', title = 'Something went wrong' }) => (
  <section className="flex min-h-64 flex-col items-center justify-center rounded-panel border border-border bg-card px-gutter py-layout text-center">
    <div className="mb-4 flex size-11 items-center justify-center rounded-card bg-danger/15 text-danger"><CircleAlert aria-hidden="true" size={22} /></div>
    <h2 className="font-display text-lg font-semibold text-content-primary">{title}</h2>
    <p className="mt-2 max-w-sm text-sm text-content-secondary">{description}</p>
    {action && <div className="mt-gutter">{action}</div>}
  </section>
);
