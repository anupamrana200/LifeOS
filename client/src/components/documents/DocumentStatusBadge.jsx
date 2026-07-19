import { CheckCircle2, CircleAlert, LoaderCircle, UploadCloud } from 'lucide-react';
import { cn, getDocumentStatus } from '@/utils';

const styles = { Failed: 'bg-danger/15 text-danger', Indexed: 'bg-success/15 text-success', Processing: 'bg-warning/15 text-warning', Uploading: 'bg-accent/15 text-accent' };
const icons = { Failed: CircleAlert, Indexed: CheckCircle2, Processing: LoaderCircle, Uploading: UploadCloud };

export const DocumentStatusBadge = ({ document, status }) => {
  const label = status || getDocumentStatus(document || {});
  const Icon = icons[label] || UploadCloud;
  return <span className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium', styles[label] || styles.Uploading)}><Icon aria-hidden="true" className={label === 'Processing' ? 'animate-spin' : ''} size={13} />{label}</span>;
};
