import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Send a notification to a Telegram user
 */
export async function sendTelegramNotification(chatId: string, message: string): Promise<boolean> {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
}

/**
 * Notify a website user via Telegram
 */
export async function notifyUser(userId: string, message: string): Promise<boolean> {
  try {
    // Import dynamically to avoid circular dependencies
    const { getUserTelegramChatId } = await import('./telegram-auth');
    
    const chatId = await getUserTelegramChatId(userId);
    
    if (!chatId) {
      console.error(`No Telegram chat linked for user ${userId}`);
      return false;
    }
    
    return sendTelegramNotification(chatId, message);
  } catch (error) {
    console.error('Error notifying user via Telegram:', error);
    return false;
  }
} 