import React from "react";
import { CopyIcon } from "../../svg";

type TProps = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
};

const MarkdownCode = ({ inline, className, children, ...props }: TProps) => {
  const copyCode = (codeBlock: string) => {
    navigator.clipboard.writeText(codeBlock).then(
      () => {
        console.log("Copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <React.Fragment>
      <div className="box-border flex w-full items-center justify-between overflow-y-hidden rounded-t-md border-b border-primary bg-hover px-3 py-1 text-xs text-secondary">
        <span>{match[1]}</span>
        <button
          className="group flex rounded bg-transparent p-1 transition-opacity duration-200 hover:bg-tertiary"
          onClick={() => copyCode(String(children).replace(/\n$/, ""))}
        >
          <CopyIcon className="h-4 w-4 text-icon group-hover:text-primary" />
        </button>
      </div>
      <code
        className={`${match[1] === "bash" ? "language-sh" : match[1]}`}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </code>{" "}
    </React.Fragment>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default MarkdownCode;
