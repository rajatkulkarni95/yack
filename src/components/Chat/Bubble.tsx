import { ChatMessageParams } from "../../hooks/useChatCompletion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { MarkdownCode } from "../markdown";

type TChatBubble = {
  message?: ChatMessageParams;
};

const ChatBubble = ({ message }: TChatBubble) => {
  return (
    <ReactMarkdown
      children={message?.content || ""}
      remarkPlugins={[remarkGfm, remarkBreaks]}
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
        a({ node, href, children, ...props }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
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
