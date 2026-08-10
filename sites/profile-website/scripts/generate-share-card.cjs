/**
 * Generate the 1600×900 share card for the MCP 2026-07-28 post.
 *
 * Separate from generate-og-images.cjs on purpose: that one runs on every
 * build and renders one card per post from the title. This is a one-off promo
 * asset for X, sized 16:9 for the timeline rather than 1.91:1 for link
 * previews, and dark so it reads against a feed.
 *
 * Usage: node scripts/generate-share-card.cjs
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const WIDTH = 1600;
const HEIGHT = 900;

const BG = "#0B0B0C";
const PANEL = "#141416";
const LINE = "#26262A";
const INK = "#F5F5F4";
const MUTED = "#8A8A93";
const DIM = "#5A5A63";
const ACCENT = "#10b981";
const RED = "#E0575B";

const FONTS_DIR = path.join(__dirname, "fonts");
const OUT_PATH = path.join(
  __dirname,
  "../public/og/share/mcp-2-0-the-release-that-deleted-the-handshake.png",
);

const FONT_SOURCES = {
  regular: {
    file: "Inter-Regular.ttf",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-400-normal.ttf",
  },
  bold: {
    file: "Inter-Bold.ttf",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-700-normal.ttf",
  },
  mono: {
    file: "JetBrainsMono-Regular.ttf",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@5.2.5/latin-400-normal.ttf",
  },
  monoBold: {
    file: "JetBrainsMono-Bold.ttf",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@5.2.5/latin-700-normal.ttf",
  },
};

const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          file.close();
          fs.unlinkSync(dest);
          downloadFile(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(
            new Error(`Failed to download ${url}: HTTP ${res.statusCode}`),
          );
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err);
      });
  });

const ensureFonts = async () => {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  const buffers = {};
  for (const [key, source] of Object.entries(FONT_SOURCES)) {
    const dest = path.join(FONTS_DIR, source.file);
    if (!fs.existsSync(dest)) {
      console.log(`⬇️  Downloading ${source.file}…`);
      await downloadFile(source.url, dest);
    }
    buffers[key] = fs.readFileSync(dest);
  }
  return buffers;
};

const row = (children, style = {}) => ({
  type: "div",
  props: {
    style: { display: "flex", alignItems: "center", ...style },
    children,
  },
});

const text = (value, style = {}) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      fontFamily: "JetBrains Mono",
      fontSize: 27,
      color: INK,
      ...style,
    },
    children: value,
  },
});

// A code line with an optional tint band behind it and a coloured left rule,
// mirroring the WireFrame component in the post.
const codeLine = (value, tone) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      alignItems: "center",
      height: 50,
      paddingLeft: 26,
      paddingRight: 20,
      borderLeft: `4px solid ${
        tone === "removed" ? RED : tone === "added" ? ACCENT : "transparent"
      }`,
      backgroundColor:
        tone === "removed"
          ? "rgba(224,87,91,0.13)"
          : tone === "added"
            ? "rgba(16,185,129,0.13)"
            : "transparent",
    },
    children: [
      text(value, {
        color:
          tone === "removed" ? "#F0A3A5" : tone === "added" ? "#7FE3C0" : MUTED,
        fontWeight: tone ? 700 : 400,
      }),
    ],
  },
});

// Drawn rather than typed: the fontsource latin subsets don't carry U+2192,
// so a text arrow renders as tofu.
const arrow = () => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      width: 84,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: 44,
            height: 3,
            backgroundColor: DIM,
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: 15,
            height: 15,
            marginLeft: -11,
            borderTop: `3px solid ${DIM}`,
            borderRight: `3px solid ${DIM}`,
            transform: "rotate(45deg)",
          },
        },
      },
    ],
  },
});

const panel = (title, badge, badgeColor, lines) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      flexDirection: "column",
      width: 692,
      borderRadius: 16,
      border: `1px solid ${LINE}`,
      backgroundColor: PANEL,
      overflow: "hidden",
    },
    children: [
      row(
        [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 22,
                color: MUTED,
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                marginLeft: "auto",
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: 8,
                border: `1px solid ${badgeColor}`,
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                fontWeight: 700,
                color: badgeColor,
              },
              children: badge,
            },
          },
        ],
        {
          height: 66,
          paddingLeft: 26,
          paddingRight: 22,
          borderBottom: `1px solid ${LINE}`,
        },
      ),
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            paddingTop: 22,
            paddingBottom: 22,
          },
          children: lines,
        },
      },
    ],
  },
});

const buildMarkup = () => ({
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: BG,
      padding: "56px 64px",
      fontFamily: "Inter",
    },
    children: [
      row([
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: ACCENT,
              marginRight: 16,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: MUTED,
            },
            children: "MCP SPEC 2026-07-28",
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              marginLeft: "auto",
              fontSize: 24,
              color: DIM,
            },
            children: "chiragaggarwal.tech",
          },
        },
      ]),
      row(
        [
          panel("before", "2 round trips", RED, [
            codeLine("POST /mcp", null),
            codeLine('"method": "initialize"', "removed"),
            codeLine("POST /mcp", null),
            codeLine("Mcp-Session-Id: 1868a90c", "removed"),
            codeLine('"method": "tools/call"', null),
          ]),
          arrow(),
          panel("after", "1 request", ACCENT, [
            codeLine("POST /mcp", null),
            codeLine("MCP-Protocol-Version: 2026-07-28", "added"),
            codeLine("Mcp-Method: tools/call", "added"),
            codeLine('"method": "tools/call"', null),
            codeLine('"_meta": { clientInfo }', null),
          ]),
        ],
        { justifyContent: "space-between" },
      ),
      {
        type: "div",
        props: {
          style: { display: "flex", flexDirection: "column" },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: 52,
                  fontWeight: 700,
                  color: INK,
                  letterSpacing: "-0.02em",
                },
                children: "MCP deleted the handshake",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  marginTop: 14,
                  fontSize: 30,
                  color: MUTED,
                },
                children:
                  "No initialize. No session id. No held-open stream. Any replica can answer.",
              },
            },
          ],
        },
      },
    ],
  },
});

const generate = async () => {
  try {
    const satori = (await import("satori")).default;
    const { Resvg } = await import("@resvg/resvg-js");

    const fonts = await ensureFonts();

    const svg = await satori(buildMarkup(), {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
        { name: "Inter", data: fonts.bold, weight: 700, style: "normal" },
        {
          name: "JetBrains Mono",
          data: fonts.mono,
          weight: 400,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: fonts.monoBold,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, resvg.render().asPng());

    console.log(`✅ ${OUT_PATH}`);
  } catch (error) {
    console.error("💥 Error generating share card:", error);
    process.exit(1);
  }
};

generate();
