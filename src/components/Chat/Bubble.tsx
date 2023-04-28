import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { ChatMessageParams } from "../../hooks/useChatCompletion";

type TChatBubble = {
  message?: ChatMessageParams;
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
  const html = converter.makeHtml(message?.content || "");

  const regexPattern = /(https:\/\/\S+)/g;
  const replacementString = "<a href='$1' target='_blank'>$1</a>";

  const filteredHtml = html.replace(regexPattern, replacementString);

  return (
    <div
      className={`py-2 px-3 text-bubble break-words w-fit !max-w-[70%] overflow-hidden rounded-lg mb-3 ${
        message?.role === "user" ? "bg-action ml-auto" : "bg-secondary mr-auto"
      }`}
      dangerouslySetInnerHTML={{ __html: filteredHtml }}
    >
      {loading && <span>Loading...</span>}
    </div>
  );
};

export default ChatBubble;
