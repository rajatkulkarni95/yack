import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import KbdShort from "../components/KbdShort";
import { useKeyPress } from "../hooks/useKeyPress";
import { useNavigate } from "react-router-dom";
import { THistoryMessageProps, getHistory } from "../helpers/store";

const HistoryPage = () => {
  const [convHistory, setConvHistory] = useState<THistoryMessageProps[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const moveSelectedIndex = (direction: number) => {
    const newIndex = selectedIndex + direction;
    if (newIndex < 0 || newIndex > convHistory.length - 1) return;

    setSelectedIndex(newIndex);
  };

  useEffect(() => {
    async function fetchHistory() {
      const history = await getHistory();

      if (history) {
        const sortedHistory = Object.values(history).sort(
          (a, b) => b.created - a.created
        );
        setConvHistory(sortedHistory);
      }
    }

    fetchHistory();
  }, []);

  const navigate = useNavigate();

  const arrowUpPressed = useKeyPress("ArrowUp", true);
  const arrowDownPressed = useKeyPress("ArrowDown", true);
  const enterPressed = useKeyPress("Enter");

  useEffect(() => {
    if (arrowUpPressed) {
      moveSelectedIndex(-1);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      moveSelectedIndex(1);
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    if (enterPressed) {
      const selectedElement = document.querySelector(".activeElement");
      if (!selectedElement) return;

      const id = selectedElement.id;
      navigate(`/chat/${id}`);
    }
  }, [enterPressed]);

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

      <div className="flex h-[580px] flex-col overflow-y-auto pb-2">
        <p className="mb-2 px-4 pt-4 text-2xl font-medium text-secondary">
          History
        </p>
        {convHistory.length === 0 && (
          <div className="text-base font-normal text-tertiary">
            No history yet
          </div>
        )}
        <div className="flex flex-col px-4">
          {convHistory.map((conversation, i) => {
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
                  className={`flex items-center justify-between border px-4 py-2 text-left hover:bg-hover hover:text-primary ${
                    isSelected
                      ? "activeElement border-secondary bg-hover text-primary"
                      : "border-b-primary border-l-primary border-r-primary border-t-transparent bg-primary text-secondary "
                  } ${showDate && !isSelected ? "border-t-primary" : ""} `}
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
    </React.Fragment>
  );
};

export default HistoryPage;
