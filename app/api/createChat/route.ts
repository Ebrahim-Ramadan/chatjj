import { generateChatName } from "@/utils/generateChatName";
import { db } from "@/lib/drizzle";
import {  chats } from "@/lib/schema";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getUser } from "@/app/actions";

export async function POST(req: Request) {
  const {  accumulatedResponse } = await req.json();
const userId: any = await getUser();
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
          
          revalidatePath('/')
          revalidateTag('CreateNewChat')
        return NextResponse.json(newChat[0]);
      } catch (error) {
        console.error("Error creating chat:", error);
        return new NextResponse(null, { status: 500 });
      }
}