import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from 'react'
import { getUserChats, onboardUser } from '@/app/actions'
import { revalidatePath } from "next/cache";
import ChatInterface from "@/components/ChatInterface";
import {db} from '@/lib/dexie'
interface PageProps {
  params: { chatID: string };
}

export const Home = async ({ params }: PageProps) => {
  const session = await auth();
  console.log('signed in, top level session', session);

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const userChats = await getUserChats(session.userId);
  console.log('userChats', userChats);

  // if (!userChats || userChats.length === 0) {
  //   return (
  //     <form
  //       action={async () => {
  //         "use server";
  //         const session = await auth();
  //         console.log('<chat> session', session);

  //         if (!session.userId) {
  //           return redirect("/sign-in");
  //         }

  //         const newUserID = await onboardUser(session.userId);
  //         revalidatePath('/');
  //         return redirect(`/f/${newUserID}`);
  //       }}
  //     >
  //       <button>Create new Chat</button>
  //     </form>
  //   );
  // }

  // Check if chatID exists in userChats
  console.log('params.chatID', params.chatID);
  
  const chatExists = userChats?.some(chat => String(chat.id) === params.chatID);
  console.log('chatExists', chatExists);
  
  if (!chatExists) {
    return redirect('/'); // Redirect if chatID is not found
  }

  return (
    <>
      {/* <SideBar userChats={userChats}/> */}
      <ChatInterface />
    </>
  );
};

export default Home;
