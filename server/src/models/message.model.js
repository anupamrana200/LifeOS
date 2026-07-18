import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },

    score: Number,
  },
  {
    _id: false,
  },
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    usage: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    provider: String,

    model: String,

    sources: [sourceSchema],
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  chat: 1,
  createdAt: 1,
});

export default mongoose.model(
  'Message',
  messageSchema,
);