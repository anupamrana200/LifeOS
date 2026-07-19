import { useEffect, useRef, useState } from 'react';
import {
  AssistantMessage,
  ChatHeader,
  ChatInfoPanel,
  ChatSidebar,
  EmptyChat,
  MessageInput,
  MessageSkeleton,
  SystemMessage,
  TypingIndicator,
  UserMessage,
} from '@/components/chat';
import { documentService } from '@/services';
import { useChat } from '@/hooks';

export const ChatPage = () => {
  const { conversations, createNewConversation, currentConversation, deleteConversation, error, isConversationSidebarOpen, isConversationsLoading, isInfoPanelOpen, isLoading, isTyping, messages, selectConversation, sendMessage, retryLastMessage, setConversationSidebarOpen, setInfoPanelOpen, stopTyping } = useChat();
  const [documents, setDocuments] = useState([]);
  const [pendingDeletion, setPendingDeletion] = useState(null);
  const messageContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    let isActive = true;
    documentService.fetchDocuments({ limit: 50, page: 1, sort: '-createdAt' })
      .then((data) => { if (isActive) setDocuments(data?.documents || []); })
      .catch(() => { if (isActive) setDocuments([]); });
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container && shouldAutoScrollRef.current) container.scrollTop = container.scrollHeight;
  }, [isTyping, messages]);

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;
    shouldAutoScrollRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < 48;
  };

  const confirmDeletion = async () => {
    if (!pendingDeletion) return;
    await deleteConversation(pendingDeletion.id);
    setPendingDeletion(null);
  };

  return (
    <div className="chat-page-enter relative grid min-h-0 flex-1 overflow-hidden rounded-panel border border-border bg-card shadow-card lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_19rem]">
      {isConversationSidebarOpen && <button aria-label="Close conversations" className="fixed inset-0 z-overlay bg-secondary/40 lg:hidden" onClick={() => setConversationSidebarOpen(false)} type="button" />}
      {isInfoPanelOpen && <button aria-label="Close conversation details" className="fixed inset-0 z-overlay bg-secondary/40 xl:hidden" onClick={() => setInfoPanelOpen(false)} type="button" />}
      <ChatSidebar conversations={conversations} isLoading={isConversationsLoading} isOpen={isConversationSidebarOpen} onClose={() => setConversationSidebarOpen(false)} onDelete={(conversation) => setPendingDeletion(conversation)} onNewChat={createNewConversation} onSelect={selectConversation} selectedConversationId={currentConversation?.id} />
      <section aria-label="Chat" className="relative z-base flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface">
        <ChatHeader conversation={currentConversation} onInfoOpen={() => setInfoPanelOpen(true)} onSidebarOpen={() => setConversationSidebarOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" onScroll={handleScroll} ref={messageContainerRef}>
          {isLoading ? <MessageSkeleton /> : messages.length ? <div className="mx-auto flex w-full max-w-3xl flex-col gap-gutter px-gutter py-layout">{messages.map((message) => {
            if (message.role === 'user') return <UserMessage key={message.id} message={message} />;
            if (message.role === 'system') return <SystemMessage key={message.id} message={message} />;
            return <AssistantMessage key={message.id} message={message} />;
          })}{isTyping && <TypingIndicator />}</div> : <EmptyChat />}
        </div>
        {error && <div className="mx-gutter mb-2 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert"><span>{error}</span><button className="rounded-control border border-danger/30 px-2 py-1 text-xs font-medium hover:bg-danger/10" onClick={retryLastMessage} type="button">Refresh conversation</button></div>}
        <MessageInput isTyping={isTyping} onSend={sendMessage} onStop={stopTyping} />
      </section>
      <ChatInfoPanel conversation={currentConversation} documents={documents} isOpen={isInfoPanelOpen} messageCount={messages.length} onClose={() => setInfoPanelOpen(false)} />
      {pendingDeletion && <div aria-modal="true" className="fixed inset-0 z-toast grid place-items-center bg-secondary/50 p-gutter" role="alertdialog" aria-labelledby="delete-chat-title"><section className="w-full max-w-sm rounded-panel border border-border bg-card p-layout shadow-floating"><h2 className="font-display text-lg font-semibold text-content-primary" id="delete-chat-title">Delete conversation?</h2><p className="mt-2 text-sm leading-6 text-content-secondary">Delete “{pendingDeletion.title}”? This cannot be undone.</p><div className="mt-layout flex justify-end gap-2"><button className="rounded-control border border-border px-3 py-2 text-sm font-medium text-content-secondary hover:bg-canvas" onClick={() => setPendingDeletion(null)} type="button">Cancel</button><button className="rounded-control bg-danger px-3 py-2 text-sm font-semibold text-content-inverse hover:opacity-90" onClick={confirmDeletion} type="button">Delete</button></div></section></div>}
    </div>
  );
};
