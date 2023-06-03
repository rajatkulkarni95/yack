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
  removeApiKey,
  saveConversation,
  saveConversationIDToHistory,
  store,
} from "../../helpers/store";

export type TErrorMessage = {
  error: {
    message: string;
    type: string;
    param: string;
    code: string;
  };
};

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conv, setConv] = useState<ChatMessageParams[]>([]);
  const [queryErrored, setQueryErrored] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [streamClosed, setStreamClosed] = useState(false);
  const [queryErroredMessage, setQueryErroredMessage] = useState(
    "Something went wrong. Please try again."
  );

  const [messages, submitQuery, resetMessages, closeStream] = useChatCompletion(
    {
      model: "gpt-3.5-turbo",
      apiKey: apiKey,
      setErrorMessage: (message) => handleErrorMessage(message),
    }
  );

  const handleErrorMessage = (message: string) => {
    if (message !== "") {
      const parsed = JSON.parse(message) as TErrorMessage;
      if (parsed.error.code === "invalid_api_key") {
        setQueryErroredMessage(
          "Invalid API Key. Returning to home page in 5 seconds."
        );
        setTimeout(() => {
          removeApiKey();
          navigate("/");
        }, 5000);
      } else {
        setQueryErroredMessage(parsed.error.message);
      }
    }
  };

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
    if (streamClosed) {
      setStreamClosed(false);
    }
    checkForExistingConversation();
  }, [id]);

  const chatContainer = document.getElementById("chat-container");

  const handleCloseStream = () => {
    setStreamClosed(true);
    closeStream();
  };

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

    if (streamClosed) {
      setStreamClosed(false);
    }

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

  useHotkeys("meta+e", handleCloseStream);

  const chatConversations =
    messages.length === 0 && conv.length > 0 ? conv : messages;

  const streamOngoing = messages?.[messages.length - 1]?.meta?.loading;

  return (
    <React.Fragment>
      <Header streamOngoing={streamOngoing} />
      <div
        className="h-[calc(100vh-130px)] overflow-y-auto overflow-x-hidden p-4 duration-150"
        id="chat-container"
      >
        {chatConversations
          .filter((message) => message.content !== "" && message.role !== "")
          .map((message, index) => (
            <ChatBubble message={message} key={index} />
          ))}
        {queryErrored && (
          <div className="mt-4 w-fit rounded-md border border-red-500 bg-red-500/20 px-4 py-3 text-sm text-primary">
            {queryErroredMessage}
          </div>
        )}
        {streamClosed && (
          <span className="absolute bottom-24 z-10 mb-2 w-full bg-tertiary py-1.5 text-center font-sans text-sm text-secondary">
            You have stopped generating. You can start again by typing in the
            input below.
          </span>
        )}
        {id === "new" && (
          <span className="mx-auto mb-2 block w-screen py-1.5 text-center font-sans text-sm text-tertiary">
            <strong className="mr-1">Note:</strong> AI may give incorrect
            information due to not being trained with data beyond September
            2021.
          </span>
        )}
      </div>

      <button
        className={`fixed left-1/2 z-10 -translate-x-1/2 transform rounded border border-primary bg-tertiary px-3 py-2 transition duration-300 ease-in-out hover:bg-primaryBtnHover
           ${
             streamOngoing
               ? "bottom-20 -translate-y-full opacity-100"
               : "-translate-y-0 opacity-0"
           }
          `}
        onClick={handleCloseStream}
      >
        <span className="flex items-center font-sans text-sm font-normal text-secondary">
          Stop Generating
          <KbdShort keys={["⌘", "E"]} additionalStyles="ml-2" />
        </span>
      </button>
      <section className="absolute bottom-0 w-full bg-primary p-4">
        <PromptInput
          key={id}
          sendPrompt={sendPrompt}
          disabled={messages?.[messages.length - 1]?.meta?.loading}
          stopStream={handleCloseStream}
        />
      </section>
    </React.Fragment>
  );
};

export default ChatPage;
