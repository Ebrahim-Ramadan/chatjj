"use client";

import { useState, useEffect, useCallback, FormEvent, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type ChatMessage } from "@/lib/dexie";
import { streamChat } from "@/utils/streamChatting";
import { generateUUID } from "@/utils/generateUUID";
import ChatMessageItem from "./ChatMessageItem";
import InputForm from "./InputForm";
import { createChat } from "@/app/actions";
import { useUser } from "@clerk/nextjs";


export default function ChatInterface() {
  const { chatID } = useParams();
  const router = useRouter();
  const chatId = chatID ? parseInt(chatID as string, 10) : null;
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentChatId = chatId ? chatId : generateUUID();

  useEffect(() => {
    if (!chatID) {
      router.push(`/${currentChatId}`);
    }
  }, [chatID, currentChatId, router]);

  const dbMessages = useLiveQuery(
    async () => {
      // if (chatId === null) return [];
      try {
        return await db.chatMessages.where("chatId").equals(currentChatId).toArray();
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        return [];
      }
    },
    [chatId],
    []
  );
  console.log('dbMessages', dbMessages)
  

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
  
      setIsLoading(true);
      setError(null);
  
      try {
        const userMessage: ChatMessage = {
          role: "user",
          content: input.trim(),
          timestamp: new Date(),
          chatId: currentChatId,
        };
  
        await db.chatMessages.add(userMessage);
        setInput("");
  
        const stream = await streamChat(input);
        console.log('stream', stream);
        
        if (!stream) {
          throw new Error("Failed to get response stream");
        }
        
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";
  
          // Create a temporary assistant message in the local database
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: "", // Start with empty content
          timestamp: new Date(),
          chatId: currentChatId,
        };
        const messageId = await db.chatMessages.add(assistantMessage);

        // Stream the response in real-time
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append it to the accumulated response
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
      }
      // Update the assistant's message in the local database when done
      await db.chatMessages.update(messageId, {
        content: accumulatedResponse,
      });
      // After the stream is complete, save the chat to Neon
      if (!chatId) {
        const { user } = useUser()
        // await createChat(user.id, input.trim()); // Use the first message as the chat name
      }
        
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, chatId]
  );

  return (
    <div className="p-4 sm:ml-64 relative h-screen flex flex-col">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">{error}</div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {dbMessages === undefined ? (
          <div className="p-4 text-gray-500">Loading messages...</div>
        ) : (
          dbMessages.map((m: ChatMessage, index: number) => (
            <Suspense key={m.id || index} fallback={<div>Loading...</div>}>
            <ChatMessageItem key={m.id || index} message={m} />
            </Suspense>
          ))
        )}
      </div>

      {/* Input Form with Send Button */}
      <InputForm
        input={input}
        isLoading={isLoading}
        setInput={setInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}