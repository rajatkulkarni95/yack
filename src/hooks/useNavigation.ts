import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHistory } from "../helpers/store";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState<string[]>([]);
  const [rollingChat, setRollingChat] = useState({
    nextChat: "",
    prevChat: "",
  });
  const [isLeftDisabled, setIsLeftDisabled] = useState(false);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const onClickHistory = () => {
    navigate("/history");
  };

  const onClickNew = () => {
    navigate("/chat/new");
  };

  useEffect(() => {
    async function saveHistoryToLocalState() {
      const storedHistory = await getHistory();
      if (storedHistory) {
        const sortedHistoryMessages: string[] = Object.values(storedHistory)
          .sort((a, b) => b.created - a.created)
          .map((item) => item.id);
        setHistory(sortedHistoryMessages);
      }
    }

    saveHistoryToLocalState();
  }, [location]);

  useEffect(() => {
    async function calcRollingChat() {
      if (history) {
        const currentChat = location.pathname.replace("/chat/", "");
        const currentChatIndex = history.indexOf(currentChat);

        if (currentChatIndex === 0 || currentChatIndex === -1) {
          setIsRightDisabled(true);
        } else {
          setIsRightDisabled(false);
        }

        if (currentChatIndex === history.length - 1) {
          setIsLeftDisabled(true);
        } else {
          setIsLeftDisabled(false);
        }

        setRollingChat({
          prevChat:
            currentChatIndex === -1
              ? history[0]
              : history[currentChatIndex + 1],
          nextChat: history[currentChatIndex - 1],
        });
      }
    }
    calcRollingChat();
  }, [location, history]);

  const navigateToNextChat = () => {
    if (rollingChat.nextChat) {
      navigate(`/chat/${rollingChat.nextChat}`);
    }
  };

  const navigateToPrevChat = () => {
    if (rollingChat.prevChat) {
      navigate(`/chat/${rollingChat.prevChat}`);
    }
  };

  return {
    onClickHistory,
    onClickNew,
    navigateToNextChat,
    navigateToPrevChat,
    isLeftDisabled,
    isRightDisabled,
  };
};
