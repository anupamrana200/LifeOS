import Chat from '../models/chat.model.js';
import Document from '../models/Document.js';
import Message from '../models/message.model.js';
import { toChatResponse } from '../serializers/chat.serializer.js';
import { toDocumentResponse } from '../serializers/document.serializer.js';

const tokenCount = (usage = {}) => Number(usage.total_tokens || usage.totalTokenCount || (Number(usage.input_tokens || usage.promptTokenCount || 0) + Number(usage.output_tokens || usage.candidatesTokenCount || 0)) || 0);

export const getDashboardOverview = async (req, res) => {
  const [chats, documents] = await Promise.all([
    Chat.find({ owner: req.user.id }).sort({ updatedAt: -1 }).lean(),
    Document.find({ owner: req.user.id }).sort({ createdAt: -1 }).lean(),
  ]);
  const chatIds = chats.map((chat) => chat._id);
  const messages = chatIds.length ? await Message.find({ chat: { $in: chatIds }, role: 'assistant' }).select('usage').lean() : [];
  const recentChats = chats.slice(0, 4).map(toChatResponse);
  const recentDocuments = documents.slice(0, 4).map(toDocumentResponse);
  const activity = [...recentDocuments.map((document) => ({ detail: document.title, time: document.createdAt, title: 'Uploaded a document', type: 'upload' })), ...recentChats.map((chat) => ({ detail: chat.title, time: chat.updatedAt, title: 'Started or continued a chat', type: 'chat' }))].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  res.status(200).json({ success: true, data: { activity, metrics: { chats: chats.length, documents: documents.length, knowledgeFiles: documents.filter((document) => document.aiStatus === 'completed').length, tokensUsed: messages.reduce((total, message) => total + tokenCount(message.usage), 0) }, recentChats, recentDocuments } });
};
