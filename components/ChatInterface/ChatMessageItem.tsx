import { memo } from "react";
import { toast } from "sonner";

const ChatMessageItem = memo(({ message }) => {
  console.log('message', message.content);
  
  const isUser = message.role === "user";

  const renderTextWithBold = (text) => {
    // Split the text into segments based on headers, bold text, and numbered lists
    const segments = text.split(/(###\s+|\*\*.+?\*\*|\d+\.\s+)/g).filter(Boolean);
    
    return segments.map((segment, index) => {
      // Skip empty segments or segments with only a period
      if (segment.trim().length < 1 || segment.trim() === " " || segment.charAt(segment.length - 1) === '.') return null;

      // Handle headers
      if (segment.startsWith("###")) {
        const headerText = segment.replace(/^###\s+/, "").trim();
        return (
          <h3 key={`header-${index}`} className="text-xl font-semibold text-neutral-100 py-2 mt-2">
            {headerText}
          </h3>
        );
      }
      
      // Handle bold text
      if (segment.startsWith("**") && segment.endsWith("**")) {
        const boldText = segment.slice(2, -2);
        return (
          <span key={`bold-${index}`} className="font-bold text-neutral-100 inline-block py-1">
            {boldText}
          </span>
        );
      }
      
      // Handle numbered lists (e.g., "3.", "4.", etc.)
      if (/^\d+\.\s+/.test(segment)) {
        return (
          <span key={`numbered-${index}`} className="text-neutral-200 inline-block">
            {segment}
          </span>
        );
      }
      
      // Regular text
      return (
        <span key={`text-${index}`} className="text-neutral-200">
          {segment}
        </span>
      );
    });
  };

  const renderCode = (codeContent, language) => (
    <div className="relative">
      <pre className={`bg-neutral-800 px-4 py-6 rounded-b-lg my-2 overflow-x-auto relative border-t-2 border-b-0 border-r-0 border-l-0 ${
        language && `language-${language}`
      }`}>
        <code className="text-sm mt-4 block whitespace-pre">{codeContent}</code>
      </pre>
      <div
        className="absolute top-0 right-0 px-2 mt-2 flex justify-between items-center w-full"
      >
        <p className={`text-xs language-${language}`}>{language}</p>
        <button
          className="rounded-lg hover:bg-neutral-600 bg-neutral-700 p-1 transition text-xs md:text-sm font-medium"
          onClick={() => {
            navigator.clipboard.writeText(codeContent);
            toast.success("Copied");
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );

  const renderContent = (text) => {
    if (isUser) return text;

    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const codeBlock = part.slice(3, -3);
        const [language, ...codeLines] = codeBlock.trim().split("\n");
        const codeContent = codeLines.join("\n");
        return renderCode(codeContent, language);
      }
      return renderTextWithBold(part);
    });
  };

  const renderThinkContent = (text) => {
    if (text.trim().length === 0 || text.trim() === " ") return null;
    return (
      <div className="bg-neutral-900 p-3 border-t-2 border-b-2 border-r-0 border-l-0 border-neutral-800 italic text-neutral-300">
        {renderTextWithBold(text)}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg shadow-md ${
          isUser ? "bg-neutral-800" : "bg-neutral-950"
        } ${isUser ? "rounded-br-none" : "rounded-bl-none"}`}
      >
        <div className="space-y-2">
          {message.content.split(/<think>|<\/think>/).map((part, index) => {
            if (!part.trim()) return null;

            if (index % 2 === 1) {
              return (
                <div
                  key={`think-${index}`}
                  className="text-sm font-medium py-2"
                >
                  {renderThinkContent(part)}
                </div>
              );
            }
            return <div key={`content-${index}`}>{renderContent(part)}</div>;
          })}
        </div>
      </div>
    </div>
  );
});

ChatMessageItem.displayName = "ChatMessageItem";

export default ChatMessageItem;