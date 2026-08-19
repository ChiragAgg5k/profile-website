// The six stages ran in this order on both platforms, so the order itself is
// not news. What the figure carries is where the two servers parted: a solid
// lane bar is the platform that was measurably better at that stage, a muted bar
// means both completed it, and a dashed bar means the stage was not exposed over
// MCP at all.
type Cell = "edge" | "even" | "absent";

type Stage = {
  name: string;
  fixture: string;
  appwrite: Cell;
  vercel: Cell;
};

const stages: Stage[] = [
  {
    name: "Orient",
    fixture: "workspace + IDs",
    appwrite: "even",
    vercel: "edge",
  },
  {
    name: "Deploy",
    fixture: "same source bytes",
    appwrite: "even",
    vercel: "edge",
  },
  { name: "Break", fixture: "exit code 42", appwrite: "even", vercel: "even" },
  {
    name: "Observe",
    fixture: "3×200 · 1×400 · 1×500",
    appwrite: "even",
    vercel: "edge",
  },
  {
    name: "Recover",
    fixture: "v2 + rollback",
    appwrite: "edge",
    vercel: "absent",
  },
  {
    name: "Burst",
    fixture: "50 requests · c=10",
    appwrite: "even",
    vercel: "even",
  },
];

const bar = (cell: Cell, tone: "appwrite" | "vercel") => {
  if (cell === "absent") {
    return "border border-dashed border-gray-300 dark:border-neutral-700";
  }

  if (cell === "even") {
    return "bg-gray-200 dark:bg-neutral-800";
  }

  return tone === "appwrite"
    ? "bg-[#f02e65] dark:bg-[#fd366e]"
    : "bg-gray-500 dark:bg-neutral-400";
};

const Lane = ({
  label,
  tone,
}: {
  label: string;
  tone: "appwrite" | "vercel";
}) => (
  <>
    <p
      className={`self-center text-sm font-medium ${
        tone === "appwrite"
          ? "text-[#f02e65] dark:text-[#fd366e]"
          : "text-black dark:text-gray-200"
      }`}
    >
      {label}
    </p>
    {stages.map((stage) => (
      <div key={stage.name} className="self-center px-1">
        <div className={`h-2 rounded-sm ${bar(stage[tone], tone)}`} />
      </div>
    ))}
  </>
);

export const McpRunSheet = () => (
  <figure className="my-10 overflow-x-auto">
    <div className="grid min-w-[40rem] grid-cols-[5.5rem_repeat(6,minmax(0,1fr))] gap-y-3">
      {/* The fixture value is the content, so it sits in the column head rather
          than in a footnote. */}
      <div />
      {stages.map((stage, index) => (
        <div key={stage.name} className="px-1">
          <p className="font-mono text-[0.625rem] text-gray-400 dark:text-neutral-500">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="text-sm font-medium text-black dark:text-gray-200">
            {stage.name}
          </p>
          <p className="font-mono text-[0.625rem] leading-4 text-gray-500 dark:text-gray-400">
            {stage.fixture}
          </p>
        </div>
      ))}

      <div className="col-span-7 border-b border-gray-200 dark:border-neutral-800" />

      <Lane label="Appwrite" tone="appwrite" />
      <Lane label="Vercel" tone="vercel" />

      <div className="col-span-7 border-b border-gray-200 dark:border-neutral-800" />
    </div>
  </figure>
);
