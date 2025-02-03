"use client";

import { useState, useEffect, useCallback, FormEvent, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, type ChatMessage } from "@/lib/dexie";
import { streamChat } from "@/utils/streamChatting";
import { generateUUID } from "@/utils/generateUUID";
import ChatMessageItem from "./ChatMessageItem";
import InputForm from "./InputForm";

export default function ChatInterface() {
  const { chatID } = useParams();
  console.log('chatID', typeof chatID);
  
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([]);

  // Fetch messages when chatID changes
  useEffect(() => {
    if (!chatID) {
      console.log('none');
      return};

    const fetchMessages = async () => {
      try {
        const messages = await db.getMessagesForChat(chatID);
        console.log('messages', messages);
        
        setDbMessages(messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    };

    fetchMessages();
  }, [chatID]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        // Generate a temporary local ID if no chatID exists
        const tempChatId = chatID || generateUUID();
        
        const userMessage: ChatMessage = {
          role: "user",
          content: input.trim(),
          timestamp: new Date(),
          chatId: tempChatId,
        };

        // Add user message to Dexie and update local state
        const userMessageId = await db.chatMessages.add(userMessage);
        setDbMessages(prev => [...prev, { ...userMessage, id: userMessageId }]);
        setInput("");

        const stream = await streamChat(input);
        if (!stream) {
          throw new Error("Failed to get response stream");
        }

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        // Create a temporary assistant message
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: "",
          timestamp: new Date(),
          chatId: tempChatId,
        };
        
        // Add initial assistant message and update local state
        const messageId = await db.chatMessages.add(assistantMessage);
        setDbMessages(prev => [...prev, { ...assistantMessage, id: messageId }]);

        // Stream the response
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;
          
          // Update both Dexie and local state with the accumulated response
          await db.chatMessages.update(messageId, {
            content: accumulatedResponse,
          });
          
          setDbMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: accumulatedResponse }
                : msg
            )
          );
        }

        // If this is a new chat, create it in NeonDB and update all messages with the new chatId
        if (!chatID) {
          // const newNeonChatId = await createChat(user.id, accumulatedResponse);
          const newNeonChatId = await fetch('/api/createChat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: accumulatedResponse,
            }),
          })
          console.log('newNeonChatId.id', newNeonChatId.id);
          // Update all messages in Dexie with the new chatId
          const messagesToUpdate = await db.chatMessages.where('chatId').equals(tempChatId).toArray();
          
          await Promise.all(messagesToUpdate.map(msg =>
            db.chatMessages.update(msg.id!, {
              chatId: newNeonChatId.id
            })
          ));

          // Update local state with new chatId
          setDbMessages(prev => 
            prev.map(msg => ({
              ...msg,
              chatId: newNeonChatId.id
            }))
          );
// revalidatePath('/')
          // Redirect to the new chat URL
          router.push(`/${newNeonChatId.id}`);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, chatID, user]
  );

  return (
    <div className="p-4  relative h-screen flex flex-col md:ml-64">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {dbMessages.length === 0 ? (
          <div className="p-4 text-gray-500 flex justify-center">Hi.</div>
        ) : (
          dbMessages.map((m: ChatMessage, index: number) => (
            <Suspense key={m.id || index} fallback={<div>Loading...</div>}>
              <ChatMessageItem key={m.id || index} message={m} />
            </Suspense>
          ))
        )}
      </div>

      <InputForm
        input={input}
        isLoading={isLoading}
        setInput={setInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}