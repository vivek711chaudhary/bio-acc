import mongoose from 'mongoose';

// Define the schema
const TelegramUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    // unique: true,
  },
  telegramChatId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
export const TelegramUser = mongoose.models.TelegramUser || 
  mongoose.model('TelegramUser', TelegramUserSchema); 