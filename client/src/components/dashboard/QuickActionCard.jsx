import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActionCard = ({ description, icon: Icon, title, to }) => (
  <Link className="group rounded-card border border-border bg-card p-gutter shadow-card transition-[transform,box-shadow,border-color] duration-theme hover:-translate-y-0.5 hover:border-primary hover:shadow-floating focus-visible:outline-primary" to={to}>
    <div className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-control bg-primary/10 text-primary transition-transform duration-theme group-hover:scale-105"><Icon aria-hidden="true" size={20} /></span><ArrowUpRight aria-hidden="true" className="text-content-muted transition-colors duration-theme group-hover:text-primary" size={18} /></div>
    <h2 className="mt-gutter font-display text-sm font-semibold text-content-primary">{title}</h2>
    <p className="mt-1 text-sm leading-6 text-content-secondary">{description}</p>
  </Link>
);
