"use client";

import { useState, useEffect, useCallback, FormEvent, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
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
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([]); 
  const [newChatId, setNewChatId] = useState<string | null>(null);

  // Fetch messages when chatID changes
  useEffect(() => {
    if (!chatID) return;

    const fetchMessages = async () => {
      try {
        const messages = await db.getMessagesForChat(chatID);
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
        const userMessage: ChatMessage = {
          role: "user",
          content: input.trim(),
          timestamp: new Date(),
          chatId: chatID || newChatId,
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
          chatId: chatID || newChatId,
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

        // Save chat to NeonDB if it's a new chat
        if (user && !chatID) {
          await createChat(user.id, input.trim());
        }

        // Redirect for new chats
        if (!chatID && newChatId) {
          router.push(`/${newChatId}`);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, chatID, newChatId, user, router]
  );

  return (
    <div className="p-4 sm:ml-64 relative h-screen flex flex-col">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {dbMessages.length === 0 ? (
          <div className="p-4 text-gray-500">No messages found.</div>
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