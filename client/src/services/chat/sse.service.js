import { appConfig } from '@/config';
import { getAccessToken, httpClient, notifyUnauthorized } from '@/lib';

const parseSseChunk = (buffer, onEvent) => {
  const events = buffer.split('\n\n');
  const remainder = events.pop() || '';

  events.forEach((event) => {
    const dataLine = event.split('\n').find((line) => line.startsWith('data:'));
    if (!dataLine) return;
    try {
      onEvent(JSON.parse(dataLine.slice(5).trim()));
    } catch {
      // Ignore malformed transport frames and continue receiving the stream.
    }
  });

  return remainder;
};

const refreshSession = async () => {
  try {
    await httpClient.post('/auth/refresh', {}, { skipAuthRefresh: true });
  } catch (error) {
    notifyUnauthorized();
    throw error;
  }
};

const openStream = async (chatId, message, signal) => {
  const token = getAccessToken();
  const headers = { Accept: 'text/event-stream', 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${appConfig.apiBaseUrl}/chats/${chatId}/messages/stream`, {
    body: JSON.stringify({ message }),
    credentials: 'include',
    headers,
    method: 'POST',
    signal,
  });
};

export const streamMessage = async ({ chatId, message, onDone, onError, onToken, signal }) => {
  let response = await openStream(chatId, message, signal);

  if (response.status === 401) {
    await refreshSession();
    response = await openStream(chatId, message, signal);
  }

  if (!response.ok || !response.body) {
    const error = new Error(response.status === 429 ? 'You have reached the current rate limit. Please try again shortly.' : 'Unable to start the AI response.');
    error.status = response.status;
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let streamError = null;

  const handleEvent = (event) => {
    if (event.token) onToken(event.token);
    if (event.error) {
      streamError = new Error(event.error);
      onError?.(event.error);
    }
    if (event.done) onDone?.();
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      buffer = parseSseChunk(buffer, handleEvent);
    }

    buffer += decoder.decode();
    if (buffer.trim()) parseSseChunk(`${buffer}\n\n`, handleEvent);
    if (streamError) throw streamError;
  } finally {
    reader.releaseLock();
  }
};
