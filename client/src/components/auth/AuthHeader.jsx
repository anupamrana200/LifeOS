import { BrainCircuit } from 'lucide-react';

export const AuthHeader = ({ description, title }) => (
  <header className="mb-layout text-center">
    <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-card bg-primary text-content-inverse shadow-card">
      <BrainCircuit aria-hidden="true" size={23} />
    </div>
    <h1 className="text-2xl font-semibold text-content-primary">{title}</h1>
    {description && <p className="mt-2 text-sm text-content-secondary">{description}</p>}
  </header>
);
