// This is a simple in-memory database for demonstration purposes
// In a production app, you would use a real database like PostgreSQL, MongoDB, etc.

interface TelegramUser {
  userId: string;
  telegramChatId: string;
  createdAt: Date;
  lastActive: Date;
}

// In-memory storage
const telegramUsers: TelegramUser[] = [];

// Simple database operations
export const db = {
  telegramUsers: {
    // Find a user by userId
    findUnique: async ({ where }: { where: { userId: string } }) => {
      return telegramUsers.find(user => user.userId === where.userId) || null;
    },
    
    // Find a user by telegramChatId
    findFirst: async ({ where }: { where: { telegramChatId: string } }) => {
      return telegramUsers.find(user => user.telegramChatId === where.telegramChatId) || null;
    },
    
    // Create or update a user
    upsert: async ({ 
      where, 
      update, 
      create 
    }: { 
      where: { userId: string }, 
      update: Partial<TelegramUser>, 
      create: TelegramUser 
    }) => {
      const existingUserIndex = telegramUsers.findIndex(user => user.userId === where.userId);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        telegramUsers[existingUserIndex] = {
          ...telegramUsers[existingUserIndex],
          ...update,
        };
        return telegramUsers[existingUserIndex];
      } else {
        // Create new user
        telegramUsers.push(create);
        return create;
      }
    },
    
    // Get all users
    findMany: async () => {
      return [...telegramUsers];
    }
  }
};

// For debugging
export function getAllTelegramUsers() {
  return [...telegramUsers];
} 