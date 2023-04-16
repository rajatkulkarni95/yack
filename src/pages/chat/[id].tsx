import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PromptInput } from "../../components/Chat/Input";
import ChatBubble from "../../components/Chat/Bubble";
import poster from "../../helpers/poster";
import { COMPLETION_API, MODEL, MODELS_API } from "../../constants/API";
import { incrementUsage, saveConversation } from "../../helpers/localstorage";

// const DUMMY_MESSAGES = [
//   {
//     role: "user",
//     content: "Hello!",
//   },
//   {
//     role: "assistant",
//     content: "Hello there! How may I assist you today?",
//   },
//   {
//     role: "user",
//     content: "Who's the prez of Nambia?",
//   },
//   {
//     role: "assistant",
//     content:
//       "I'm sorry, but there is no country called Nambia. Perhaps you have confused it with Namibia, which has a president named Hage Geingob.",
//   },
//   {
//     role: "user",
//     content: "What's the source on that?",
//   },
//   {
//     role: "assistant",
//     content:
//       "Hage G. Geingob is the current President of the Republic of Namibia. He has been serving as the President since March 2015. You can find more information about him and his presidency in various news and government websites, such as the official website of the Namibian Presidency: https://www.presidency.na/.",
//   },
//   {
//     role: "user",
//     content: "What's the source on that?",
//   },
//   {
//     role: "assistant",
//     content:
//       "Hage G. Geingob is the current President of the Republic of Namibia. He has been serving as the President since March 2015. You can find more information about him and his presidency in various news and government websites, such as the official website of the Namibian Presidency: https://www.presidency.na/.",
//   },
// ];

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
  }, []);

  const sendPrompt = async (prompt: string) => {
    if (!prompt) return;
    const payload: TMessage = {
      role: "user",
      content: prompt,
    };

    const message = {
      created: new Date(),
      conversation: payload,
    };

    setMessages((prev) => [...prev, message]);

    const promptMessages = messages.map((message) => message.conversation);
    const prompts = [...promptMessages, payload];

    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = 99999999;
      }, 50);
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
      const currentConversation = [message, responsedMessage];
      saveConversation(currentConversation, id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <div className="p-4 overflow-y-auto max-h-[420px]" id="chat-container">
        {messages.map((message, index) => (
          <ChatBubble message={message} />
        ))}
      </div>
      <section className="absolute bottom-0 w-full p-4 bg-primary">
        <PromptInput sendPrompt={sendPrompt} />
      </section>
    </React.Fragment>
  );
};

export default ChatPage;
