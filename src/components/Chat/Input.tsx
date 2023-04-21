import { useState } from "react";
import { hideApp } from "../Header";
import { useNavigate } from "react-router-dom";

type TProps = {
  sendPrompt: (prompt: string) => void;
  haltNew: boolean;
  disabled?: boolean;
};

export const PromptInput = ({
  sendPrompt,
  haltNew,
  disabled = false,
}: TProps) => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onClickHistory = () => {
    navigate("/history");
  };

  const onClickNew = () => {
    if (haltNew) return;
    navigate("/chat/new");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setValue("");
      e.preventDefault();
      if (value.trim() === "") return;

      sendPrompt(value);
    }

    if (e.key === "Escape") {
      setValue("");
      if (value.trim() === "") {
        hideApp();
      }
    }

    if (e.key === "o" && e.metaKey) {
      onClickHistory();
    }

    if (e.key === "n" && e.metaKey) {
      onClickNew();
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
        disabled={disabled}
      />
    </div>
  );
};
