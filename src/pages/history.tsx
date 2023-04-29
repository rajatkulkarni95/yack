import React, { useEffect, useReducer, useState } from "react";
import Header from "../components/Header";
import KbdShort from "../components/KbdShort";
import { useKeyPress } from "../hooks/useKeyPress";
import { useNavigate } from "react-router-dom";
import { THistory, getHistory } from "../helpers/store";

type THistoryMessage = {
  created: number;
  title: string;
};

const HistoryPage = () => {
  const [convHistory, setConvHistory] = useState<THistory>({});

  useEffect(() => {
    async function fetchHistory() {
      const history = await getHistory();

      if (history) setConvHistory(history);
    }

    fetchHistory();
  }, []);

  const historyMessages: THistoryMessage[] = Object.values(convHistory).sort(
    (a, b) => b.created - a.created
  );

  const navigate = useNavigate();

  const initialState = { selectedIndex: 0 };

  function reducer(
    state: { selectedIndex: number },
    action: { type: any; payload?: any }
  ) {
    switch (action.type) {
      case "arrowUp":
        return {
          selectedIndex:
            state.selectedIndex !== 0
              ? state.selectedIndex - 1
              : historyMessages.length - 1,
        };
      case "arrowDown":
        return {
          selectedIndex:
            state.selectedIndex !== historyMessages.length - 1
              ? state.selectedIndex + 1
              : 0,
        };
      case "select":
        return { selectedIndex: action.payload };
      case "enter": {
        navigate(`/chat/${Object.keys(convHistory)[action.payload]}`);
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

  console.log({ historyMessages });

  return (
    <React.Fragment>
      <Header hideHistory />

      <div className="p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-secondary">History</h2>
        {historyMessages.length === 0 && (
          <div className="text-base font-normal text-tertiary">
            No history yet
          </div>
        )}
        <div className="flex flex-col overflow-y-auto h-[520px]">
          {Object.entries(convHistory)
            .sort((a, b) => b[1].created - a[1].created)
            .map(([id, conversation], i) => {
              const date = new Date(conversation.created);
              const dateString = date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              });

              const showDate =
                i === 0 ||
                dateString !==
                  new Date(historyMessages[i - 1].created).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  );

              return (
                <React.Fragment key={id}>
                  {showDate && (
                    <div className="text-xs font-normal text-tertiary mt-4 mb-2">
                      {dateString}
                    </div>
                  )}
                  <button
                    key={id}
                    className={`hover:bg-hover ${
                      i === state.selectedIndex ? "bg-hover" : "bg-primary"
                    } py-2 border-primary border-b border-l border-r text-left flex items-center justify-between px-4 ${
                      showDate ? "border-t" : ""
                    }`}
                    onClick={() => {
                      navigate(`/chat/${id}`);
                    }}
                  >
                    <span className="text-base font-normal text-primary truncate">
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
