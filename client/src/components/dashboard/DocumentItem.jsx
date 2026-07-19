import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const DocumentItem = ({ name, type, uploadedAt }) => (
  <Link className="flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-theme hover:bg-canvas" to={ROUTES.documents}>
    <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-accent/10 text-accent"><FileText aria-hidden="true" size={17} /></span>
    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-content-primary">{name}</span><span className="mt-0.5 block text-xs text-content-muted">{type} · {uploadedAt}</span></span>
  </Link>
);
