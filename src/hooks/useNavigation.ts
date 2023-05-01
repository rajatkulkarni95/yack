import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHistory } from "../helpers/store";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    async function calcRollingChat() {
      const history = await getHistory();
      if (history) {
        const historyMessages: string[] = Object.keys(history);

        const currentChat = location.pathname.replace("/chat/", "");
        const currentChatIndex = historyMessages.indexOf(currentChat);

        if (currentChatIndex === 0) {
          setIsLeftDisabled(true);
        } else {
          setIsLeftDisabled(false);
        }

        if (currentChatIndex === historyMessages.length - 1) {
          setIsRightDisabled(true);
        } else {
          setIsRightDisabled(false);
        }

        setRollingChat({
          nextChat: historyMessages[currentChatIndex + 1],
          prevChat: historyMessages[currentChatIndex - 1],
        });
      }
    }
    calcRollingChat();
  }, [location]);

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
