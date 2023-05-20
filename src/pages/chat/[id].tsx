import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PromptInput } from "../../components/Chat/Input";
import ChatBubble from "../../components/Chat/Bubble";

import Header from "../../components/Header";
import {
  ChatMessageParams,
  OpenAIChatMessage,
  useChatCompletion,
} from "../../hooks/useChatCompletion";
import KbdShort from "../../components/KbdShort";
import { useHotkeys } from "react-hotkeys-hook";
import {
  getApiKey,
  getConversation,
  incrementUsage,
  saveConversation,
  saveConversationIDToHistory,
  store,
} from "../../helpers/store";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conv, setConv] = useState<ChatMessageParams[]>([]);
  const [queryErrored, setQueryErrored] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const [messages, submitQuery, resetMessages, closeStream] = useChatCompletion(
    {
      model: "gpt-3.5-turbo",
      apiKey: apiKey,
    }
  );

  if (!id) return null;

  useEffect(() => {
    async function checkAPIKey() {
      const key = await getApiKey();

      if (!key) {
        navigate("/");
      } else {
        setApiKey(key);
      }
    }

    checkAPIKey();
  }, []);

  useEffect(() => {
    async function checkForExistingConversation() {
      if (id === "new") {
        setConv([]);
        resetMessages();
      } else {
        const conversation = await getConversation(id as string);

        if (conversation) {
          setConv(conversation);
          resetMessages();
          setQueryErrored(false);
        }
      }
    }

    checkForExistingConversation();
  }, [id]);

  const chatContainer = document.getElementById("chat-container");

  useEffect(() => {
    if (chatContainer && messages?.length > 0) {
      setTimeout(() => {
        chatContainer.scrollTop = 99999999;
      }, 100);
    }

    async function saveMessages() {
      if (
        !messages?.[messages.length - 1]?.meta?.loading &&
        messages?.length > 0 &&
        id
      ) {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage.content === "" && lastMessage.role === "") {
          setQueryErrored(true);
          messages.pop();
          return;
        }

        await incrementUsage({ total_tokens: lastMessage.meta.chunks.length });
        const tonedMessages = messages.map((message) => ({
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
        }));

        await saveConversation(tonedMessages, id);
      }
    }

    saveMessages();
  }, [messages]);

  const sendPrompt = async (prompt: string) => {
    const payload: OpenAIChatMessage = {
      role: "user",
      content: prompt,
    };

    if (messages.length === 0 && conv.length === 0) {
      if (id === "new") {
        const uuid = uuidv4();
        await saveConversationIDToHistory({
          id: uuid,
          created: new Date().getTime(),
          title: prompt,
        });
        navigate(`/chat/${uuid}`);
      }
    }

    let messagePayload;
    if (conv.length > 0 && messages.length === 0) {
      messagePayload = [...conv, payload];
    } else {
      messagePayload = [payload];
    }

    try {
      setQueryErrored(false);
      submitQuery(messagePayload);
    } catch (e) {
      console.error(e);
    }
  };

  useHotkeys("meta+e", closeStream);

  const chatConversations =
    messages.length === 0 && conv.length > 0 ? conv : messages;

  return (
    <React.Fragment>
      <Header />
      <div
        className="max-h-[510px] overflow-y-auto p-4 duration-150"
        id="chat-container"
      >
        {chatConversations
          .filter((message) => message.content !== "" && message.role !== "")
          .map((message, index) => (
            <ChatBubble message={message} key={index} />
          ))}
        {queryErrored && (
          <div className="mt-4 rounded-md border border-red-500 bg-red-600/25 px-4 py-3 text-sm text-primary">
            Something went wrong with the network call. Please try again.
          </div>
        )}
      </div>
      {messages?.[messages.length - 1]?.meta?.loading && (
        <button
          className="absolute bottom-24 left-1/2 z-10 mr-1 -translate-x-1/2 rounded border border-primary bg-tertiary px-3 py-2 hover:bg-primaryBtnHover"
          onClick={closeStream}
        >
          <span className="flex items-center font-sans text-sm font-normal text-secondary">
            Stop Generating
            <KbdShort keys={["⌘", "E"]} additionalStyles="ml-2" />
          </span>
        </button>
      )}
      <section className="absolute bottom-0 w-full bg-primary p-4">
        <PromptInput
          sendPrompt={sendPrompt}
          disabled={messages?.[messages.length - 1]?.meta?.loading}
          stopStream={closeStream}
        />
      </section>
    </React.Fragment>
  );
};

export default ChatPage;
