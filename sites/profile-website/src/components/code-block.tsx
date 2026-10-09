"use client";
import { useTheme } from "next-themes";
import { Highlight, Prism, themes, type Language } from "prism-react-renderer";
import { ComponentProps, useState, useEffect } from "react";
import { track, TrackingEvent } from "@/lib/tracking";

// prism-react-renderer ships its own Prism with a fixed language set that
// leaves out most of what this blog writes in — bash above all, then php.
// Without a grammar a block renders as one flat token, so pull the missing
// ones from prismjs. The components are scripts that attach to a global
// `Prism`, hence the assignment before the imports, and php needs
// markup-templating in place first.
export const aliases: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  env: "bash",
  dockerfile: "docker",
};

let grammars: Promise<void> | null = null;

export const loadGrammars = (): Promise<void> => {
  grammars ??= (async () => {
    (globalThis as { Prism?: unknown }).Prism = Prism;
    await import("prismjs/components/prism-markup-templating");
    await Promise.all([
      import("prismjs/components/prism-php"),
      import("prismjs/components/prism-bash"),
      import("prismjs/components/prism-java"),
      import("prismjs/components/prism-http"),
      import("prismjs/components/prism-docker"),
    ]);
  })();

  return grammars;
};

const CodeBlock = (props: ComponentProps<"pre">) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    // Highlight once the extra grammars are in, so a php block doesn't paint
    // itself flat on first render and then restyle.
    loadGrammars()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setMounted(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const codeElement = props.children as React.ReactElement;
  const codeText = codeElement?.props?.children || "";
  const declared =
    codeElement?.props?.className?.replace(/language-/, "") || "typescript";
  const language = (aliases[declared] ?? declared) as Language;

  // Choose theme based on current theme
  const prismTheme =
    theme === "dark" || resolvedTheme === "dark"
      ? themes.vsDark
      : themes.vsLight;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      track(TrackingEvent.CodeCopied, { language });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Plain markup until the grammars land — returning null here dropped every
  // block from the prerendered HTML.
  if (!mounted) {
    return (
      <div className="relative group rounded-lg overflow-hidden my-6 border border-border">
        <pre className="py-4 overflow-x-auto bg-background text-xs sm:text-sm">
          {/* globals.css forces !px-0 on pre, so pad the inner element. */}
          <code className={`language-${language} block px-4`}>{codeText}</code>
        </pre>
      </div>
    );
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
