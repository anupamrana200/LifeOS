import Message from '../../models/message.model.js';

class HistoryService {
  async getHistory(chatId, limit = 10) {
    const messages = await Message.find({
      chat: chatId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .lean();

    return messages.reverse();
  }
}

export default new HistoryService();