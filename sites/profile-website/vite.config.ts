import { defineConfig, type Plugin } from "vite";
import { fileURLToPath, URL } from "node:url";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

const assetPathPattern = /\.[a-z0-9]+$/i;

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    (() => {
      const plugin = mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
      }) as unknown as Plugin;

      plugin.enforce = "pre";
      return plugin;
    })(),
    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        crawlLinks: true,
        failOnError: true,
        filter: (page) => !assetPathPattern.test(page.path),
      },
    }),
    react(),
  ],
});
