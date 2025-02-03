// app/[chatID]/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from 'react';
import { getChatById } from "../actions";

interface ChatLayoutProps {
  children: React.ReactNode;
  params: { chatID: string }; // Define the params type
}

export default async function ChatLayout({ children, params }: ChatLayoutProps) {
  // Log the chatID
  console.log('Chat ID ass:', params.chatID);
  const session = await auth();
  console.log('signed in, top level session', session);

  if (!session.userId) {
    return redirect("/sign-in");
  }
    // Check if chatID exists in userChats
    console.log('params.chatID', params.chatID);
    const chatExists = await getChatById(params.chatID, session?.userId);
    // const chatExists = userChats?.some(chat => String(chat.id) === params.chatID);
    console.log('chatExists', chatExists);
    
    if (!chatExists) {
      return redirect('/'); // Redirect if chatID is not found
    }
  return (
    <div className="flex flex-col h-screen w-full">
      {children}
    </div>
  );
}
