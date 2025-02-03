'use server'
'server only'

import { users, chats } from "../lib/schema";
import { db } from "@/lib/drizzle";
import { eq, desc, and  } from "drizzle-orm";
import { generateChatName } from "@/utils/generateChatName";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";



export const getUserId = async()=> {
  const cookieStore = cookies();
  const userId = await cookieStore.get('userID')?.value;
  return userId;
}

export async function createUserSession(userId: string ) {
  const cookieStore = cookies();
  cookieStore.set('userID', userId, {
    maxAge:60 * 60 * 24 * 30 , 
    path: '/',
    httpOnly: true,
  });
  revalidatePath("/");
  return true;
}
export const getUserById = async (userId: any | number) => {
  console.log('id', userId);
  
  try {
    // const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (!userId) {
      console.error('Invalid user ID:', userId);
      return null;
    }
    const data = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId));

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('userID');
  revalidatePath("/");
  return true;
}
export const getUser = async () => {
  const userId = await getUserId();
  console.log("User ID:", userId); // Debugging

  if (!userId) return null;

  const user = await getUserById(userId);
  console.log("User:", user); // Debugging

  if (user) return user;

  await logout();
  return null;
};


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