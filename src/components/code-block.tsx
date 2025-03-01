"use client";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { ComponentProps, useState } from "react";

const CodeBlock = (props: ComponentProps<"pre">) => {
  const [copied, setCopied] = useState(false);

  const codeElement = props.children as React.ReactElement;
  const codeText = codeElement?.props?.children || "";
  const language = (codeElement?.props?.className?.replace(/language-/, "") ||
    "typescript") as Language;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-6">
      <Highlight theme={themes.vsDark} code={codeText} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 overflow-x-auto`} style={style}>
            {tokens
              .filter(
                (line, i) =>
                  !(
                    i === tokens.length - 1 &&
                    line.length === 1 &&
                    line[0].empty
                  ),
              )
              .map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  <span className="text-gray-500 mr-4 inline-block w-6 text-right select-none">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
          </pre>
        )}
      </Highlight>
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
