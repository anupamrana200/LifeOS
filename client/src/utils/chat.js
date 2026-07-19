export const getChatId = (item) => item?.id || item?._id;

export const formatChatTimestamp = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
};

export const normalizeConversation = (conversation) => ({
  id: getChatId(conversation),
  isLocked: Boolean(conversation.isLocked),
  provider: conversation.provider === 'gemini' ? 'Gemini' : 'OpenAI',
  model: conversation.model,
  title: conversation.title || 'New Chat',
  updatedAt: formatChatTimestamp(conversation.updatedAt || conversation.lastMessageAt || conversation.createdAt),
});

export const normalizeMessage = (message) => ({
  content: message.content || '',
  id: getChatId(message),
  model: message.model,
  provider: message.provider,
  role: message.role,
  sources: message.sources || [],
  timestamp: formatChatTimestamp(message.createdAt),
});

export const getFriendlyChatError = (error) => {
  const status = error?.response?.status || error?.status;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to access this conversation.';
  if (status === 404) return 'This conversation is no longer available.';
  if (status === 429) return 'You have reached the current rate limit. Please try again shortly.';
  if (status >= 500) return 'The AI service is temporarily unavailable. Please try again.';
  if (!navigator.onLine) return 'You appear to be offline. Check your connection and retry.';
  return error?.response?.data?.message || error?.message || 'Something went wrong while handling this conversation.';
};
