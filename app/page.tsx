import React, { Suspense } from 'react'
import ChatInterface from "@/components/ChatInterface";
export const  Home = async() => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    {/* <SideBar userChats={userChats}/> */}
<ChatInterface />
    </Suspense>
  )
}

export default Home