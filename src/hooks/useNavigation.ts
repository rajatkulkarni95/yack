import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rollingChat, setRollingChat] = useState({
    nextChat: "",
    prevChat: "",
  });

  const onClickHistory = () => {
    navigate("/history");
  };

  const onClickNew = () => {
    navigate("/chat/new");
  };

  useEffect(() => {
    const conversations = localStorage.getItem("history");
    const historyMessages: string[] = Object.keys(
      JSON.parse(conversations || "{}")
    );

    const currentChat = location.pathname.replace("/chat/", "");
    const currentChatIndex = historyMessages.indexOf(currentChat);

    setRollingChat({
      nextChat: historyMessages[currentChatIndex + 1],
      prevChat: historyMessages[currentChatIndex - 1],
    });
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
  };
};
