import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { chatService, conversationService, sseService } from '@/services';
import { getFriendlyChatError, normalizeConversation, normalizeMessage } from '@/utils';
import ChatContext from './ChatContext';

const createMessage = (content, role) => ({
  content,
  id: `msg-${Date.now()}-${role}`,
  role,
  timestamp: new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date()),
});

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [isConversationsLoading, setConversationsLoading] = useState(true);
  const [isMessagesLoading, setMessagesLoading] = useState(false);
  const [isStreaming, setStreaming] = useState(false);
  const [isConversationSidebarOpen, setConversationSidebarOpen] = useState(false);
  const [isInfoPanelOpen, setInfoPanelOpen] = useState(false);
  const [error, setError] = useState(null);
  const streamController = useRef(null);

  useEffect(() => () => streamController.current?.abort(), []);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );
  const messages = useMemo(
    () => selectedConversation ? messagesByConversation[selectedConversation.id] || [] : [],
    [messagesByConversation, selectedConversation],
  );

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setMessagesLoading(true);
    setError(null);
    try {
      const data = await chatService.fetchMessages(conversationId);
      setMessagesByConversation((current) => ({ ...current, [conversationId]: (data || []).map(normalizeMessage) }));
    } catch (loadError) {
      setError(getFriendlyChatError(loadError));
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const refreshConversations = useCallback(async () => {
    setConversationsLoading(true);
    setError(null);
    try {
      const data = await conversationService.fetchConversations();
      const nextConversations = (data || []).map(normalizeConversation);
      setConversations(nextConversations);
      setSelectedConversationId((currentId) => {
        const nextId = nextConversations.some((conversation) => conversation.id === currentId) ? currentId : nextConversations[0]?.id || null;
        if (nextId && nextId !== currentId) loadMessages(nextId);
        return nextId;
      });
      return nextConversations;
    } catch (loadError) {
      setError(getFriendlyChatError(loadError));
      return [];
    } finally {
      setConversationsLoading(false);
    }
  }, [loadMessages]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const selectConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId);
    setConversationSidebarOpen(false);
    loadMessages(conversationId);
  }, [loadMessages]);

  const createNewConversation = useCallback(async () => {
    setError(null);
    try {
      const data = await conversationService.createConversation();
      const conversation = normalizeConversation(data);
      setConversations((current) => [conversation, ...current]);
      setMessagesByConversation((current) => ({ ...current, [conversation.id]: [] }));
      setSelectedConversationId(conversation.id);
      setConversationSidebarOpen(false);
      return conversation;
    } catch (createError) {
      setError(getFriendlyChatError(createError));
      throw createError;
    }
  }, []);

  const stopStreaming = useCallback(() => {
    streamController.current?.abort();
    streamController.current = null;
    setStreaming(false);
  }, []);

  const sendMessage = useCallback(async (content) => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isStreaming) return;

    let conversationId = selectedConversationId;
    if (!conversationId) {
      try {
        const conversation = await createNewConversation();
        conversationId = conversation.id;
      } catch {
        return;
      }
    }

    const userMessage = createMessage(trimmedContent, 'user');
    const assistantMessage = { ...createMessage('', 'assistant'), id: `stream-${Date.now()}`, isStreaming: true, sources: [] };
    setMessagesByConversation((current) => ({ ...current, [conversationId]: [...(current[conversationId] || []), userMessage, assistantMessage] }));
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, title: conversation.title === 'New Chat' ? trimmedContent.slice(0, 48) : conversation.title, updatedAt: 'Now' } : conversation));
    setError(null);
    setStreaming(true);
    const controller = new AbortController();
    streamController.current = controller;

    try {
      await sseService.streamMessage({
        chatId: conversationId,
        message: trimmedContent,
        onToken: (token) => setMessagesByConversation((current) => ({ ...current, [conversationId]: (current[conversationId] || []).map((message) => message.id === assistantMessage.id ? { ...message, content: `${message.content}${token}` } : message) })),
        signal: controller.signal,
      });
      const persistedMessages = await chatService.fetchMessages(conversationId);
      const persistedAssistant = [...(persistedMessages || [])].reverse().find((message) => message.role === 'assistant');
      if (persistedAssistant) {
        const normalizedAssistant = normalizeMessage(persistedAssistant);
        setMessagesByConversation((current) => ({ ...current, [conversationId]: (current[conversationId] || []).map((message) => message.id === assistantMessage.id ? { ...message, isStreaming: false, model: normalizedAssistant.model, provider: normalizedAssistant.provider, sources: normalizedAssistant.sources } : message) }));
      }
      const refreshedConversation = await conversationService.fetchConversation(conversationId);
      const normalizedConversation = normalizeConversation(refreshedConversation);
      setConversations((current) => current.map((conversation) => conversation.id === conversationId ? normalizedConversation : conversation));
    } catch (streamError) {
      if (streamError.name !== 'AbortError') {
        setError(getFriendlyChatError(streamError));
      }
      setMessagesByConversation((current) => ({ ...current, [conversationId]: (current[conversationId] || []).map((message) => message.id === assistantMessage.id ? { ...message, isStreaming: false } : message) }));
    } finally {
      if (streamController.current === controller) streamController.current = null;
      setStreaming(false);
    }
  }, [createNewConversation, isStreaming, selectedConversationId]);

  const retryLastMessage = useCallback(() => {
    if (selectedConversationId) return loadMessages(selectedConversationId);
    return refreshConversations();
  }, [loadMessages, refreshConversations, selectedConversationId]);

  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await conversationService.deleteConversation(conversationId);
      const nextConversations = conversations.filter((conversation) => conversation.id !== conversationId);
      setConversations(nextConversations);
      setMessagesByConversation((current) => {
        const remaining = { ...current };
        delete remaining[conversationId];
        return remaining;
      });
      if (conversationId === selectedConversationId) {
        const nextId = nextConversations[0]?.id || null;
        setSelectedConversationId(nextId);
        if (nextId) loadMessages(nextId);
      }
    } catch (deleteError) {
      setError(getFriendlyChatError(deleteError));
    }
  }, [conversations, loadMessages, selectedConversationId]);

  const value = useMemo(() => ({
    conversations,
    createNewConversation,
    currentConversation: selectedConversation,
    deleteConversation,
    error,
    isConversationSidebarOpen,
    isInfoPanelOpen,
    isConversationsLoading,
    isLoading: isMessagesLoading,
    isMessagesLoading,
    isStreaming,
    isTyping: isStreaming,
    messages,
    selectedConversation: selectedConversation,
    selectedConversationId,
    selectConversation,
    sendMessage,
    setConversationSidebarOpen,
    setInfoPanelOpen,
    refreshConversations,
    retryLastMessage,
    stopStreaming,
    stopTyping: stopStreaming,
  }), [conversations, createNewConversation, deleteConversation, error, isConversationSidebarOpen, isConversationsLoading, isInfoPanelOpen, isMessagesLoading, isStreaming, messages, refreshConversations, retryLastMessage, selectedConversation, selectedConversationId, selectConversation, sendMessage, stopStreaming]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
