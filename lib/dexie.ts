import Dexie, { type Table } from "dexie"

export interface ChatMessage {
  id?: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
  chatId: any
}

export class MyDatabase extends Dexie {
  chatMessages!: Table<ChatMessage>

  constructor() {
    super("chatMessages")
    this.version(1).stores({
      chatMessages: "++id, role, chatId, timestamp",
    })
  }

  // Delete a single message by its ID
  async deleteMessage(messageId: number) {
    await this.chatMessages.delete(messageId)
  }

  // Delete all messages in a specific chat
  async deleteAllMessagesInChat(chatId: any) {
    console.log('deleteAllMessagesInChat');
    
    await this.chatMessages.where('chatId').equals(chatId).delete()
    return true
  }

  // Delete multiple messages by their IDs
  async deleteMultipleMessages(messageIds: number[]) {
    await this.chatMessages.bulkDelete(messageIds)
  }

  // Get all messages for a specific chat
  async getMessagesForChat(chatId: any) {
    const numericChatId = typeof chatId === 'string' ? parseInt(chatId, 10) : chatId;
    return await this.chatMessages.where('chatId').equals(numericChatId).toArray()
  }

  // Update a message's content
  async updateMessageContent(messageId: number, newContent: string) {
    await this.chatMessages.update(messageId, { content: newContent })
  }

  // Get the latest message in a chat
  async getLatestMessageInChat(chatId: number) {
    return await this.chatMessages
      .where('chatId')
      .equals(chatId)
      .reverse()
      .first()
  }

  // Get chats with their latest messages
  async getChatsWithLatestMessages() {
    const allMessages = await this.chatMessages.toArray()
    const chatMap = new Map<number, ChatMessage>()

    allMessages.forEach(message => {
      const existingMessage = chatMap.get(message.chatId)
      if (!existingMessage || message.timestamp > existingMessage.timestamp) {
        chatMap.set(message.chatId, message)
      }
    })

    return Array.from(chatMap.values())
  }
}

export const db = new MyDatabase()
