import { useState } from "react";
import { hideApp } from "../Header";
import { useNavigation } from "../../hooks/useNavigation";
import KbdShort from "../KbdShort";

type TProps = {
  sendPrompt: (prompt: string) => void;
  disabled?: boolean;
  stopStream: () => void;
};

export const PromptInput = ({
  sendPrompt,
  disabled = false,
  stopStream,
}: TProps) => {
  const [value, setValue] = useState<string>("");
  const { navigateToNextChat, navigateToPrevChat, onClickHistory, onClickNew } =
    useNavigation();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    setValue("");
    if (value.trim() === "") return;

    sendPrompt(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      setValue("");
      e.preventDefault();
      if (value.trim() === "") return;

      sendPrompt(value);
    }

    if (e.key === "Escape" && !e.metaKey) {
      setValue("");
      if (value.trim() === "") {
        hideApp();
      }
    }

    if (e.key === "p" && e.metaKey) {
      onClickHistory();
    }

    if (e.key === "n" && e.metaKey) {
      onClickNew();
    }

    if (e.key === "[" && e.metaKey) {
      navigateToPrevChat();
    }

    if (e.key === "]" && e.metaKey) {
      navigateToNextChat();
    }

    if (e.key === "e" && e.metaKey) {
      stopStream();
    }
  };

  return (
    <div
      className="grow-wrap relative rounded-md w-full focus-within:border-secondary border border-primary bg-secondary hover:border-secondary"
      data-replicated-value={value}
    >
      <textarea
        className={`resize-none bg-transparent p-0 font-sans text-sm text-primary placeholder:text-placeholder
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
      <button
        className="px-3 py-1.5 bg-tertiary ml-auto mr-2 mb-2 disabled:cursor-not-allowed disabled:opacity-50 w-fit hover:brightness-110 rounded"
        onClick={handleSubmit}
        disabled={value.trim() === ""}
      >
        <span className="text-sm font-normal text-secondary font-sans flex items-center">
          Send
          <KbdShort keys={["⌘", "↵"]} additionalStyles="ml-2" />
        </span>
      </button>
    </div>
  );
};
