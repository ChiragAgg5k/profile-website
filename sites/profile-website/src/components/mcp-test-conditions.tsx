// Authored as a component rather than raw JSX in the MDX: MDX runs the children
// of a literal <p> through the markdown paragraph mapping, which nests a <p>
// inside a <p> and fails hydration.
const conditions: [string, string][] = [
  ["Access", "Hosted MCP endpoints, authenticated over OAuth."],
  ["Client", "A single macOS arm64 machine, one continuous session."],
  [
    "Write phase",
    "Static deployment, SSR deployment, an induced build failure, a second version, and a rollback.",
  ],
  [
    "Excluded",
    "No paid protection tier was enabled, and no purchase operation was executed.",
  ],
  [
    "Scope",
    "Results describe the MCP surfaces as tested, not controlled infrastructure benchmarks.",
  ],
];

export const McpTestConditions = () => (
  <section className="my-8 text-xs italic leading-5 text-gray-500 dark:text-gray-400">
    <p className="mb-2 font-semibold">Test conditions</p>
    <ul className="ml-4 list-disc space-y-1">
      {conditions.map(([label, detail]) => (
        <li key={label}>
          <span className="font-semibold">{label}.</span> {detail}
        </li>
      ))}
    </ul>
  </section>
);
