import { memo } from "react";
import { ChatMessage } from "@/lib/dexie";

const ChatMessageItem = memo(({ message }: { message: ChatMessage }) => {
  return (
    <div
      className={`p-4 rounded ${
        message.role === "user" ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <div className="font-bold">
        {message.role === "user" ? "You" : "Assistant"}:
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  );
});

ChatMessageItem.displayName = "ChatMessageItem";

export default ChatMessageItem;