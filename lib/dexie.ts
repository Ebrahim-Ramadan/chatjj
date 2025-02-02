import Dexie, { Table } from 'dexie';

// Define interfaces for our data types
export interface Message {
  id?: number;
  chatId: number;
  content: string;
  role: 'user' | 'bot';
  timestamp: Date;
}

export interface Chat {
  id?: number;
  name: string;
  createdAt: Date;
}

// Define the database
class ChatDatabase extends Dexie {
  chats!: Table<Chat, number>;
  messages!: Table<Message, number>;

  constructor() {
    super('ChatDatabase');
    
    this.version(1).stores({
      chats: '++id, name, createdAt',
      messages: '++id, chatId, role, timestamp'
    });
  }
}

// Create database instance
export const db = new ChatDatabase();

// Database operations
export const dbOperations = {
  // Chat operations
  createChat: async (name: string): Promise<number> => {
    return await db.chats.add({
      name,
      createdAt: new Date()
    });
  },

  getAllChats: async (): Promise<Chat[]> => {
    return await db.chats.orderBy('createdAt').reverse().toArray();
  },

  deleteChat: async (chatId: number): Promise<void> => {
    await db.transaction('rw', [db.chats, db.messages], async () => {
      await db.messages.where('chatId').equals(chatId).delete();
      await db.chats.delete(chatId);
    });
  },

  // Message operations
  addMessage: async (chatId: number, content: string, role: 'user' | 'bot'): Promise<number> => {
    return await db.messages.add({
      chatId,
      content,
      role,
      timestamp: new Date()
    });
  },

  getChatMessages: async (chatId: number): Promise<Message[]> => {
    return await db.messages
      .where('chatId')
      .equals(chatId)
      // .orderBy('timestamp')
      .toArray();
  },

  deleteMessage: async (messageId: number): Promise<void> => {
    await db.messages.delete(messageId);
  },

  // Clear all data
  clearDatabase: async (): Promise<void> => {
    await db.transaction('rw', [db.chats, db.messages], async () => {
      await db.messages.clear();
      await db.chats.clear();
    });
  }
};