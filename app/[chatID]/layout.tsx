import ChatInterface from "@/components/NewChat";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getChatById } from "../actions";

export default async function  HomePage(props: { children: React.ReactNode, params: { chatID: string } }) {
   const session = await auth();
   console.log('signed in, top level session', session)

   if (!session.userId) {
     return redirect("/sign-in");
   }
   const chat = await getChatById(props.params.chatID, session.userId);
   if (!chat) {
     return redirect(`/`);
   }
    return (
      <ChatInterface />
    );
  }