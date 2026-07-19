import { LoaderCircle } from 'lucide-react';

export const LoadingOverlay = ({ label = 'Loading' }) => (
  <div aria-busy="true" aria-live="polite" className="flex min-h-screen items-center justify-center bg-canvas p-gutter text-content-primary">
    <div className="flex items-center gap-3 rounded-card border border-border bg-card px-gutter py-4 shadow-card">
      <LoaderCircle aria-hidden="true" className="animate-spin text-primary" size={20} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  </div>
);
