import { useEffect, useRef, useState } from "react";
import { hideApp } from "../Header";
import { useNavigation } from "../../hooks/useNavigation";
import KbdShort from "../KbdShort";

type TProps = {
  sendPrompt: (prompt: string) => void;
  disabled?: boolean;
  stopStream: () => void;
  streamOngoing?: boolean;
};

export const PromptInput = ({
  sendPrompt,
  disabled = false,
  stopStream,
  streamOngoing,
}: TProps) => {
  const [value, setValue] = useState<string>("");
  const {
    navigateToNextChat,
    navigateToPrevChat,
    onClickHistory,
    onClickNew,
    onClickSettings,
  } = useNavigation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    setValue("");
    if (value.trim() === "") return;

    sendPrompt(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.metaKey) {
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

    if (e.key === "n" && e.metaKey && !streamOngoing) {
      onClickNew();
    }

    if (e.key === "," && e.metaKey) {
      onClickSettings();
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
      className="grow-wrap relative w-full rounded-md border border-primary bg-secondary focus-within:border-secondary hover:border-secondary"
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
        ref={textAreaRef}
      />
      <button
        className="mb-2 ml-auto mr-2 w-fit rounded bg-tertiary px-3 py-1.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleSubmit}
        disabled={value.trim() === ""}
      >
        <span className="flex items-center font-sans text-sm font-normal text-secondary">
          Send
          <KbdShort keys={["↵"]} additionalStyles="ml-2" />
        </span>
      </button>
    </div>
  );
};
