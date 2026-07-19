import { CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status = 'Healthy' }) => (
  <span className="inline-flex items-center gap-1.5 rounded-pill bg-success/15 px-2.5 py-1 text-xs font-medium text-success"><CheckCircle2 aria-hidden="true" size={13} />{status}</span>
);
