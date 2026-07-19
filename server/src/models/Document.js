import mongoose from 'mongoose';
import {
  DOCUMENT_CATEGORIES,
  AI_STATUS,
} from '../constants/document.constants.js';

const { Schema, model } = mongoose;

const documentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Document owner is required.'],
    },

    title: {
      type: String,
      required: [true, 'Document title is required.'],
      trim: true,
      minlength: [2, 'Document title must be at least 2 characters long.'],
      maxlength: [1024, 'Document title cannot exceed 200 characters.'],
    },

    category: {
      type: String,
      required: [true, 'Document category is required.'],
      enum: DOCUMENT_CATEGORIES,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [4096, 'Description cannot exceed 2000 characters.'],
      default: null,
    },

    originalFileName: {
      type: String,
      required: [true, 'Original file name is required.'],
      trim: true,
    },

    storedFileName: {
      type: String,
      required: [true, 'Stored file name is required.'],
      trim: true,
    },

    storagePath: {
      type: String,
      required: [true, 'Storage path is required.'],
      trim: true,
    },

    mimeType: {
      type: String,
      required: [true, 'MIME type is required.'],
      trim: true,
      lowercase: true,
    },

    fileSize: {
      type: Number,
      required: [true, 'File size is required.'],
      min: [0, 'File size cannot be negative.'],
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    tags: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    aiStatus: {
      type: String,
      enum: AI_STATUS,
      default: 'pending',
    },

    aiResult: {
      type: Schema.Types.Mixed,
      default: null,
    },

    aiMetadata: {
      type: Schema.Types.Mixed,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Query optimization indexes
documentSchema.index({ owner: 1 });
documentSchema.index({ owner: 1, category: 1 });
documentSchema.index({ owner: 1, aiStatus: 1 });
documentSchema.index({ owner: 1, expiryDate: 1 });

const Document = model('Document', documentSchema);

export default Document;
