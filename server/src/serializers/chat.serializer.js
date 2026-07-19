import { decryptText } from '../services/encryption.service.js';

export const toChatResponse = (chat) => ({ ...chat.toObject?.() || chat, title: decryptText(chat.title, 'chat.title') });
export const toMessageResponse = (message) => ({ ...message.toObject?.() || message, content: decryptText(message.content, 'chat.message') });
