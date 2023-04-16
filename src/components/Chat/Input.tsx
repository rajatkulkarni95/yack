import { useState } from "react";

type TProps = {
  sendPrompt: (prompt: string) => void;
};

export const PromptInput = ({ sendPrompt }: TProps) => {
  const [value, setValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setValue("");
      sendPrompt(value);
      e.preventDefault();
    }

    if (e.key === "Escape") {
      setValue("");
    }
  };

  return (
    <div className="grow-wrap" data-replicated-value={value}>
      <textarea
        className={`rounded-md w-full resize-none focus-within:border-secondary border border-primary bg-secondary p-3 font-sans text-sm text-primary hover:border-secondary placeholder:text-placeholder
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
