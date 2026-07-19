import Message from '../../models/message.model.js';
import { toMessageResponse } from '../../serializers/chat.serializer.js';

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

    return messages.reverse().map(toMessageResponse);
  }
}

export default new HistoryService();
