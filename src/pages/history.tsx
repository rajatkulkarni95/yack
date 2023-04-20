import React, { useEffect, useReducer } from "react";
import Header from "../components/Header";
import KbdShort from "../components/KbdShort";
import { useKeyPress } from "../hooks/useKeyPress";
import { useNavigate } from "react-router-dom";

type THistoryMessage = {
  created: Date;
  messages: string;
};

const HistoryPage = () => {
  const conversations = window.localStorage.getItem("history");
  const parsedConversations: {
    [key: string]: {
      created: Date;
      messages: string;
    };
  } = conversations ? JSON.parse(conversations) : {};
  const historyMessages: THistoryMessage[] = Object.values(parsedConversations);

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
        navigate(`/chat/${Object.keys(parsedConversations)[action.payload]}`);
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

      <div className="p-4 overflow-y-auto flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-secondary">History</h2>
        {Object.entries(parsedConversations).map(([id, conversation], i) => (
          <button
            key={id}
            className={`hover:bg-secondary ${
              i === state.selectedIndex ? "bg-secondary" : "bg-primary"
            } py-2 border-primary border-l border-b border-r text-left flex items-center justify-between px-4 ${
              i === 0 ? "border-t rounded-t" : ""
            } ${i === historyMessages.length - 1 ? "rounded-b" : ""}`}
            onClick={() => {
              navigate(`/chat/${id}`);
            }}
          >
            <span className="text-base font-normal text-primary">
              {conversation.messages}
            </span>
            <KbdShort
              keys={["↵"]}
              additionalStyles={
                i === state.selectedIndex ? "visible ml-2" : "invisible ml-2"
              }
            />
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default HistoryPage;
