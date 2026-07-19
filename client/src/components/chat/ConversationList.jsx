import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/feedback';
import { ConversationItem } from './ConversationItem';

export const ConversationList = ({ conversations = [], selectedConversationId, onDelete, onSelect }) => {
  if (!conversations.length) return <EmptyState description="Start a conversation to see it here." icon={MessageSquare} title="No conversations" />;
  return <div className="space-y-1">{conversations.map((conversation) => <ConversationItem conversation={conversation} isActive={conversation.id === selectedConversationId} key={conversation.id} onDelete={onDelete} onSelect={onSelect} />)}</div>;
};
