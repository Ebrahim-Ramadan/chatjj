// app/[chatID]/layout.tsx

import React from 'react'
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    
    <div className="flex flex-col h-screen w-full">
      {children}
      {/* <SideBar userChats={userChats} /> */}
    </div>
  );
}