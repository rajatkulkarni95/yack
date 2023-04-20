import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PromptInput } from "../../components/Chat/Input";
import ChatBubble from "../../components/Chat/Bubble";
import {
  incrementUsage,
  saveConversation,
  saveConversationIDToHistory,
} from "../../helpers/localstorage";
import Header from "../../components/Header";
import {
  useChatCompletion,
  GPT35,
  ChatMessageParams,
} from "openai-streaming-hooks";

export type TConversation = {
  created: Date;
  conversation: TMessage;
};

export type TMessage = {
  role: string;
  content: string;
  timestamp: number;
};

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, submitQuery] = useChatCompletion({
    model: GPT35.TURBO,
    apiKey: window.localStorage.getItem("api_key") || "",
  });

  if (!id) return null;

  useEffect(() => {
    const apiKey = window.localStorage.getItem("api_key");
    if (!apiKey) {
      navigate("/");
    }
  }, []);

  const [conv, setConv] = useState<TMessage[]>([]);

  useEffect(() => {
    if (id !== "new") {
      const conversation = window.localStorage.getItem(id);

      if (conversation) {
        const parsedConversation = JSON.parse(conversation);
        setConv(parsedConversation);
      }
    } else if (id === "new") {
      setConv([]);
    }
  }, [id]);

  useEffect(() => {
    if (
      !messages?.[messages.length - 1]?.meta?.loading &&
      messages?.length > 0
    ) {
      const lastMessage = messages[messages.length - 1];
      incrementUsage({ total_tokens: lastMessage.meta.chunks.length });
      const tonedMessages = messages.map((message) => ({
        content: message.content,
        role: message.role,
        timestamp: message.timestamp,
      }));
      saveConversation(tonedMessages, id);
    }
  }, [messages]);

  const sendPrompt = async (prompt: string) => {
    const payload: ChatMessageParams = {
      role: "user",
      content: prompt,
    };

    if (messages.length === 0) {
      if (id === "new") {
        const uuid = uuidv4();
        saveConversationIDToHistory({
          id: uuid,
          created: new Date().getTime(),
          title: prompt,
        });
        navigate(`/chat/${uuid}`);
      }
    }

    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = 99999999;
      }, 600);
    }

    let messagePayload;
    if (conv.length > 0 && messages.length === 0) {
      messagePayload = [...conv, payload];
    } else {
      messagePayload = [payload];
    }

    submitQuery(messagePayload);
  };

  const chatConversations =
    messages.length === 0 && conv.length > 0 ? conv : messages;

  return (
    <React.Fragment>
      <Header haltNew={conv.length === 0} />
      <div
        className="p-4 overflow-y-auto max-h-[540px] duration-150"
        id="chat-container"
      >
        {chatConversations.map((message, index) => (
          <ChatBubble message={message} />
        ))}
      </div>
      <section className="absolute bottom-0 w-full p-4 bg-primary">
        <PromptInput
          sendPrompt={sendPrompt}
          haltNew={conv.length === 0}
          disabled={messages?.[messages.length - 1]?.meta?.loading}
        />
      </section>
    </React.Fragment>
  );
};

export default ChatPage;
