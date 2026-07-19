import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/utils';

export const ConversationItem = ({ conversation, isActive, onDelete, onSelect }) => (
  <div className={cn('group flex items-center gap-1 rounded-control transition-colors duration-theme hover:bg-canvas', isActive && 'bg-primary/10 text-primary')}>
    <button aria-current={isActive ? 'true' : undefined} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left" onClick={() => onSelect(conversation.id)} type="button"><span className={cn('flex size-8 shrink-0 items-center justify-center rounded-control bg-canvas text-content-muted', isActive && 'bg-primary/15 text-primary')}><MessageSquare aria-hidden="true" size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-content-primary">{conversation.title}</span><span className="mt-0.5 block text-xs text-content-muted">{conversation.updatedAt}</span></span></button>
    <button aria-label={`Delete ${conversation.title}`} className="mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-control text-content-muted opacity-100 transition-[opacity,color] duration-theme hover:text-danger sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100" onClick={() => onDelete(conversation)} type="button"><Trash2 aria-hidden="true" size={15} /></button>
  </div>
);
