// app/[chatID]/layout.tsx
import { redirect } from "next/navigation";
import React from 'react';
import { getChatById, getUser } from "../actions";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ chatID: string }>
}
 
interface ChatLayoutProps {
  children: React.ReactNode;
  params: { chatID: string }; // Define the params type
}

export default async function ChatLayout({ children, params }: ChatLayoutProps) {
  const userID = await getUser();

  if (!userID) {
    return redirect("/sign-in");
  }
    console.log('params.chatID', params.chatID);
    const chatExists = await getChatById(params.chatID, userID);
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


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userID = await getUser();

    // Check if chatID exists in userChats
    const chatID = (await params).chatID
    const chat = await getChatById(chatID, userID);
  return {
    title: chat?.name,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  }
}