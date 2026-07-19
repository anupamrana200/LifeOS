import { LoaderCircle } from 'lucide-react';

const Spinner = () => <LoaderCircle aria-hidden="true" className="animate-spin text-primary" size={22} />;

export const FullScreenLoader = ({ label = 'Loading LifeOS' }) => (
  <div aria-busy="true" aria-live="polite" className="flex min-h-screen items-center justify-center bg-canvas text-content-primary"><div className="flex items-center gap-3 rounded-card border border-border bg-card px-gutter py-4 shadow-card"><Spinner /><span className="text-sm font-medium">{label}</span></div></div>
);

export const PageLoader = ({ label = 'Loading page' }) => (
  <div aria-busy="true" aria-live="polite" className="flex min-h-64 items-center justify-center rounded-panel border border-border bg-card text-content-secondary"><div className="flex items-center gap-3"><Spinner /><span className="text-sm">{label}</span></div></div>
);

export const ContentLoader = ({ label = 'Loading content' }) => (
  <div aria-busy="true" aria-live="polite" className="flex items-center gap-2 py-4 text-sm text-content-secondary"><Spinner />{label}</div>
);
