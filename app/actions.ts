import {users, chats} from "../lib/schema"
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
export const getUserChats =async (userId: string) => {
    const userImages = await db.select().from(chats).where(eq(images.userId, userId));
  return userImages; 
}