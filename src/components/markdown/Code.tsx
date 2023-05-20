import React, { useMemo, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  nightOwl,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CheckIcon, CopyIcon } from "../../svg";

type TProps = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
};

const MarkdownCode = ({ inline, className, children, ...props }: TProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const theme = window.localStorage.getItem("theme");
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

  const syntaxHighlighter = useMemo(() => {
    return (
      <SyntaxHighlighter
        language={match?.[1]}
        style={theme === "light" ? a11yLight : nightOwl}
        PreTag={({ children }) => <React.Fragment>{children}</React.Fragment>}
        wrapLongLines
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  }, []);

  return !inline && match ? (
    <React.Fragment>
      <div className="sticky top-0 box-border flex w-full items-center justify-between overflow-y-hidden rounded-t-md border-b border-primary bg-secondary px-3 py-1 text-xs text-secondary">
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
      {syntaxHighlighter}
    </React.Fragment>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default MarkdownCode;
