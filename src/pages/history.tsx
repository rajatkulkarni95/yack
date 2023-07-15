import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import KbdShort from "../components/KbdShort";
import { useNavigate } from "react-router-dom";
import {
  THistoryMessageProps,
  deleteConversationFromHistory,
  getHistory,
} from "../helpers/store";
import { useHotkeys } from "react-hotkeys-hook";

const HistoryPage = () => {
  const [convHistory, setConvHistory] = useState<THistoryMessageProps[]>([]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const moveSelectedIndex = (direction: number) => {
    const newIndex = selectedIndex + direction;
    if (newIndex < 0 || newIndex > convHistory.length - 1) return;

    setSelectedIndex(newIndex);
  };

  async function fetchHistory() {
    const history = await getHistory();

    if (history) {
      const sortedHistory = Object.values(history).sort(
        (a, b) => b.created - a.created
      );
      setConvHistory(sortedHistory);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const navigate = useNavigate();

  const handleDelete = async () => {
    const selectedElement = document.querySelector(".activeElement");
    if (!selectedElement) return;

    const id = selectedElement.id;
    await deleteConversationFromHistory(id);
    fetchHistory();
  };

  useHotkeys("ArrowUp", () => moveSelectedIndex(-1), {
    preventDefault: true,
  });
  useHotkeys("ArrowDown", () => moveSelectedIndex(1), {
    preventDefault: true,
  });
  useHotkeys(
    "Enter",
    () => {
      const selectedElement = document.querySelector(".activeElement");
      if (!selectedElement) return;

      const id = selectedElement.id;
      navigate(`/chat/${id}`);
    },
    {
      preventDefault: true,
    }
  );

  useHotkeys("meta+backspace", handleDelete);
  useHotkeys("meta+f", () => inputRef.current?.focus());

  const filteredHistory = convHistory.filter((conv) =>
    conv.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const selectedElement = document.querySelector(".activeElement");
    if (!selectedElement) return;

    selectedElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [selectedIndex]);

  return (
    <React.Fragment>
      <Header hideHistory />

      <div className="flex h-[calc(100vh-80px)] flex-col overflow-y-auto pb-2">
        <div className="flex items-center justify-between px-4 pt-4">
          <p className="font-mono text-lg text-secondary">
            History
            <span className="ml-1 font-mono text-tertiary">
              ({convHistory.length})
            </span>
          </p>
          <input
            type="text"
            id="search"
            name="search"
            className="py- rounded border border-primary bg-secondary px-2 py-1.5 text-primary focus-within:border-secondary hover:border-secondary"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeydown}
            ref={inputRef}
          />
        </div>
        {filteredHistory.length === 0 && (
          <div className="flex h-20 w-full items-center justify-center text-base font-normal text-tertiary">
            {search !== ""
              ? `Nothing to be found with "${search}"`
              : "No history yet"}
          </div>
        )}
        <div className="flex flex-col px-4">
          {filteredHistory.map((conversation, i) => {
            const date = new Date(conversation.created);
            const dateString = date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });

            const showDate =
              i === 0 ||
              dateString !==
                new Date(convHistory[i - 1].created).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }
                );

            const isSelected = i === selectedIndex;

            return (
              <React.Fragment key={conversation.id}>
                {showDate && (
                  <div className="mb-2 mt-4 w-fit rounded-full bg-secondary px-3 py-1 text-xs font-normal text-tertiary">
                    {dateString}
                  </div>
                )}
                <button
                  key={conversation.id}
                  className={`flex items-center justify-between border px-4 py-2 text-left hover:bg-hover hover:text-primary
                  ${
                    isSelected
                      ? "activeElement !border-secondary bg-hover text-primary"
                      : "border-b-primary border-l-primary border-r-primary border-t-transparent bg-primary text-secondary"
                  } ${showDate && !isSelected ? "!border-t-primary" : ""}
                  `}
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                  }}
                  id={conversation.id}
                >
                  <span className="truncate text-base font-normal">
                    {conversation.title}
                  </span>
                  <KbdShort
                    keys={["↵"]}
                    additionalStyles={
                      isSelected ? "visible ml-2" : "invisible ml-2"
                    }
                  />
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <footer className="flex h-12 items-center justify-center border-t border-primary bg-primary px-4">
        <span className="flex items-center text-sm font-normal text-tertiary">
          <KbdShort keys={["↑", "↓"]} additionalStyles="mr-2" /> to navigate{" "}
        </span>
        <span className="ml-8 flex items-center text-sm font-normal text-tertiary">
          <KbdShort keys={["↵"]} additionalStyles="mr-2" /> to select{" "}
        </span>
        <span className="ml-8 flex items-center text-sm font-normal text-tertiary">
          <KbdShort keys={["⌘", "⌫"]} additionalStyles="mr-2" /> to delete{" "}
        </span>
        <span className="ml-8 flex items-center text-sm font-normal text-tertiary">
          <KbdShort keys={["Esc"]} additionalStyles="mr-2" /> to back{" "}
        </span>
      </footer>
    </React.Fragment>
  );
};

export default HistoryPage;
