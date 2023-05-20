import { ChatMessageParams } from "../../hooks/useChatCompletion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownCode } from "../markdown";

type TChatBubble = {
  message?: ChatMessageParams;
  loading?: boolean;
};

const ChatBubble = ({ message, loading }: TChatBubble) => {
  const anchorRegex = /(https:\/\/\S+)/g;
  const anchorReplacement = "<a href='$1' target='_blank'>$1</a>";

  // if (message?.role === "user") {
  //   const lineBreakRegex = /\r?\n/g;
  //   const lineBreakReplacement = "<br />";
  //   filteredHtml.replace(lineBreakRegex, lineBreakReplacement);
  // }

  return (
    <ReactMarkdown
      children={message?.content || ""}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          return (
            <MarkdownCode
              inline={inline}
              className={className}
              children={children}
              {...props}
            />
          );
        },
      }}
      className={`text-bubble mb-3 w-fit !max-w-[70%] overflow-hidden break-words px-3 py-2 ${
        message?.role === "user"
          ? "ml-auto rounded-l-xl rounded-tr-xl bg-action"
          : "mr-auto rounded-r-xl rounded-tl-xl bg-hover"
      }`}
    />
  );
};

export default ChatBubble;
