"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type ChatMessage } from "@/lib/dexie";
import { streamChat } from "@/utils/streamChatting";
import { generateUUID } from "@/utils/generateUUID";
import ChatMessageItem from "./ChatMessageItem";
import InputForm from "./InputForm";

export default function ChatInterface() {
  const { chatID } = useParams();

  const chatId = chatID ? parseInt(chatID as string, 10) : null;
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dbMessages = useLiveQuery(
    async () => {
      if (chatId === null) return [];
      try {
        return await db.chatMessages.where("chatId").equals(chatId).toArray();
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        return [];
      }
    },
    [chatId],
    []
  );

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
          chatId: chatId ? chatId : generateUUID(),
        };

        await db.chatMessages.add(userMessage);
        setInput("");

        const stream = await streamChat(input);
        console.log('stream', stream)
        
        if (!stream) {
          throw new Error("Failed to get response stream");
        }
        
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;
        }

        await db.chatMessages.add({
          role: "assistant",
          content: accumulatedResponse,
          timestamp: new Date(),
          chatId,
        });
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
            <ChatMessageItem key={m.id || index} message={m} />
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