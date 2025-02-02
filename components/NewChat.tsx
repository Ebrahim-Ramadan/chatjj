"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type ChatMessage } from "@/lib/dexie";
import { streamChat } from "@/utils/streamChatting";

export default function ChatInterface() {
  const { chatID } = useParams();
  console.log('chatID', chatID)
  
  const chatId = chatID ? parseInt(chatID as string, 10) : null;
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUserId("user123");
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || chatId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: ChatMessage = {
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
        chatId,
      };
      
      await db.chatMessages.add(userMessage);
      setInput("");

      const stream = await streamChat(input);
      if (!stream) {
        throw new Error("Failed to get response stream");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
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
  };

  if (chatId === null) {
    return <div className="p-4 text-red-500">Invalid chat ID</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch p-4 sm:ml-64">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-8">
        {dbMessages?.map((m: ChatMessage, index: number) => (
          <div
            key={m.id || index}
            className={`p-4 rounded ${
              m.role === "user" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <div className="font-bold">
              {m.role === "user" ? "You" : "Assistant"}:
            </div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md">
        <input
          className="w-full p-4 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder={isLoading ? "Sending..." : "Type your message..."}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}