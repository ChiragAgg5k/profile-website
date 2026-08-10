"use client";

import { useTheme } from "next-themes";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { aliases, loadGrammars } from "@/components/code-block";

type Tone = "removed" | "added";

type WireFrameProps = {
  title: string;
  /** Short right-aligned count, e.g. "2 round trips". */
  badge?: string;
  language?: string;
  /** 1-indexed lines to tint. */
  highlight?: number[];
  tone?: Tone;
  code: string;
};

const tones: Record<Tone, string> = {
  removed:
    "border-l-2 border-[#e05252] bg-[#e05252]/[0.07] dark:bg-[#e05252]/[0.12]",
  added:
    "border-l-2 border-[#2a78d6] bg-[#2a78d6]/[0.07] dark:border-[#3987e5] dark:bg-[#3987e5]/[0.12]",
};

/**
 * A single request on the wire, in a titled window. Unlike a plain fenced
 * block it can point at specific lines, which is the entire reason a
 * before/after pair reads at a glance.
 */
export const WireFrame = ({
  title,
  badge,
  language = "http",
  highlight = [],
  tone = "removed",
  code,
}: WireFrameProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    loadGrammars()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setMounted(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const prismTheme =
    theme === "dark" || resolvedTheme === "dark"
      ? themes.vsDark
      : themes.vsLight;
  const tinted = new Set(highlight);
  const resolved = (aliases[language] ?? language) as Language;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center gap-3 border-b border-border bg-gray-50 px-3 py-2 dark:bg-neutral-900">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ec6a5e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f4bf4f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#61c554]" />
        </span>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {badge ? (
          <span className="ml-auto rounded border border-gray-200 px-2 py-0.5 font-mono text-[10px] text-gray-500 dark:border-neutral-700 dark:text-gray-400">
            {badge}
          </span>
        ) : null}
      </div>

      <Highlight theme={prismTheme} code={code.trim()} language={resolved}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto bg-background py-3 text-xs sm:text-[13px]`}
            style={style}
          >
            {tokens.map((line, index) => {
              const {
                key,
                className: lineClassName,
                ...rest
              } = getLineProps({
                line,
                key: index,
              });

              return (
                // globals.css forces !px-0 on pre so long lines scroll edge to
                // edge, so the horizontal padding lives on each line.
                // min-h keeps the blank line between headers and body from
                // collapsing, which is the line that makes it read as HTTP.
                <div
                  key={index}
                  className={`${lineClassName ?? ""} min-h-[1.35em] px-4 ${
                    tinted.has(index + 1)
                      ? tones[tone]
                      : "border-l-2 border-transparent"
                  }`}
                  {...rest}
                >
                  {line.map((token, tokenIndex) => {
                    const { key: tokenKey, ...tokenProps } = getTokenProps({
                      token,
                      key: tokenIndex,
                    });

                    return <span key={tokenIndex} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
