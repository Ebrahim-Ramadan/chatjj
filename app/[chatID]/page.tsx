import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from 'react'
import {getUserChats, onboardUser} from '@/app/actions'
import { revalidatePath } from "next/cache";
import ChatInterface from "@/components/ChatInterface";

export const  Home = async() => {
  const session = await auth();
console.log('signed in, top level session', session)

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const userChats = await getUserChats(session.userId)
  console.log('userChats', userChats)

  if (!userChats) {
    return (
      <form
        action={async () => {
          "use server";
          const session = await auth();
          console.log('<chat> session', session)
          
          if (!session.userId) {
            return redirect("/sign-in");
          }

          const newUserID = await onboardUser(session.userId);
          revalidatePath('/')
          return redirect(`/f/${newUserID}`);
        }}
      >
        <button>Create new Chat</button>
      </form>
    );
  }
  return (
    <>
    {/* <SideBar userChats={userChats}/> */}
<ChatInterface />
    </>
  )
}

export default Home