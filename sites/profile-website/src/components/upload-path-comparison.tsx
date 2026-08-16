import { Caption, Mono } from "@/components/mermaid-diagram";

const Step = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-gray-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-gray-300">
    {children}
  </span>
);

const Arrow = () => (
  <span
    className="text-xs text-gray-300 dark:text-neutral-600"
    aria-hidden="true"
  >
    →
  </span>
);

export const UploadPathComparison = () => (
  <figure className="my-10" aria-label="Hosted MCP and CLI upload comparison">
    <p className="mb-4 text-sm font-medium text-black dark:text-gray-200">
      Same upload, different transport
    </p>

    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
      <div className="grid border-b border-gray-200 dark:border-neutral-800 sm:grid-cols-[8rem_1fr]">
        <div className="flex items-center justify-between gap-3 bg-blue-50 px-4 py-3 dark:bg-blue-950/30 sm:block">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            Hosted MCP
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70">
            10 MB inline cap
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-4 py-4 dark:bg-neutral-900/50">
          <Step>site.zip</Step>
          <Arrow />
          <Step>base64</Step>
          <Arrow />
          <Step>JSON string</Step>
          <Arrow />
          <Step>server decodes</Step>
        </div>
      </div>

      <div className="grid sm:grid-cols-[8rem_1fr]">
        <div className="flex items-center justify-between gap-3 bg-gray-100 px-4 py-3 dark:bg-neutral-900 sm:block">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            CLI
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-gray-500">
            Local file access
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-4 dark:bg-neutral-950">
          <Step>site.zip</Step>
          <Arrow />
          <Step>./site.zip</Step>
          <Arrow />
          <Step>upload bytes</Step>
        </div>
      </div>
    </div>

    <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-center text-xs text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
      Hosted MCP input:{" "}
      <Mono>{`{"filename":"site.zip","content":"<base64>","encoding":"base64"}`}</Mono>
    </div>

    <Caption>
      The CLI has no MCP transport cap. Appwrite&apos;s normal product upload
      limits still apply to both paths.
    </Caption>
  </figure>
);
