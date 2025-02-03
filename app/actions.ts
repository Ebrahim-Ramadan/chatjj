'use server'

import { users, chats } from "../lib/schema";
import { db } from "@/lib/drizzle";
import { eq, desc, and  } from "drizzle-orm";
import { generateChatName } from "@/utils/generateChatName";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


export const checkAuthentication = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userID')?.value;
console.log('userId', userId)

  if (!userId) {
    return false;
  }
  return userId;
};
export const getUser = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userID')?.value;

  if (!userId) {
    return false;
  }
  try {
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    return user.length > 0 ? user[0].id : false;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
};


export async function createUserSession(userId: string ) {
  const cookieStore = cookies();
  cookieStore.set('userID', userId, {
    maxAge:60 * 60 * 24 * 30 , 
    path: '/',
    httpOnly: true,
  });
  return true;
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('userID');
  revalidatePath("/");
  return true;
}



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
    
     // First check if user exists
     const userExists = await db
     .select({ id: users.id })
     .from(users)
     .where(eq(users.id, userId));
    console.log('userExists', userExists)
    
   if (userExists.length === 0) {
     return false;
   }
   
    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt));

    return userChats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return false;
  }
};

// Create a new chat
export const createChat = async (userId: any, accumulatedResponse: string) => {
  try {
    
    if (!userId) {
      return null;
    }
    const chatName = await generateChatName({chat:accumulatedResponse})
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
export const deleteChatsSequentially = async (
  chatId: any,
  userId: string
): Promise<any> => {
  try {
    // Input validation
    if (!userId || !chatId) {
      console.warn('Missing required parameters: userId or chatId');
      return null;
    }

    // Perform deletion with proper AND condition
    const deletedChat = await db
      .delete(chats)
      .where(
        and(
          eq(chats.id, chatId),
          eq(chats.userId, userId)
        )
      )
      .returning();

    // Log deletion for monitoring
    console.info(`Chat ${chatId} deleted for user ${userId}`);
    // revalidatePath('/')
    return deletedChat;
  } catch (error) {
    // Error handling
    console.error('Error deleting chat:', error);
    throw error;
  }
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