import { BarChart3 } from 'lucide-react';

export const MetricCard = ({ icon: Icon = BarChart3, label, value }) => (
  <article className="rounded-card border border-border bg-card p-gutter shadow-card transition-[transform,box-shadow] duration-theme hover:-translate-y-0.5 hover:shadow-floating">
    <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-content-secondary">{label}</p><span className="flex size-9 items-center justify-center rounded-control bg-primary/10 text-primary"><Icon aria-hidden="true" size={18} /></span></div>
    <p className="mt-gutter font-display text-2xl font-semibold text-content-primary">{value}</p>
  </article>
);
