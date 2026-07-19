import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: 'New Chat',
      trim: true,
      maxlength: 120,
    },

    provider: {
      type: String,
      enum: ['openai', 'gemini'],
      required: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    userMessageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

chatSchema.index({
  owner: 1,
  updatedAt: -1,
});

export default mongoose.model(
  'Chat',
  chatSchema,
);
