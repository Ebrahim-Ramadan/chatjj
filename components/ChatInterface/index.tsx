"use client";

import { useState, useEffect, useCallback, FormEvent, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, type ChatMessage } from "@/lib/dexie";
import { streamChat } from "@/utils/streamChatting";
import { generateUUID } from "@/utils/generateUUID";
import ChatMessageItem from "./ChatMessageItem";
import InputForm from "./InputForm";
import UnlimitedMessages from "../UnlimitedUsages";

export default function ChatInterface() {
  let { chatID } = useParams();
  console.log('chatID', typeof chatID);
  chatID = parseInt(chatID, 10)
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([]);

  // Fetch messages when chatID changes
  useEffect(() => {
    if (!chatID) {
      console.log('none');
      return;
    }

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

        // Optimistically add user message to Dexie and update local state
        const userMessageId = await db.chatMessages.add(userMessage);
        setDbMessages(prev => [...prev, { ...userMessage, id: userMessageId }]);
        setInput("");

        const stream = await streamChat(input);
        if (!stream) {
          throw new Error("Failed to get response stream");
        }

        // Start the createChat API call in parallel with the streaming
        const chatCreationPromise = chatID
          ? Promise.resolve(null) // No need to create chat if chatID exists
          : fetch('/api/createChat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: input.trim() }),
            }).then(res => res.json());

        // Stream the response and update Dexie as the message is received
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
        
        // Optimistically add assistant message to Dexie and update local state
        const messageId = await db.chatMessages.add(assistantMessage);
        setDbMessages(prev => [...prev, { ...assistantMessage, id: messageId }]);

        // Stream the response
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;
          
          // Update Dexie and local state with accumulated response
          await db.chatMessages.update(messageId, { content: accumulatedResponse });
          setDbMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, content: accumulatedResponse } : msg));
        }

        // Wait for chat creation if needed
        const { id: newChatId } = await chatCreationPromise;

        if (newChatId) {
          // Update all messages with the new chatId
          const messagesToUpdate = await db.chatMessages.where('chatId').equals(tempChatId).toArray();
          await Promise.all(messagesToUpdate.map(msg => db.chatMessages.update(msg.id!, { chatId: newChatId })));

          // Update local state with new chatId
          setDbMessages(prev => prev.map(msg => ({ ...msg, chatId: newChatId })));
          router.push(`/${newChatId}`);
          router.refresh();
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, chatID]
  );

  return (
    <div className="p-4 relative h-screen flex flex-col md:ml-64 lg:px-56 md:px-24">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {dbMessages.length === 0 ? (
          <div className="p-4  flex justify-center w-full flex-col items-center mt-36 gap-4">
            <p className="text-neutral-400 text-center text-xl font-semibold">
            Hi!
            </p>
          <UnlimitedMessages/>

          </div>
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
