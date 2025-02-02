import { users, chats } from "../lib/schema";
import { db } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";


export const getUserChats = async (userId: string) => {
  try {
    // Convert userId to number since it's defined as integer in schema
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      throw new Error("Invalid user ID format");
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userIdNum))
      .orderBy(desc(chats.createdAt));

    return userChats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
};

// Create a new chat
export const createChat = async (userId: string, chatName: string) => {
  try {
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      throw new Error("Invalid user ID format");
    }
    const newChat = await db
      .insert(chats)
      .values({
        name: chatName,
        userId: userIdNum,
      })
      .returning();

    return newChat[0];
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

// Delete a chat
export const deleteChat = async (chatId: number, userId: string) => {
  try {
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      throw new Error("Invalid user ID format");
    }

    const deletedChat = await db
      .delete(chats)
      .where(
        eq(chats.id, chatId) && 
        eq(chats.userId, userIdNum)
      )
      .returning();

    return deletedChat[0];
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

// Update chat name
export const updateChatName = async (chatId: number, userId: string, newName: string) => {
  try {
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      throw new Error("Invalid user ID format");
    }

    const updatedChat = await db
      .update(chats)
      .set({ name: newName })
      .where(
        eq(chats.id, chatId) && 
        eq(chats.userId, userIdNum)
      )
      .returning();

    return updatedChat[0];
  } catch (error) {
    console.error("Error updating chat name:", error);
    throw error;
  }
};

// Get a single chat by ID
export const getChatById = async (chatId: number, userId: string) => {
  try {
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      throw new Error("Invalid user ID format");
    }

    const chat = await db
      .select()
      .from(chats)
      .where(
        eq(chats.id, chatId) && 
        eq(chats.userId, userIdNum)
      );

    return chat[0];
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};