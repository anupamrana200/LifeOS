import Chat from '../../models/chat.model.js';
import Message from '../../models/message.model.js';

import CHAT_CONFIG from '../../config/chat.config.js';

import ragService from '../ai/rag.service.js';

import historyService from './history.service.js';

import titleService from './title.service.js';

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

    if (chat.isLocked) {
      throw new Error(
        'This chat has been locked.'
      );
    }

    await Message.create({
      chat: chat._id,
      role: 'user',
      content: message,
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
        history,
    });

    await Message.create({
      chat: chat._id,
      role: 'assistant',
      content: aiResponse.answer,
      usage: aiResponse.usage,
      provider: aiResponse.provider,
      model: aiResponse.model,
      sources: aiResponse.sources,
    });

    if (
      chat.title === 'New Chat'
    ) {
      chat.title =
        await titleService.generate({
          message,
          provider: chat.provider,
        });
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

    return Message.find({
      chat: chatId,
    })
      .sort({
        createdAt: 1,
      })
      .lean();

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

    if (chat.isLocked) {
      throw new Error(
        'This chat has reached its message limit.'
      );
    }

    await Message.create({
      chat: chat._id,
      role: 'user',
      content: message,
    });

    const history =
      await historyService.getHistory(chat._id);

    const aiResponse =
      await ragService.stream({
        chatId: chat._id,
        userId,
        question: message,
        provider: chat.provider,
        history,
        onToken,
      });

    await Message.create({
      chat: chat._id,
      role: 'assistant',
      content: aiResponse.answer,
      usage: aiResponse.usage,
      provider: aiResponse.provider,
      model: aiResponse.model,
      sources: aiResponse.sources,
    });

    if (
      chat.title === 'New Chat'
    ) {

      chat.title =
        await titleService.generate({
          message,
          provider: chat.provider,
        });

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