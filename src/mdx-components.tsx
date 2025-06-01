import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import CodeBlock from "./components/code-block";
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
      <Link href={href} {...props} className="underline">
        {children}
      </Link>
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

const CustomImage = ({ alt = "", ...props }: ComponentProps<typeof Image>) => {
  return (
    <div className="my-6 w-full overflow-hidden relative aspect-[16/9]">
      <Image
        alt={alt}
        fill
        className="object-contain rounded-lg"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
        {...props}
      />
    </div>
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
    className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-xs sm:text-sm"
    {...props}
  />
);

const InlineCode = (props: ComponentProps<"code">) => (
  <code
    className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-xs sm:text-sm"
    {...props}
  />
);

const Paragraph = (props: ComponentProps<"p">) => (
  <p
    className="text-sm text-black dark:text-gray-400 sm:text-base leading-6 sm:leading-7 mb-4"
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

const Table = (props: ComponentProps<"table">) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full border-collapse" {...props} />
  </div>
);

const Th = (props: ComponentProps<"th">) => (
  <th
    className="border border-gray-300 px-4 py-2 text-left font-bold text-sm sm:text-base"
    {...props}
  />
);

const Td = (props: ComponentProps<"td">) => (
  <td
    className="border border-gray-300 px-4 py-2 text-sm sm:text-base"
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
    className="mt-2 text-sm text-black dark:text-gray-400 sm:text-base"
    {...props}
  />
);

const MDXWrapper = (props: ComponentProps<"div">) => (
  <div className="px-6" {...props} />
);

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
  };
}
