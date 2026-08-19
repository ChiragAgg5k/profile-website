// One dot per operation. Both fields share a viewBox width, so they scale
// together at any column width and the 30× gap stays a real length rather than
// a numeral the reader has to take on trust.
// Vercel: 33 dots, 11 across by 3 down. Appwrite: 992, 62 across by 16 down.
const PITCH = 12;
const COLUMNS = 62;
const WIDTH = COLUMNS * PITCH;

const Dots = ({
  id,
  columns,
  rows,
}: {
  id: string;
  columns: number;
  rows: number;
}) => (
  <svg
    viewBox={`0 0 ${WIDTH} ${rows * PITCH}`}
    className="block h-auto w-full"
    role="presentation"
  >
    <defs>
      <pattern
        id={id}
        width={PITCH}
        height={PITCH}
        patternUnits="userSpaceOnUse"
      >
        <circle cx={PITCH / 3} cy={PITCH / 3} r="2.5" fill="currentColor" />
      </pattern>
    </defs>
    <rect width={columns * PITCH} height={rows * PITCH} fill={`url(#${id})`} />
  </svg>
);

const metaTools = ["get_context", "search_tools", "call_tool", "search_docs"];

export const McpToolReach = () => (
  <figure className="my-10">
    <div className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-x-6">
      <div>
        <p className="text-sm font-medium text-black dark:text-gray-200">
          Vercel
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          33 named tools, called directly
        </p>
      </div>
      <div className="text-gray-400 dark:text-neutral-500">
        <Dots id="reach-vercel" columns={11} rows={3} />
        <p className="mt-2 font-mono text-[0.6875rem] text-gray-500 dark:text-gray-400">
          33 · each reached in a single named call
        </p>
      </div>
    </div>

    <div className="mt-8 grid gap-3 border-t border-gray-200 pt-8 dark:border-neutral-800 sm:grid-cols-[9rem_1fr] sm:gap-x-6">
      <div>
        <p className="text-sm font-medium text-[#f02e65] dark:text-[#fd366e]">
          Appwrite
        </p>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          4 meta-tools in front of everything
        </p>
        {/* The gate lives in the label column so both dot fields keep the same
            rendered width, which is what makes the comparison to scale. */}
        <ul className="inline-block rounded border border-[#f02e65]/40 px-2.5 py-2 dark:border-[#fd366e]/40">
          {metaTools.map((tool) => (
            <li
              key={tool}
              className="font-mono text-[0.625rem] leading-5 text-gray-600 dark:text-gray-300"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-[#f02e65] dark:text-[#fd366e]">
        <Dots id="reach-appwrite" columns={COLUMNS} rows={16} />
        <p className="mt-2 font-mono text-[0.6875rem] text-gray-500 dark:text-gray-400">
          992 across 81 services · each reached in two, none of them named up
          front
        </p>
      </div>
    </div>
  </figure>
);
