"use client";

import { useState, useEffect, useCallback, FormEvent, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, type ChatMessage, type Chat } from "@/lib/dexie"; // Import Chat type
import { streamChat } from "@/utils/streamChatting"; // Updated import
import { generateUUID } from "@/utils/generateUUID";
import ChatMessageItem from "./ChatMessageItem";
import InputForm from "./InputForm";
import UnlimitedMessages from "../UnlimitedUsages";

export default function ChatInterface() {
  const { chatID } = useParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  // Fetch chat and messages when chatID changes
  useEffect(() => {
    // if (!chatID) {
    //   console.log('none');
    //   return;
      
    // };

    const fetchChatAndMessages = async () => {
      try {
        const messages = await db.getMessagesForChat(parseInt(chatID, 10));
        console.log('messages', messages);
        setDbMessages(messages);
      } catch (err) {
        console.error("Error fetching chat or messages:", err);
        setError("Failed to load chat or messages");
      }
    };

    fetchChatAndMessages();
  }, [chatID]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
  
      setIsLoading(true);
      setError(null);
  
      try {
        let chatId;
        if (!chatID) {
          // Create a new chat
          const newChatId = await db.addChat("New Chat"); // Default name
          chatId = newChatId;
          setCurrentChat({ id: newChatId, name: "New Chat", timestamp: new Date() });
        } else {
          chatId = parseInt(chatID, 10);
        }
  
        // Check if the chatID exists
        const existingChat = await db.getChatById(chatId);
        if (!existingChat) {
          // If the chat doesn't exist, return an error
          setError("Invalid chat ID");
          setIsLoading(false);
          return;
        }
  
        // Add user message to Dexie
        const userMessage: ChatMessage = {
          role: "user",
          content: input.trim(),
          timestamp: new Date(),
          chatId: chatId,
        };
        const userMessageId = await db.chatMessages.add(userMessage);
        setDbMessages((prev) => [...prev, { ...userMessage, id: userMessageId }]);
        setInput("");
  
        // Create a temporary assistant message
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: "",
          timestamp: new Date(),
          chatId: chatId,
        };
        const messageId = await db.chatMessages.add(assistantMessage);
        setDbMessages((prev) => [...prev, { ...assistantMessage, id: messageId }]);
  
        // Stream the assistant's response
        let accumulatedResponse = "";
        await streamChat(input, (chunk) => {
          accumulatedResponse += chunk;
  
          // Update Dexie and local state with accumulated response
          setDbMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, content: accumulatedResponse } : msg
            )
          );
        });
        db.chatMessages.update(messageId, { content: accumulatedResponse });
        router.push(`/${chatId}`);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, chatID, router]
  );

  return (
    <div className="p-4 relative h-screen flex flex-col md:ml-64 lg:px-56 md:px-24">
    

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {dbMessages.length === 0 ? (
          <div className="p-4 flex justify-center w-full flex-col items-center mt-36">
            <UnlimitedMessages />
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