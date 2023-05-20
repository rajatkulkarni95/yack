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

      <div className="flex flex-col overflow-y-auto h-[580px] pb-2">
        <p className="text-2xl font-medium mb-2 px-4 pt-4 text-secondary">
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

            return (
              <React.Fragment key={conversation.id}>
                {showDate && (
                  <div className="text-xs font-normal text-tertiary mt-4 mb-2 px-3 py-1 rounded-full bg-secondary w-fit">
                    {dateString}
                  </div>
                )}
                <a
                  href={`/chat/${conversation.id}`}
                  key={conversation.id}
                  className={`hover:bg-hover hover:text-primary ${
                    i === selectedIndex
                      ? "bg-secondary text-primary activeElement border-secondary"
                      : "bg-primary text-secondary border-primary"
                  } py-2  border-b border-l border-r text-left flex items-center justify-between px-4 ${
                    showDate ? "border-t" : ""
                  }`}
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                  }}
                  id={i.toString()}
                >
                  <span className="text-base font-normal truncate">
                    {conversation.title}
                  </span>
                  <KbdShort
                    keys={["↵"]}
                    additionalStyles={
                      i === selectedIndex ? "visible ml-2" : "invisible ml-2"
                    }
                  />
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default HistoryPage;
