import { cn } from '@/utils';

export const AuthCard = ({ children, className }) => (
  <section className={cn('auth-card-enter w-full max-w-md rounded-panel border border-border bg-card p-gutter shadow-card backdrop-blur sm:p-layout', className)}>
    {children}
  </section>
);
