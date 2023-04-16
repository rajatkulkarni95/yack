import { TConversation, TMessage } from "../../pages/chat/[id]";

type TChatBubble = {
  message: TConversation;
};

const ChatBubble = ({ message }: TChatBubble) => {
  return (
    <div
      className={`py-2 px-3 text-base text-primary w-fit max-w-[70%] whitespace-pre-wrap rounded-lg mb-3 ${
        message.conversation.role === "user"
          ? "bg-action ml-auto"
          : "bg-secondary mr-auto"
      }`}
    >
      {message.conversation.content}
    </div>
  );
};

export default ChatBubble;
