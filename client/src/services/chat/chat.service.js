import { httpClient } from '@/lib';

const unwrap = (response) => response.data?.data;

export const fetchMessages = async (chatId) => unwrap(await httpClient.get(`/chats/${chatId}/messages`));
export const sendMessage = async (chatId, message) => unwrap(await httpClient.post(`/chats/${chatId}/messages`, { message }));
