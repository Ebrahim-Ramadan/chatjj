import { FormEvent, memo, KeyboardEvent } from "react";
import LoadingDots from "../LoadingComponent";

interface InputFormProps {
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

const InputForm = memo(({ input, isLoading, setInput, handleSubmit }: InputFormProps) => {
  // Handle keydown events in the textarea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default behavior (new line) if Shift is not pressed
      e.preventDefault();
      handleSubmit(e); // Submit the form
    }
    // If Shift + Enter is pressed, allow the textarea to create a new line
  };

  // Adjust textarea height dynamically
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`; // Set new height (max 10rem = 160px)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 p-2 bg-neutral-800 border-2 border-neutral-600 rounded-xl shadow-xl"
    >
      <div className="flex p-2 items-center gap-4 w-full">
        <textarea
          autoFocus
          rows={1} // Start with 1 row
          style={{
            maxHeight: "15rem", // Maximum height (10rem = 160px)
            resize: "none", // Disable manual resizing
            overflowY: "auto",  // Hide scrollbar
          }}
          className="resize-none text-[rgb(var(--ds-rgb-label-1))] caret-[rgb(var(--ds-rgb-label-1))] bg-transparent border-none outline-none w-full text-white"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => {
            setInput(e.target.value);
            adjustTextareaHeight(e); // Adjust height on change
          }}
          onKeyDown={(e) => {
            handleKeyDown(e); // Handle keydown events
            adjustTextareaHeight(e); // Adjust height on keydown (for Shift + Enter)
          }}
        />
        {isLoading ? (
          <LoadingDots />
        ) : (
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
});

InputForm.displayName = "InputForm";
export default InputForm;