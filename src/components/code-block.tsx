"use client";

import { ComponentProps, useState } from "react";

const CodeBlock = (props: ComponentProps<"pre">) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const codeElement = props.children as React.ReactElement;
    const codeText = codeElement?.props?.children || "";

    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group bg-gray-800 rounded-lg">
      <pre className="p-4 ml-4 text-gray-100 overflow-x-auto my-6" {...props} />
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-200 p-1 rounded text-xs transition-all opacity-0 group-hover:opacity-100"
        aria-label="Copy code to clipboard"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CodeBlock;
