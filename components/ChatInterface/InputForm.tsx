import { FormEvent, memo } from "react";

interface InputFormProps {
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

const InputForm = memo(({ input, isLoading, setInput, handleSubmit }: InputFormProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 p-2 bg-neutral-800 border-2 border-neutral-600 rounded-xl shadow-xl"
    >
      <div className="flex items-center gap-2 w-full">
        <input
          autoFocus
          className="flex-1 p-2 border-none outline-none w-full text-white bg-transparent"
          value={input}
          placeholder={isLoading ? "Sending..." : "Type your message..."}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-4 disabled:text-gray-400 disabled:cursor-not-allowed"
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
      </div>
    </form>
  );
});

InputForm.displayName = "InputForm";
export default InputForm;
