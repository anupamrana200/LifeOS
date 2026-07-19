import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
      index: true,
    },
    hashedRefreshToken: {
      type: String,
      required: [true, 'Hashed refresh token is required.'],
      select: false,
    },
    deviceName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [2048, 'Device name cannot exceed 150 characters.'],
    },
    browser: {
      type: String,
      trim: true,
      default: null,
      maxlength: [2048, 'Browser cannot exceed 100 characters.'],
    },
    operatingSystem: {
      type: String,
      trim: true,
      default: null,
      maxlength: [2048, 'Operating system cannot exceed 100 characters.'],
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
      maxlength: [512, 'IP address cannot exceed 45 characters.'],
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
      maxlength: [4096, 'User agent cannot exceed 1024 characters.'],
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Session expiration is required.'],
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Active sessions for a user.
sessionSchema.index({ user: 1, isRevoked: 1 });

// Automatically remove expired sessions.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = model('Session', sessionSchema);

export default Session;
