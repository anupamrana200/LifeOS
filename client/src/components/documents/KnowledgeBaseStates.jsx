import { LibraryBig } from 'lucide-react';
import { EmptyState } from '@/components/feedback';

export const EmptyKnowledgeBase = ({ onUpload }) => <EmptyState action={<button className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-content-inverse" onClick={onUpload} type="button">Upload a document</button>} description="Add documents to build a personal knowledge base for LifeOS." icon={LibraryBig} title="Your knowledge base is empty" />;
export const DocumentSkeleton = ({ table = false }) => <div className={table ? 'space-y-px rounded-panel border border-border bg-border' : 'grid gap-gutter sm:grid-cols-2 xl:grid-cols-3'}>{[1, 2, 3, 4, 5, 6].map((item) => <div className={`animate-pulse bg-card ${table ? 'h-14' : 'h-48 rounded-panel border border-border'}`} key={item} />)}</div>;
