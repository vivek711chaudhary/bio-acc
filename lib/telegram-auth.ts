import connectToDatabase from './mongodb';
import { TelegramUser } from './models/TelegramUser';

/**
 * Link a website user to a Telegram chat
 */
export async function linkUserToTelegram(userId: string, telegramChatId: string): Promise<boolean> {
  try {
    // Wait for the connection to be established
    await connectToDatabase();
    
    // Update or create the user
    const result = await TelegramUser.findOneAndUpdate(
      { userId },
      { 
        userId,
        telegramChatId,
        lastActive: new Date()
      },
      { upsert: true, new: true }
    );
    
    return !!result;
  } catch (error) {
    console.error('Error linking user to Telegram:', error);
    return false;
  }
}

/**
 * Get a user's Telegram chat ID
 */
export async function getUserTelegramChatId(userId: string): Promise<string | null> {
  try {
    await connectToDatabase();
    
    const user = await TelegramUser.findOne({ userId });
    return user?.telegramChatId || null;
  } catch (error) {
    console.error('Error getting user Telegram chat ID:', error);
    return null;
  }
}

/**
 * Get a website user ID from a Telegram chat ID
 */
export async function getUserIdFromTelegramChatId(telegramChatId: string): Promise<string | null> {
  try {
    await connectToDatabase();
    
    const user = await TelegramUser.findOne({ telegramChatId });
    return user?.userId || null;
  } catch (error) {
    console.error('Error getting user ID from Telegram chat ID:', error);
    return null;
  }
}

/**
 * Get all linked Telegram users (for debugging)
 */
export async function getAllLinkedUsers() {
  try {
    await connectToDatabase();
    
    return await TelegramUser.find({}).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting all linked users:', error);
    return [];
  }
}