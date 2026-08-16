import { Caption } from "@/components/mermaid-diagram";

// Per-harness steering stats. The combined tool-calls-per-turn figure is the
// one the section is named after, so it carries the emphasis.
type Row = {
  label: string;
  claude: string;
  codex: string;
  combined: string;
  emphasis?: boolean;
};

const rows: Row[] = [
  { label: "Sessions", claude: "200", codex: "1,232", combined: "1,432" },
  {
    label: "Human turns",
    claude: "3,016",
    codex: "10,336",
    combined: "13,352",
  },
  {
    label: "Tool calls",
    claude: "29,438",
    codex: "171,040",
    combined: "200,478",
  },
  {
    label: "Tool calls per human turn",
    claude: "9.8",
    codex: "16.5",
    combined: "15.0",
    emphasis: true,
  },
  { label: "Interrupts", claude: "218", codex: "1,829", combined: "2,047" },
  {
    label: "Median human turns per session",
    claude: "7",
    codex: "4",
    combined: "—",
  },
  {
    label: "Median session length",
    claude: "34 min",
    codex: "16 min",
    combined: "—",
  },
];

const headCell =
  "border-b border-gray-300 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-neutral-700 dark:text-gray-400";

const cell =
  "border-b border-gray-200 py-3 text-sm leading-6 text-black dark:border-neutral-800 dark:text-gray-300";

export const SteeringTable = () => (
  <figure className="my-10">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left max-sm:min-w-[30rem] [&_tbody_tr:hover]:bg-gray-50 [&_tbody_tr:last-child_td]:border-0 [&_tbody_tr]:transition-colors dark:[&_tbody_tr:hover]:bg-neutral-900/60">
        <thead>
          <tr>
            <th className={`${headCell} pr-6`} />
            <th className={`${headCell} px-3 text-right`}>Claude Code</th>
            <th className={`${headCell} px-3 text-right`}>Codex</th>
            <th className={`${headCell} pl-3 text-right`}>Combined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className={`${cell} pr-6`}>{row.label}</td>
              <td className={`${cell} px-3 text-right tabular-nums`}>
                {row.claude}
              </td>
              <td className={`${cell} px-3 text-right tabular-nums`}>
                {row.codex}
              </td>
              <td
                className={`${cell} pl-3 text-right tabular-nums ${
                  row.emphasis ? "font-bold text-black dark:text-white" : ""
                }`}
              >
                {row.combined}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Caption>
      Sessions with at least one human turn, 12 January to 14 August 2026.
      Interrupts are escape presses in Claude Code and aborted turns in Codex.
    </Caption>
  </figure>
);
