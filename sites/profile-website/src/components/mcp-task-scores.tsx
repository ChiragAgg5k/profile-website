// The eight scored tasks from the read and observability phases, all eight of
// them. Quoting a subset flips the impression: Appwrite wins five of these but
// loses the unweighted average, because its three losses are heavier than most
// of its wins.
type Task = {
  name: string;
  appwrite: number;
  vercel: number;
};

const tasks: Task[] = [
  { name: "Workspace and project discovery", appwrite: 3.4, vercel: 4.6 },
  { name: "Resource detail", appwrite: 4.6, vercel: 4.4 },
  { name: "List deployments", appwrite: 3.8, vercel: 3.5 },
  { name: "Deployment detail", appwrite: 4.6, vercel: 4.3 },
  { name: "Build logs", appwrite: 4.0, vercel: 4.6 },
  { name: "Runtime logs", appwrite: 2.4, vercel: 4.2 },
  { name: "Usage and analytics", appwrite: 4.7, vercel: 3.7 },
  { name: "Documentation search", appwrite: 4.3, vercel: 3.5 },
];

const mean = (values: number[]) =>
  (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2);

const Bar = ({
  value,
  tone,
}: {
  value: number;
  tone: "appwrite" | "vercel";
}) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
      <div
        className={`h-full rounded-full ${
          tone === "appwrite"
            ? "bg-[#f02e65] dark:bg-[#fd366e]"
            : "bg-gray-400 dark:bg-neutral-500"
        }`}
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
    <span className="w-7 shrink-0 text-right text-xs tabular-nums text-black dark:text-gray-300">
      {value.toFixed(1)}
    </span>
  </div>
);

export const McpTaskScores = () => (
  <figure className="my-10">
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
      <p className="text-sm font-medium text-black dark:text-gray-200">
        Per-task scores, out of 5
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-[#f02e65] dark:bg-[#fd366e]" />
          Appwrite
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-gray-400 dark:bg-neutral-500" />
          Vercel
        </span>
      </div>
    </div>

    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-neutral-800 dark:border-neutral-800">
      {tasks.map((task) => (
        <div
          key={task.name}
          className="grid gap-2 px-4 py-3 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-4"
        >
          <p className="text-sm text-black dark:text-gray-300">{task.name}</p>
          <div className="flex flex-col gap-1.5">
            <Bar value={task.appwrite} tone="appwrite" />
            <Bar value={task.vercel} tone="vercel" />
          </div>
        </div>
      ))}
    </div>
  </figure>
);
