import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PromptInput } from "../../components/Chat/Input";
import ChatBubble from "../../components/Chat/Bubble";

const DUMMY_MESSAGES = [
  {
    role: "user",
    content: "Hello!",
  },
  {
    role: "assistant",
    content: "Hello there! How may I assist you today?",
  },
  {
    role: "user",
    content: "Who's the prez of Nambia?",
  },
  {
    role: "assistant",
    content:
      "I'm sorry, but there is no country called Nambia. Perhaps you have confused it with Namibia, which has a president named Hage Geingob.",
  },
  {
    role: "user",
    content: "What's the source on that?",
  },
  {
    role: "assistant",
    content:
      "Hage G. Geingob is the current President of the Republic of Namibia. He has been serving as the President since March 2015. You can find more information about him and his presidency in various news and government websites, such as the official website of the Namibian Presidency: https://www.presidency.na/.",
  },
  {
    role: "user",
    content: "What's the source on that?",
  },
  {
    role: "assistant",
    content:
      "Hage G. Geingob is the current President of the Republic of Namibia. He has been serving as the President since March 2015. You can find more information about him and his presidency in various news and government websites, such as the official website of the Namibian Presidency: https://www.presidency.na/.",
  },
];

export type TMessage = {
  role: string;
  content: string;
};

const ChatPage = () => {
  const { id } = useParams();

  if (!id) return null;

  const [messages, setMessages] = useState<TMessage[]>([]);

  useEffect(() => {
    setMessages(DUMMY_MESSAGES);
  }, []);

  const sendPrompt = (prompt: string) => {
    if (!prompt) return;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = 99999999;
      }, 50);
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
