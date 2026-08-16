import type { MDXComponents } from "mdx/types";
import { ComponentProps } from "react";
import { AgentClock } from "./components/agent-clock";
import { BackoffJitter } from "./components/backoff-jitter";
import { BlogFigure } from "./components/blog-figure";
import CodeBlock from "./components/code-block";
import { ConnectionReuse } from "./components/connection-reuse";
import { HandshakeWire } from "./components/handshake-wire";
import { InterfaceAdoptionChart } from "./components/interface-adoption-chart";
import { Mermaid } from "./components/mermaid-diagram";
import { ReferenceCycle } from "./components/reference-cycle";
import { RoundTrip } from "./components/round-trip";
import { SessionAffinity } from "./components/session-affinity";
import { SpendRamp } from "./components/spend-ramp";
import { SteeringTable } from "./components/steering-table";
import { ToolSurfaceChart } from "./components/tool-surface-chart";
import { UploadPathComparison } from "./components/upload-path-comparison";
import GitHub from "./components/ui/github";
import YouTube from "./components/ui/youtube";

type CustomLinkProps = {
  href: string;
  children: React.ReactNode;
} & Omit<ComponentProps<"a">, "href">;

type HeadingProps = {
  as: keyof typeof headingStyles;
  id?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<"h1">, "id">;

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  if (href.startsWith("/")) {
    return (
      <a href={href} {...props} className="underline">
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props} className="underline">
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className="underline"
    >
      {children}
    </a>
  );
};

const CustomImage = ({ alt = "", ...props }: ComponentProps<"img">) => {
  return (
    <span className="my-6 w-full overflow-hidden relative block">
      <img
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto object-contain rounded-lg max-h-[500px] my-4 bg-transparent"
        loading="lazy"
        {...props}
      />
    </span>
  );
};

const headingStyles = {
  h1: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-10 mb-4",
  h2: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-8 mb-4",
  h3: "text-lg sm:text-xl md:text-2xl font-bold tracking-tight mt-6 mb-3",
  h4: "text-base sm:text-lg md:text-xl font-bold tracking-tight mt-4 mb-2",
  h5: "text-sm sm:text-base md:text-lg font-bold tracking-tight mt-4 mb-2",
  h6: "text-sm sm:text-base font-bold tracking-tight mt-4 mb-2",
} as const;

const Heading = ({
  as: Component,
  id,
  className,
  children,
  ...props
}: HeadingProps) => {
  const headingClassName = headingStyles[Component] || "";

  return (
    <Component
      id={id}
      className={`${headingClassName} ${className || ""}`}
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="anchor-link ml-2 text-gray-400 opacity-0 hover:opacity-100"
        >
          #
        </a>
      )}
    </Component>
  );
};

const Pre = (props: ComponentProps<"pre">) => {
  return <CodeBlock {...props} />;
};

const Code = (props: ComponentProps<"code">) => (
  <code
    className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] text-black dark:bg-neutral-800 dark:text-gray-200"
    {...props}
  />
);

const InlineCode = (props: ComponentProps<"code">) => (
  <code
    className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] text-black dark:bg-neutral-800 dark:text-gray-200"
    {...props}
  />
);

const Paragraph = (props: ComponentProps<"p">) => (
  <p
    className="text-sm text-black dark:text-gray-300 sm:text-base leading-6 sm:leading-7 mb-4"
    {...props}
  />
);

const Blockquote = (props: ComponentProps<"blockquote">) => (
  <blockquote
    className="border-l-4 underline border-gray-300 pl-4 italic my-6 text-sm sm:text-base"
    {...props}
  />
);

const Hr = () => <hr className="my-8 border-gray-200" />;

// Rules only, no grid: vertical borders on a near-black surface read as a cage,
// and a package name shouldn't wrap mid-token just because a cell is narrow.
// Width is content-driven, with a phone-sized floor so prose columns scroll
// rather than collapse to three words a line.
const Table = (props: ComponentProps<"table">) => (
  <div className="my-8 overflow-x-auto">
    <table
      className="border-collapse text-left max-sm:min-w-[34rem] [&_code]:whitespace-nowrap [&_tbody_tr:hover]:bg-gray-50 [&_tbody_tr:last-child_td]:border-0 [&_tbody_tr]:transition-colors dark:[&_tbody_tr:hover]:bg-neutral-900/60"
      {...props}
    />
  </div>
);

const Th = (props: ComponentProps<"th">) => (
  <th
    className="border-b border-gray-300 pb-2 pr-6 align-bottom text-xs font-semibold uppercase tracking-wider text-gray-500 last:pr-0 dark:border-neutral-700 dark:text-gray-400"
    {...props}
  />
);

const Td = (props: ComponentProps<"td">) => (
  <td
    className="border-b border-gray-200 py-3 pr-6 align-top text-sm leading-6 text-black last:pr-0 dark:border-neutral-800 dark:text-gray-300"
    {...props}
  />
);

const List = (props: ComponentProps<"ul">) => (
  <ul className="my-6 ml-6 list-disc" {...props} />
);

const OrderedList = (props: ComponentProps<"ol">) => (
  <ol className="my-6 ml-6 list-decimal" {...props} />
);

const ListItem = (props: ComponentProps<"li">) => (
  <li
    className="mt-2 text-sm text-black dark:text-gray-300 sm:text-base"
    {...props}
  />
);

const MDXWrapper = ({ children, ...props }: ComponentProps<"div">) => {
  // Filter out Next.js specific props that shouldn't be passed to DOM elements
  const { searchParams, ...domProps } = props as any;
  return (
    <div className="px-6" {...domProps}>
      {children}
    </div>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: MDXWrapper,
    a: CustomLink as any,
    img: CustomImage as any,
    h1: (props: any) => <Heading as="h1" {...props} />,
    h2: (props: any) => <Heading as="h2" {...props} />,
    h3: (props: any) => <Heading as="h3" {...props} />,
    h4: (props: any) => <Heading as="h4" {...props} />,
    h5: (props: any) => <Heading as="h5" {...props} />,
    h6: (props: any) => <Heading as="h6" {...props} />,
    p: Paragraph,
    pre: Pre,
    code: Code,
    inlineCode: InlineCode,
    blockquote: Blockquote,
    hr: Hr,
    table: Table,
    th: Th,
    td: Td,
    ul: List,
    ol: OrderedList,
    li: ListItem,
    YouTube,
    GitHub,
    Mermaid,
    BlogFigure,
    ToolSurfaceChart,
    ReferenceCycle,
    ConnectionReuse,
    BackoffJitter,
    SessionAffinity,
    RoundTrip,
    HandshakeWire,
    AgentClock,
    SpendRamp,
    SteeringTable,
    InterfaceAdoptionChart,
    UploadPathComparison,
  };
}
