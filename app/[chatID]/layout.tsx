// app/[chatID]/layout.tsx
import React from 'react';

 
interface ChatLayoutProps {
  children: React.ReactNode;
  params: { chatID: string }; // Define the params type
}

export default async function ChatLayout({ children, params }: ChatLayoutProps) {
 
  return (
    <div className="flex flex-col h-screen w-full">
      {children}
    </div>
  );
}


