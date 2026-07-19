import { httpClient } from '@/lib';

const unwrap = (response) => response.data?.data;

export const fetchConversations = async () => unwrap(await httpClient.get('/chats'));
export const createConversation = async (provider = 'openai', model = 'gpt-5-mini') => unwrap(await httpClient.post('/chats', { model, provider }));
export const fetchConversation = async (chatId) => unwrap(await httpClient.get(`/chats/${chatId}`));
export const deleteConversation = async (chatId) => unwrap(await httpClient.delete(`/chats/${chatId}`));
