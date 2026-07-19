import { RotateCw, X } from 'lucide-react';
import { formatFileSize } from '@/utils';
import { ProgressBar } from './ProgressBar';

export const UploadQueue = ({ items = [], onCancel, onRemove, onRetry }) => {
  if (!items.length) return null;
  return <ul className="mt-gutter space-y-2">{items.map((item) => <li className="rounded-card border border-border bg-card p-3" key={item.id}><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-content-primary">{item.file.name}</p><p className="mt-0.5 text-xs text-content-muted">{formatFileSize(item.file.size)} · {item.status}</p></div>{item.status === 'uploading' && <button aria-label={`Cancel ${item.file.name}`} className="text-content-muted hover:text-danger" onClick={() => onCancel(item.id)} type="button"><X aria-hidden="true" size={17} /></button>}{item.status === 'failed' && <button aria-label={`Retry ${item.file.name}`} className="text-primary hover:opacity-80" onClick={() => onRetry(item.id)} type="button"><RotateCw aria-hidden="true" size={17} /></button>}{item.status !== 'uploading' && <button aria-label={`Remove ${item.file.name}`} className="text-content-muted hover:text-danger" onClick={() => onRemove(item.id)} type="button"><X aria-hidden="true" size={17} /></button>}</div>{item.status === 'uploading' && <div className="mt-3"><ProgressBar value={item.progress} /></div>}{item.error && <p className="mt-2 text-xs text-danger">{item.error}</p>}</li>)}</ul>;
};
