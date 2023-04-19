import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PromptInput } from "../../components/Chat/Input";
import ChatBubble from "../../components/Chat/Bubble";
import poster from "../../helpers/poster";
import { COMPLETION_API, MODEL } from "../../constants/API";
import {
  incrementUsage,
  saveConversation,
  saveConversationIDToHistory,
} from "../../helpers/localstorage";
import Header from "../../components/Header";
import KbdShort from "../../components/KbdShort";
import { useUsage } from "../../hooks/useUsage";

const LOADING_MESSAGE = {
  created: new Date(),
  conversation: {
    role: "assistant",
    content: "Doing AI things",
  },
};

export type TConversation = {
  created: Date;
  conversation: TMessage;
};

export type TMessage = {
  role: string;
  content: string;
};

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return null;

  const [messages, setMessages] = useState<TConversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === "new") {
      const newUuid = uuidv4();
      window.localStorage.setItem(
        newUuid,
        JSON.stringify({ created: new Date(), messages: [] })
      );

      navigate(`/chat/${newUuid}`);
    } else {
      const conversation = window.localStorage.getItem(id);
      if (!conversation) {
        navigate("/chat/new");
      } else {
        const parsedConversation = JSON.parse(conversation);
        setMessages(parsedConversation.messages);
      }
    }
  }, [id]);

  const sendPrompt = async (prompt: string) => {
    const payload: TMessage = {
      role: "user",
      content: prompt,
    };

    const message = {
      created: new Date(),
      conversation: payload,
    };

    setMessages((prev) => [...prev, message]);
    setTimeout(() => setLoading(true), 500);
    saveConversationIDToHistory({
      id,
      created: message.created,
      title: prompt,
    });

    const promptMessages = messages.map((message) => message.conversation);
    const prompts = [...promptMessages, payload];

    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = 99999999;
      }, 600);
    }

    const requestPayload = {
      model: MODEL,
      messages: prompts,
    };

    try {
      const response = await poster(COMPLETION_API, requestPayload);
      incrementUsage(response.usage);
      const responsedMessage = {
        created: new Date(),
        conversation: response.choices[0].message,
      };
      setMessages((prev) => [...prev, responsedMessage]);
      if (chatContainer) {
        setTimeout(() => {
          chatContainer.scrollTop = 99999999;
        }, 100);
      }
      const currentConversation = [message, responsedMessage];
      saveConversation(currentConversation, id);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Header haltNew={messages.length === 0} />
      <div
        className="p-4 overflow-y-auto max-h-[540px] duration-150"
        id="chat-container"
      >
        {messages.map((message, index) => (
          <ChatBubble message={message} />
        ))}
        {loading && <ChatBubble message={LOADING_MESSAGE} loading />}
      </div>
      <section className="absolute bottom-0 w-full p-4 bg-primary">
        <PromptInput sendPrompt={sendPrompt} haltNew={messages.length === 0} />
      </section>
    </React.Fragment>
  );
};

export default ChatPage;
