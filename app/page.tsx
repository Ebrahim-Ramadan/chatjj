
import React, { Suspense } from 'react'
import ChatInterface from "@/components/ChatInterface";
import LoadingDots from '@/components/LoadingComponent';
export const  Home = async() => {
  return (
    <Suspense fallback={<LoadingDots/>}>
<ChatInterface />

    </Suspense>
  )
}

export default Home