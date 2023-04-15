import { useState } from "react";

export const PromptInput = () => {
  const [value, setValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setValue("");
      e.preventDefault();
    }

    if (e.key === "Escape") {
      setValue("");
    }

    if (e.key === "Enter" && e.shiftKey) {
      console.log("Shift + Enter");
    }
  };

  return (
    <div className="grow-wrap" data-replicated-value={value}>
      <textarea
        className={`rounded-md w-full resize-none focus-within:border-secondary border border-primary bg-primary p-3 font-sans text-sm text-primary hover:border-secondary placeholder:text-placeholder
      `}
        style={{ scrollPaddingBlock: "8px" }}
        value={value}
        onChange={onChange}
        placeholder="Go on, ask me anything"
        autoComplete="off"
        autoCorrect="off"
        autoFocus
        onKeyDown={onKeyDown}
        rows={1}
      />
    </div>
  );
};
