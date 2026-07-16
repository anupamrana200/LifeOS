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
      maxlength: [150, 'Device name cannot exceed 150 characters.'],
    },
    browser: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, 'Browser cannot exceed 100 characters.'],
    },
    operatingSystem: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, 'Operating system cannot exceed 100 characters.'],
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
      maxlength: [45, 'IP address cannot exceed 45 characters.'],
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
      maxlength: [1024, 'User agent cannot exceed 1024 characters.'],
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Session expiration is required.'],
      index: true,
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

sessionSchema.index({ user: 1, isRevoked: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = model('Session', sessionSchema);

export default Session;
