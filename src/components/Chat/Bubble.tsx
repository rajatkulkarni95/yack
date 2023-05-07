import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import hljs from "highlight.js";
import { ChatMessageParams } from "../../hooks/useChatCompletion";
import { useEffect } from "react";

type TChatBubble = {
  message?: ChatMessageParams;
  loading?: boolean;
};

function extractLanguageFromCodeBlock(inputString: string): string | null {
  const codeBlockRegex = /^```([\w+#-]+)$/gm;
  const match = codeBlockRegex.exec(inputString);
  return match ? match[1] : "javascript";
}

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

  // Function that finds all pre > code blocks in the dom, and adds a button with a copy icon to each
  // which copies the code to the clipboard when clicked
  const addCopyButtons = () => {
    const codeBlocks = document.querySelectorAll("pre > code");
    codeBlocks.forEach((codeBlock) => {
      if (codeBlock.parentElement?.querySelector(".copy-button")) return;
      const copyButton = document.createElement("button");
      copyButton.className =
        "copy-button absolute top-1 right-1 flex z-10 p-1 bg-secondary rounded bg-transparent hover:bg-tertiary group";
      copyButton.style.cursor = "pointer";
      copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-icon group-hover:text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
    `;
      copyButton.addEventListener("click", () => copyCode(codeBlock));

      codeBlock.parentNode?.appendChild(copyButton);
    });
  };

  const copyCode = (codeBlock: Element) => {
    const code = codeBlock.textContent || "";
    navigator.clipboard.writeText(code).then(
      () => {
        console.log("Copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  useEffect(() => {
    addCopyButtons();
  }, [html]);

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
      className={`py-2 px-3 text-bubble break-words w-fit !max-w-[70%] overflow-hidden shadow-sm mb-3 ${
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
