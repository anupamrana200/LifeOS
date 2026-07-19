import { Inbox } from 'lucide-react';

export const EmptyState = ({ action, description = 'There is nothing to show yet.', icon: Icon = Inbox, title = 'Nothing here yet' }) => (
  <section className="flex min-h-64 flex-col items-center justify-center rounded-panel border border-dashed border-border bg-card px-gutter py-layout text-center">
    <div className="mb-4 flex size-11 items-center justify-center rounded-card bg-canvas text-content-muted"><Icon aria-hidden="true" size={22} /></div>
    <h2 className="font-display text-lg font-semibold text-content-primary">{title}</h2>
    <p className="mt-2 max-w-sm text-sm text-content-secondary">{description}</p>
    {action && <div className="mt-gutter">{action}</div>}
  </section>
);
