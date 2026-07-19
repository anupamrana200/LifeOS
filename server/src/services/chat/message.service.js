import Chat from '../../models/chat.model.js';
import Message from '../../models/message.model.js';

import CHAT_CONFIG from '../../config/chat.config.js';

import ragService from '../ai/rag.service.js';

import historyService from './history.service.js';

import titleService from './title.service.js';
import { decryptText, encryptText } from '../encryption.service.js';
import { toMessageResponse } from '../../serializers/chat.serializer.js';

class MessageService {

  async send({
    chatId,
    userId,
    message,
  }) {

    const chat = await Chat.findOne({
      _id: chatId,
      owner: userId,
    });

    if (!chat) {
      throw new Error('Chat not found.');
    }

    if (!chat.model) chat.model = chat.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-5-mini';

    if (chat.isLocked) {
      throw new Error(
        'This chat has been locked.'
      );
    }

    await Message.create({
      chat: chat._id,
      role: 'user',
      content: encryptText(message, 'chat.message'),
    });

    const history = await historyService.getHistory(
      chat._id,
      10,
    );

    const aiResponse =
      await ragService.chat({
        chatId: chat._id,
        userId,
        question: message,
        provider: chat.provider,
        model: chat.model,
        history,
    });

    await Message.create({
      chat: chat._id,
      role: 'assistant',
      content: encryptText(aiResponse.answer, 'chat.message'),
      usage: aiResponse.usage,
      provider: aiResponse.provider,
      model: aiResponse.model,
      sources: aiResponse.sources,
    });

    if (
      decryptText(chat.title, 'chat.title') === 'New Chat'
    ) {
      chat.title =
        encryptText(await titleService.generate({
          message,
          provider: chat.provider,
        }), 'chat.title');
    }

    chat.userMessageCount += 1;

    chat.lastMessageAt = new Date();

    if (
      chat.userMessageCount >=
      CHAT_CONFIG.MAX_USER_MESSAGES_PER_CHAT
    ) {
      chat.isLocked = true;
    }

    await chat.save();

    return aiResponse;
  }

  async getMessages({
    chatId,
    userId,
  }) {

    const chat = await Chat.findOne({
      _id: chatId,
      owner: userId,
    });

    if (!chat) {
      throw new Error('Chat not found.');
    }

    if (!chat.model) chat.model = chat.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-5-mini';

    const messages = await Message.find({
      chat: chatId,
    })
      .sort({
        createdAt: 1,
      })
      .lean();
    return messages.map(toMessageResponse);

  }

async stream({
    chatId,
    userId,
    message,
    onToken,
  }) {

    const chat =
      await Chat.findOne({
        _id: chatId,
        owner: userId,
      });

    if (!chat) {
      throw new Error('Chat not found.');
    }

    if (!chat.model) chat.model = chat.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-5-mini';

    if (chat.isLocked) {
      throw new Error(
        'This chat has reached its message limit.'
      );
    }

    await Message.create({
      chat: chat._id,
      role: 'user',
      content: encryptText(message, 'chat.message'),
    });

    const history =
      await historyService.getHistory(chat._id);

    const aiResponse =
      await ragService.stream({
        chatId: chat._id,
        userId,
        question: message,
        provider: chat.provider,
        model: chat.model,
        history,
        onToken,
      });

    await Message.create({
      chat: chat._id,
      role: 'assistant',
      content: encryptText(aiResponse.answer, 'chat.message'),
      usage: aiResponse.usage,
      provider: aiResponse.provider,
      model: aiResponse.model,
      sources: aiResponse.sources,
    });

    if (
      decryptText(chat.title, 'chat.title') === 'New Chat'
    ) {

      chat.title =
        encryptText(await titleService.generate({
          message,
          provider: chat.provider,
        }), 'chat.title');

    }

    chat.userMessageCount += 1;

    chat.lastMessageAt = new Date();

    if (
      chat.userMessageCount >=
      CHAT_CONFIG.MAX_USER_MESSAGES_PER_CHAT
    ) {
      chat.isLocked = true;
    }

    await chat.save();

    return aiResponse;

  }

}

export default new MessageService();
