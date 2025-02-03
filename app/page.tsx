import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { Suspense } from 'react'
import {getUserChats, onboardUser} from '@/app/actions'
import { revalidatePath } from "next/cache";
import ChatInterface from "@/components/ChatInterface";
export const  Home = async() => {
  const session = await auth();
console.log('signed in, top level session', session)

  // if (!session.userId) {
  //   return redirect("/sign-in");
  // }

  // const userChats = await getUserChats(session.userId)
  // console.log('userChats', userChats)

  // if (!userChats) {
  //   return (
  //     <form
  //       action={async () => {
  //         "use server";
  //         const session = await auth();
  //         console.log('<chat> session', session)
          
  //         if (!session.userId) {
  //           return redirect("/sign-in");
  //         }

  //         const newUserID = await onboardUser(session.userId);
  //         revalidatePath('/')
  //         return redirect(`/`);
  //       }}
  //     >
  //       <button>Create new Chat</button>
  //     </form>
  //   );
  // }
  return (
    <Suspense fallback={<div>Loading...</div>}>
    {/* <SideBar userChats={userChats}/> */}
<ChatInterface />
    </Suspense>
  )
}

export default Home