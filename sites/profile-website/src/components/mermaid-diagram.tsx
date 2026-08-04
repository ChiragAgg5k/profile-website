"use client";

import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

// Palette roles validated with the dataviz palette validator (emphasis form:
// one accent hue plus a de-emphasis gray). Both modes are stepped for their own
// surface rather than flipped.
const palette = {
  light: {
    text: "#0b0b0b",
    secondary: "#52514e",
    accent: "#2a78d6",
    accentSoft: "#cde2fb",
    gray: "#8a8880",
    graySoft: "#f0efec",
    border: "#d6d5d0",
  },
  dark: {
    text: "#ffffff",
    secondary: "#c3c2b7",
    accent: "#3987e5",
    accentSoft: "#184f95",
    gray: "#7c7b74",
    graySoft: "#2a2a28",
    border: "#3d3d39",
  },
} as const;

// mermaid.initialize() and mermaid.render() both act on global state, so two
// diagrams mounting at once race each other and one silently renders nothing.
// Every render goes through this queue instead, one at a time.
let renderQueue: Promise<unknown> = Promise.resolve();

const enqueueRender = <T,>(task: () => Promise<T>): Promise<T> => {
  const next = renderQueue.then(task, task);
  renderQueue = next.catch(() => undefined);
  return next;
};

type MermaidProps = {
  chart: string;
  caption?: string;
};

export const Mermaid = ({ chart, caption }: MermaidProps) => {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>("");
  const [failed, setFailed] = useState(false);
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const rendered = await enqueueRender(async () => {
          const mermaid = (await import("mermaid")).default;
          const c = palette[resolvedTheme === "dark" ? "dark" : "light"];

          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            fontFamily: "inherit",
            themeVariables: {
              background: "transparent",
              primaryColor: c.graySoft,
              primaryTextColor: c.text,
              primaryBorderColor: c.border,
              secondaryColor: c.accentSoft,
              tertiaryColor: c.graySoft,
              mainBkg: c.graySoft,
              nodeBorder: c.border,
              lineColor: c.gray,
              textColor: c.text,
              edgeLabelBackground: "transparent",
              clusterBkg: "transparent",
              clusterBorder: c.border,
              actorBkg: c.graySoft,
              actorBorder: c.accent,
              actorTextColor: c.text,
              actorLineColor: c.gray,
              signalColor: c.gray,
              signalTextColor: c.secondary,
              labelBoxBkgColor: c.graySoft,
              labelBoxBorderColor: c.border,
              labelTextColor: c.text,
              loopTextColor: c.secondary,
              noteBkgColor: c.accentSoft,
              noteBorderColor: c.accent,
              noteTextColor: resolvedTheme === "dark" ? c.text : c.text,
              activationBkgColor: c.graySoft,
              activationBorderColor: c.accent,
              sequenceNumberColor: c.text,
            },
            // useMaxWidth: false keeps the SVG at its natural size so a wide
            // diagram scrolls inside its container instead of shrinking the
            // labels to nothing.
            sequence: {
              actorMargin: 60,
              messageFontSize: 13,
              noteFontSize: 12,
              wrap: false,
              useMaxWidth: false,
            },
            flowchart: {
              curve: "basis",
              padding: 8,
              nodeSpacing: 24,
              rankSpacing: 28,
              useMaxWidth: false,
            },
          });

          const { svg } = await mermaid.render(id, chart.trim());
          return svg;
        });

        if (!cancelled) {
          setSvg(rendered);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme, id]);

  // The definition is the accessible fallback: it says the same thing the
  // picture does, so a failed render or a screen reader still gets the content.
  if (failed) {
    return (
      <figure className="my-10">
        <pre className="overflow-x-auto rounded-lg border border-gray-200 p-4 text-xs dark:border-neutral-800">
          {chart.trim()}
        </pre>
        {caption ? <Caption>{caption}</Caption> : null}
      </figure>
    );
  }

  return (
    <figure className="my-10" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView && svg ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto"
        // Mermaid output is generated from a literal in this repo, not user
        // input, and mermaid runs with securityLevel: "strict".
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption ? <Caption>{caption}</Caption> : null}
    </figure>
  );
};

export const Caption = ({ children }: { children: React.ReactNode }) => (
  <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
    {children}
  </figcaption>
);
