import { memo } from "react";
import { ChatMessage } from "@/lib/dexie";

const ChatMessageItem = memo(({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg text-white shadow-md ${
          isUser ? "bg-neutral-800" : "bg-neutral-950"
        } ${isUser ? "rounded-br-none" : "rounded-bl-none"}`}
      >
        
        <div className=" text-sm font-medium leading-relaxed">
          {message.content.replace("</think>", "").replace("<think>", "")}
        </div>
      </div>
    </div>
  );
});

ChatMessageItem.displayName = "ChatMessageItem";

export default ChatMessageItem;
