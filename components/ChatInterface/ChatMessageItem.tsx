import { memo } from "react";
import { ChatMessage } from "@/lib/dexie";

const ChatMessageItem = memo(({ message }: { message: ChatMessage }) => {
  return (
    <div
      className={`p-4 rounded ${
        message.role === "user" ? "bg-neutral-900" : "bg-neutral-800"
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