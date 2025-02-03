'use server'

import { db as dexieDb  } from '@/lib/dexie'; 
import { users, chats } from "../lib/schema";
import { db } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const onboardUser = async (userId: string) => {
  try {
    
    if (!userId) {
      return null;
    }

    // Create default chats
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
      })
      .returning();
      console.log('newUser', newUser);
      
    // Return the ID of the Welcome chat as the default active chat
    return newUser[0].id;
  } catch (error) {
    console.error("Error onboarding user:", error);
    return null;
  }
};


export const getUserChats = async (userId: string) => {
  try {
    // Convert userId to number since it's defined as integer in schema
    
     // First check if user exists
     const userExists = await db
     .select({ id: users.id })
     .from(users)
     .where(eq(users.id, userId));
    console.log('userExists', userExists)
    
   if (userExists.length === 0) {
     return null;
   }
   
    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt));

    return userChats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return null;
  }
};

// Create a new chat
export const createChat = async (userId: any, chatName: string) => {
  try {
    
    if (!userId) {
      return null;
    }
    const newChat = await db
      .insert(chats)
      .values({
        name: chatName,
        userId: userId,
      })
      .returning();

    return newChat[0];
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

// delete multiple chats (non-http drivers do not support transactions)
export const deleteChatsSequentially = async (chatIds: number[], userId: string) => {
  if (!userId || chatIds.length === 0) {
    return null;
  }

  const deletedChats = [];

  for (const chatId of chatIds) {
    try {
      const deletedChat = await db
        .delete(chats)
        .where(
          eq(chats.id, chatId) && 
          eq(chats.userId, userId)
        )
        .returning();
        // Delete associated messages from Dexie
      await dexieDb.deleteAllMessagesInChat(chatId);
      if (deletedChat[0]) {
        deletedChats.push(deletedChat[0]);
      }
      revalidatePath('/')
      
    } catch (error) {
      console.error(`Error deleting chat ${chatId}:`, error);
    }
  }
  console.log('deletedChats', deletedChats)
  

  return deletedChats;
};

// Update chat name
export const updateChatName = async (chatId: number, userId: string, newName: string) => {
  try {
    if (!userId) {
      return null;
    }

    const updatedChat = await db
      .update(chats)
      .set({ name: newName })
      .where(
        eq(chats.id, chatId) && 
        eq(chats.userId, userId)
      )
      .returning();

    return updatedChat[0];
  } catch (error) {
    console.error("Error updating chat name:", error);
    return null;
  }
};

// Get a single chat by ID
export const getChatById = async (chatId: any, userId: any) => {
  try {
    if (!userId) {
      return null;
    }

    const chat = await db
      .select()
      .from(chats)
      .where(
        eq(chats.id, chatId) && 
        eq(chats.userId, userId)
      );
    console.log('chat', chat)
        
    return chat[0];
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
};