import Dexie, { type Table } from "dexie"

export interface ChatMessage {
  id?: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
  chatId: any
}

export interface Chat {
  id?: number
  timestamp: Date
  name: string
}

export class MyDatabase extends Dexie {
  chatMessages!: Table<ChatMessage>
  chats!: Table<Chat>

  constructor() {
    super("ChatDatabase")
    this.version(1).stores({
      chatMessages: "++id, role, chatId, timestamp",
      chats: "++id, timestamp, name"
    })
  }

  // Delete a single message by its ID
  async deleteMessage(messageId: number) {
    await this.chatMessages.delete(messageId)
  }

  // Delete all messages in a specific chat
  async deleteAllMessagesInChat(chatId: number) {
    await this.chatMessages.where('chatId').equals(chatId).delete()
  }

  // Delete multiple messages by their IDs
  async deleteMultipleMessages(messageIds: number[]) {
    await this.chatMessages.bulkDelete(messageIds)
  }

  async getMessagesForChat(chatId: number) {
    return await this.chatMessages.filter((message) => message.chatId === chatId).toArray();
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

  // Add a new chat
  async addChat(name: string) {
    const id = await this.chats.add({
      name,
      timestamp: new Date()
    })
    return id
  }

  // Delete a chat and all its messages
  async deleteChat(chatId: number) {
    await this.chats.delete(chatId)
    await this.deleteAllMessagesInChat(chatId)
  }

  // Delete multiple chats and all their messages
  async deleteMultipleChats(chatIds: number[]) {
    await this.transaction('rw', this.chats, this.chatMessages, async () => {
      // Delete all messages associated with the chats
      await this.chatMessages.where('chatId').anyOf(chatIds).delete();
      // Delete the chats themselves
      await this.chats.bulkDelete(chatIds);
    });
  }

  // Update a chat's name
  async updateChatName(chatId: number, newName: string) {
    await this.chats.update(chatId, { name: newName })
  }

  // Get all chats
  async getAllChats() {
    return await this.chats.toArray()
  }

  // Get a specific chat by its ID
  async getChatById(chatId: number) {
    return await this.chats.get(chatId)
  }
}

export const db = new MyDatabase()