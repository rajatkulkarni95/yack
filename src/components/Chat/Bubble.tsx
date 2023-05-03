import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import hljs from "highlight.js";
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
  const currentTheme = document.documentElement.getAttribute("data-theme");

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

  const anchorRegex = /(https:\/\/\S+)/g;
  const anchorReplacement = "<a href='$1' target='_blank'>$1</a>";

  let filteredHtml = html.replace(anchorRegex, anchorReplacement);

  if (message?.role === "user") {
    const lineBreakRegex = /\r?\n/g;
    const lineBreakReplacement = "<br />";
    filteredHtml.replace(lineBreakRegex, lineBreakReplacement);
  }

  return (
    <div
      className={`py-2 px-3 text-bubble break-words w-fit !max-w-[70%] overflow-hidden mb-3 ${
        message?.role === "user"
          ? "bg-action ml-auto rounded-l-xl rounded-tr-xl"
          : "bg-secondary mr-auto rounded-tl-xl rounded-r-xl"
      }`}
      dangerouslySetInnerHTML={{ __html: filteredHtml }}
    >
      {loading && <span>Loading...</span>}
    </div>
  );
};

export default ChatBubble;
