import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CheckIcon, CopyIcon } from "../../svg";

type TProps = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
};

const MarkdownCode = ({ inline, className, children, ...props }: TProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyCode = (codeBlock: string) => {
    navigator.clipboard.writeText(codeBlock).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <React.Fragment>
      <div className="box-border flex items-center justify-between overflow-y-hidden rounded-t-md border-b border-primary bg-hover px-3 py-1 text-xs text-secondary">
        <span>{match[1]}</span>
        {isCopied ? (
          <span className="flex items-center p-1 text-xs">
            Copied <CheckIcon className="ml-1 h-4 w-4 text-green-600" />
          </span>
        ) : (
          <button
            className="group flex rounded bg-transparent p-1 transition-opacity duration-200 hover:bg-tertiary"
            onClick={() => copyCode(String(children).replace(/\n$/, ""))}
          >
            <CopyIcon className="h-4 w-4 text-icon group-hover:text-primary" />
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language={match[1]}
        style={nightOwl}
        PreTag={({ children }) => <React.Fragment>{children}</React.Fragment>}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </React.Fragment>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default MarkdownCode;
