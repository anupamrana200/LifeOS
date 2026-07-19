import { cn } from '@/utils';

export const SectionCard = ({ action, children, className, description, title }) => (
  <section className={cn('rounded-panel border border-border bg-card p-gutter shadow-card transition-[transform,box-shadow] duration-theme hover:-translate-y-0.5 hover:shadow-floating', className)}>
    {(title || description || action) && <header className="mb-gutter flex items-start justify-between gap-4"><div><h2 className="font-display text-base font-semibold text-content-primary">{title}</h2>{description && <p className="mt-1 text-sm text-content-secondary">{description}</p>}</div>{action && <div className="shrink-0">{action}</div>}</header>}
    {children}
  </section>
);
