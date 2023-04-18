import { TConversation } from "../../pages/chat/[id]";
import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

// import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

type TChatBubble = {
  message: TConversation;
  loading?: boolean;
};

// function extractLanguageFromCodeBlock(inputString: string): string | null {
//   const codeBlockRegex = /^```([\w+#-]+)$/gm;
//   const match = codeBlockRegex.exec(inputString);
//   return match ? match[1] : "javascript";
// }

const ChatBubble = ({ message, loading }: TChatBubble) => {
  const converter = new showdown.Converter({
    extensions: [
      showdownHighlight({
        // Whether to add the classes to the <pre> tag, default is false
        pre: true,
        // Whether to use hljs' auto language detection, default is true
        auto_detection: true,
      }),
    ],
  });
  const html = converter.makeHtml(message.conversation.content);

  return (
    <div
      className={`py-2 px-3 text-bubble break-words w-fit !max-w-[70%] whitespace-pre-wrap rounded-lg mb-3 ${
        message.conversation.role === "user"
          ? "bg-action ml-auto"
          : "bg-secondary mr-auto"
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    >
      {/* {loading && <EllipsisHorizontalIcon className="h-5 w-5 animate-spin" />} */}
    </div>
  );
};

export default ChatBubble;
