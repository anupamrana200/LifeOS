import mongoose from 'mongoose';

import env from './env.js';

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not configured. Add it to your .env file.');
  }

  await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export default connectDB;
