import Chat from '../../models/chat.model.js';

class ChatService {
  async create({
    owner,
    model,
    provider,
  }) {
    return Chat.create({
      owner,
      model,
      provider,
    });
  }

  async getAll(owner) {
    return Chat.find({ owner })
      .sort({
        updatedAt: -1,
      });
  }

  async getById({
    chatId,
    owner,
  }) {
    return Chat.findOne({
      _id: chatId,
      owner,
    });
  }

  async delete({
    chatId,
    owner,
  }) {
    const chat = await Chat.findOne({
      _id: chatId,
      owner,
    });

    if (!chat) {
      return null;
    }

    await chat.deleteOne();

    return true;
  }
}

export default new ChatService();
