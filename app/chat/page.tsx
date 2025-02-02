import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from 'react'
import {getUserChats, onboardUser} from '@/app/actions'
export const  Home = async() => {
  const session = await auth();
console.log('top level session', session)

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const userChats = await getUserChats(session.userId)
  console.log('userChats', userChats)

  if (!userChats || userChats.length === 0) {
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

          return redirect(`/f/${newUserID}`);
        }}
      >
        <button>Create new Chat</button>
      </form>
    );
  }
  return (
    <div>{userChats.map((chat) => <p key={chat.id}>{chat.name}</p>)}</div>
  )
}

export default Home