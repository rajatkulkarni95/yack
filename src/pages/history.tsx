import React, { useEffect, useReducer, useRef, useState } from "react";
import Header from "../components/Header";
import KbdShort from "../components/KbdShort";
import { useKeyPress } from "../hooks/useKeyPress";
import { useNavigate } from "react-router-dom";
import { THistoryMessageProps, getHistory } from "../helpers/store";

const HistoryPage = () => {
  const [convHistory, setConvHistory] = useState<THistoryMessageProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const scrollIfNeeded = (idx: number) => {
    const container = containerRef.current;
    if (container) {
      const selected = container.children[idx];
      const rect = selected.getBoundingClientRect();

      if (rect.bottom > container.clientHeight) {
        container.scrollTop += rect.bottom - container.clientHeight;
      } else if (rect.top < 0) {
        container.scrollTop += rect.top;
      }
    }
  };

  const initialState = { selectedIndex: 0 };

  function reducer(
    state: { selectedIndex: number },
    action: { type: any; payload?: any }
  ) {
    switch (action.type) {
      case "arrowUp": {
        if (state.selectedIndex !== 0) {
          scrollIfNeeded(state.selectedIndex - 1);
        }
        return {
          selectedIndex:
            state.selectedIndex !== 0
              ? state.selectedIndex - 1
              : convHistory.length - 1,
        };
      }
      case "arrowDown": {
        scrollIfNeeded(state.selectedIndex + 1);
        return {
          selectedIndex:
            state.selectedIndex !== convHistory.length - 1
              ? state.selectedIndex + 1
              : 0,
        };
      }
      case "select":
        return { selectedIndex: action.payload };
      case "enter": {
        navigate(`/chat/${convHistory[action.payload].id}`);
        return { selectedIndex: action.payload };
      }

      default:
        throw new Error();
    }
  }

  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (arrowUpPressed) {
      dispatch({ type: "arrowUp" });
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      dispatch({ type: "arrowDown" });
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    if (enterPressed) {
      dispatch({ type: "enter", payload: state.selectedIndex });
    }
  }, [enterPressed]);

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
        <div className="flex flex-col px-4" ref={containerRef}>
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
                <button
                  key={conversation.id}
                  className={`hover:bg-hover hover:text-primary ${
                    i === state.selectedIndex
                      ? "bg-hover text-primary"
                      : "bg-primary text-secondary"
                  } py-2 border-primary border-b border-l border-r text-left flex items-center justify-between px-4 ${
                    showDate ? "border-t" : ""
                  }`}
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                  }}
                >
                  <span className="text-base font-normal truncate">
                    {conversation.title}
                  </span>
                  <KbdShort
                    keys={["↵"]}
                    additionalStyles={
                      i === state.selectedIndex
                        ? "visible ml-2"
                        : "invisible ml-2"
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
