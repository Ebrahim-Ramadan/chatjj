import React, { Suspense } from 'react'
import ChatInterface from "@/components/ChatInterface";
import { DeleteChatsWrapper } from '@/components/DeleteChatsWraper';
export const  Home = async() => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    {/* <SideBar userChats={userChats}/> */}
<ChatInterface />
<DeleteChatsWrapper  userID='' />

    </Suspense>
  )
}

export default Home