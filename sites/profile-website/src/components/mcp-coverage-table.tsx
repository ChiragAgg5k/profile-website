// Three states rather than bold-for-winner: bold was carrying both "this side
// wins" and "read this bit", so rows where both servers are strong looked the
// same as rows where one had nothing.
type Level = "strong" | "partial" | "none";

type Row = {
  useCase: string;
  appwrite: [Level, string];
  vercel: [Level, string];
};

const rows: Row[] = [
  {
    useCase: "Static and SSR deployment",
    appwrite: ["partial", "Sites, deployments, activation"],
    vercel: ["strong", "One-call project creation"],
  },
  {
    useCase: "Build and runtime logs",
    appwrite: ["partial", "Available, with defects"],
    vercel: ["strong", "Dedicated, filter-rich tools"],
  },
  {
    useCase: "Auth and user management",
    appwrite: ["strong", "Full backend management"],
    vercel: ["none", "Not exposed"],
  },
  {
    useCase: "Databases and storage",
    appwrite: ["strong", "Full backend management"],
    vercel: ["none", "Not exposed"],
  },
  {
    useCase: "Functions",
    appwrite: ["strong", "CRUD, deployments, executions, variables"],
    vercel: ["partial", "Runtime and deployment inspection"],
  },
  {
    useCase: "Usage and analytics",
    appwrite: ["strong", "Resource and compute metrics"],
    vercel: ["strong", "Visitors, pageviews, routes, events"],
  },
  {
    useCase: "Deployment protection",
    appwrite: ["partial", "Site and project controls"],
    vercel: ["strong", "Direct protection and bypass tools"],
  },
  {
    useCase: "Domains",
    appwrite: ["strong", "Domain catalog and DNS"],
    vercel: ["strong", "Availability, purchase, management"],
  },
  {
    useCase: "Agent collaboration",
    appwrite: ["none", "No direct equivalent"],
    vercel: ["strong", "Agent traces and toolbar threads"],
  },
  {
    useCase: "Rollback and cleanup",
    appwrite: ["strong", "Activation, rollback, delete"],
    vercel: ["none", "Not exposed through the tested tools"],
  },
];

const fill = {
  appwrite: "bg-[#f02e65] dark:bg-[#fd366e]",
  vercel: "bg-gray-500 dark:bg-neutral-300",
} as const;

// Partial is a ring rather than a faded dot: at 8px an opacity step is too
// close to the filled state to read.
const ring = {
  appwrite: "border-[#f02e65] dark:border-[#fd366e]",
  vercel: "border-gray-500 dark:border-neutral-300",
} as const;

const Marker = ({
  level,
  column,
}: {
  level: Level;
  column: "appwrite" | "vercel";
}) => {
  if (level === "none") {
    return (
      <span
        className="mt-[7px] h-px w-2 shrink-0 bg-gray-300 dark:bg-neutral-700"
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`mt-1.5 size-2 shrink-0 rounded-full ${
        level === "partial" ? `border-[1.5px] ${ring[column]}` : fill[column]
      }`}
      aria-hidden="true"
    />
  );
};

const Cell = ({
  level,
  text,
  column,
}: {
  level: Level;
  text: string;
  column: "appwrite" | "vercel";
}) => (
  <div className="flex gap-2.5">
    <Marker level={level} column={column} />
    <span
      className={
        level === "none"
          ? "text-gray-400 dark:text-neutral-500"
          : level === "strong"
            ? "font-medium text-black dark:text-white"
            : "text-gray-600 dark:text-gray-400"
      }
    >
      {text}
    </span>
    <span className="sr-only">
      {level === "strong"
        ? "Strong coverage"
        : level === "partial"
          ? "Partial coverage"
          : "Not exposed"}
    </span>
  </div>
);

const LegendKey = ({
  className,
  label,
}: {
  className: string;
  label: string;
}) => (
  <span className="flex items-center gap-1.5">
    <span className={className} aria-hidden="true" />
    {label}
  </span>
);

const head =
  "border-b border-gray-300 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-neutral-700 dark:text-gray-400";

const cell =
  "border-b border-gray-200 py-3 align-top text-sm leading-6 dark:border-neutral-800";

export const McpCoverageTable = () => (
  <figure className="my-10">
    <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
      <LegendKey
        className="size-2 rounded-full bg-gray-500 dark:bg-neutral-300"
        label="Strong"
      />
      <LegendKey
        className="size-2 rounded-full border-[1.5px] border-gray-500 dark:border-neutral-300"
        label="Partial"
      />
      <LegendKey
        className="h-px w-2 bg-gray-300 dark:bg-neutral-700"
        label="Not exposed"
      />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left max-sm:min-w-[42rem] [&_tbody_tr:hover]:bg-gray-50 [&_tbody_tr:last-child_td]:border-0 [&_tbody_tr]:transition-colors dark:[&_tbody_tr:hover]:bg-neutral-900/60">
        <thead>
          <tr>
            <th className={`${head} pr-6`}>Use case</th>
            <th className={`${head} px-3`}>Appwrite MCP</th>
            <th className={`${head} pl-3`}>Vercel MCP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.useCase}>
              <td
                className={`${cell} pr-6 text-black dark:text-gray-300`}
                scope="row"
              >
                {row.useCase}
              </td>
              <td className={`${cell} px-3`}>
                <Cell
                  level={row.appwrite[0]}
                  text={row.appwrite[1]}
                  column="appwrite"
                />
              </td>
              <td className={`${cell} pl-3`}>
                <Cell
                  level={row.vercel[0]}
                  text={row.vercel[1]}
                  column="vercel"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </figure>
);
