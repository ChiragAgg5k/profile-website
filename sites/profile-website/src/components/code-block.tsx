"use client";
import { useTheme } from "next-themes";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { ComponentProps, useState, useEffect } from "react";

const CodeBlock = (props: ComponentProps<"pre">) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const codeElement = props.children as React.ReactElement;
  const codeText = codeElement?.props?.children || "";
  const language = (codeElement?.props?.className?.replace(/language-/, "") ||
    "typescript") as Language;

  // Choose theme based on current theme
  const prismTheme =
    theme === "dark" || resolvedTheme === "dark"
      ? themes.vsDark
      : themes.vsLight;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative group rounded-lg overflow-hidden my-6 border border-border">
      <Highlight theme={prismTheme} code={codeText} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} py-4 overflow-x-auto bg-background text-xs sm:text-sm`}
            style={style}
          >
            {tokens
              .filter(
                (line, i) =>
                  !(
                    i === tokens.length - 1 &&
                    line.length === 1 &&
                    line[0].empty
                  ),
              )
              .map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                const {
                  key: lineKey,
                  className: lineClassName,
                  ...restLineProps
                } = lineProps;
                return (
                  // globals.css forces !px-0 on pre so long lines can scroll
                  // edge to edge, so the horizontal padding lives on each line.
                  <div
                    key={i}
                    className={`${lineClassName ?? ""} px-4`}
                    {...restLineProps}
                  >
                    {line.map((token, key) => {
                      const tokenProps = getTokenProps({ token, key });
                      const { key: tokenKey, ...restTokenProps } = tokenProps;
                      return <span key={key} {...restTokenProps} />;
                    })}
                  </div>
                );
              })}
          </pre>
        )}
      </Highlight>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground p-1 rounded text-xs transition-all opacity-0 group-hover:opacity-100 border border-border"
        aria-label="Copy code to clipboard"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CodeBlock;
