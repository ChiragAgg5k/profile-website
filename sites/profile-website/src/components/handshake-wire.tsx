"use client";

import { WireFrame } from "@/components/wire-frame";

// Bodies are minified so the shape of a request survives at blog width. The
// point of the pair is the header block, not the JSON.
const BEFORE = [
  "POST /mcp HTTP/1.1",
  "Content-Type: application/json",
  "",
  '{"jsonrpc":"2.0","id":1,"method":"initialize",',
  ' "params":{"protocolVersion":"2025-11-25","capabilities":{},',
  '           "clientInfo":{"name":"my-app","version":"1.0"}}}',
  "",
  "POST /mcp HTTP/1.1",
  "Mcp-Session-Id: 1868a90c-3a3f-4f5b",
  "Content-Type: application/json",
  "",
  '{"jsonrpc":"2.0","id":2,"method":"tools/call",',
  ' "params":{"name":"search","arguments":{"q":"otters"}}}',
].join("\n");

const AFTER = [
  "POST /mcp HTTP/1.1",
  "MCP-Protocol-Version: 2026-07-28",
  "Mcp-Method: tools/call",
  "Mcp-Name: search",
  "Content-Type: application/json",
  "",
  '{"jsonrpc":"2.0","id":1,"method":"tools/call",',
  ' "params":{"name":"search","arguments":{"q":"otters"},',
  '           "_meta":{"io.modelcontextprotocol/clientInfo":' +
    '{"name":"my-app","version":"1.0"}}}}',
].join("\n");

/** One tool call on the wire, before and after the handshake was removed. */
export const HandshakeWire = () => (
  <>
    <WireFrame
      title="before"
      badge="2 round trips"
      highlight={[1, 2, 3, 4, 5, 6, 9]}
      code={BEFORE}
    />
    <WireFrame
      title="after"
      badge="1 request"
      tone="added"
      highlight={[2, 3, 4, 9]}
      code={AFTER}
    />
  </>
);
