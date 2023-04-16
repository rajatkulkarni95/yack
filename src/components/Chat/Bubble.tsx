import { TConversation } from "../../pages/chat/[id]";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

type TChatBubble = {
  message: TConversation;
  loading?: boolean;
};

const ChatBubble = ({ message, loading }: TChatBubble) => {
  return (
    <div
      className={`py-2 px-3 text-base flex items-center text-primary w-fit max-w-[70%] whitespace-pre-wrap rounded-lg mb-3 ${
        message.conversation.role === "user"
          ? "bg-action ml-auto"
          : "bg-secondary mr-auto"
      }`}
    >
      {message.conversation.content}{" "}
      {loading && <EllipsisHorizontalIcon className="h-5 w-5 animate-spin" />}
    </div>
  );
};

export default ChatBubble;
