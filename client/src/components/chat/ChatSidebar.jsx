import { useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { cn } from '@/utils';
import { ConversationSkeleton } from './ChatSkeletons';
import { ConversationList } from './ConversationList';

export const ChatSidebar = ({ conversations, isLoading, isOpen, onClose, onDelete, onNewChat, onSelect, selectedConversationId }) => {
  const [query, setQuery] = useState('');
  const filteredConversations = useMemo(() => conversations.filter((conversation) => conversation.title.toLowerCase().includes(query.toLowerCase())), [conversations, query]);

  return (
        <aside aria-label="Conversations" className={cn('fixed inset-y-0 left-0 z-modal flex w-[min(18rem,calc(100vw-1rem))] -translate-x-full flex-col border-r border-border bg-card transition-transform duration-theme lg:static lg:z-base lg:w-auto lg:translate-x-0', isOpen && 'translate-x-0')}>
      <div className="flex items-center justify-between border-b border-border px-gutter py-3 lg:hidden"><span className="font-display font-semibold text-content-primary">Conversations</span><button aria-label="Close conversations" className="inline-flex size-9 items-center justify-center rounded-control text-content-secondary hover:bg-canvas" onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button></div>
      <div className="space-y-3 border-b border-border p-gutter"><button className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-control bg-primary px-3 text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90" onClick={onNewChat} type="button"><Plus aria-hidden="true" size={17} /> New chat</button><label className="relative block"><span className="sr-only">Search conversations</span><Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} /><input className="w-full rounded-control border border-border bg-canvas py-2 pl-9 pr-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-primary" onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" type="search" value={query} /></label></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">{isLoading ? <ConversationSkeleton /> : <ConversationList conversations={filteredConversations} onDelete={onDelete} onSelect={onSelect} selectedConversationId={selectedConversationId} />}</div>
    </aside>
  );
};
