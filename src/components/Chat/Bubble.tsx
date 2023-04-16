import { TMessage } from "../../pages/chat/[id]";

type TChatBubble = {
  message: TMessage;
};

const ChatBubble = ({ message }: TChatBubble) => {
  return (
    <div
      className={`py-2 px-3 text-base text-primary w-fit max-w-[70%] rounded-lg mb-3 ${
        message.role === "user" ? "bg-action ml-auto" : "bg-secondary mr-auto"
      }`}
    >
      {message.content}
    </div>
  );
};

export default ChatBubble;
