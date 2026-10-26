/**
 * Generate per-post Open Graph images (1200×630 PNG) via Satori + Resvg.
 *
 * Fonts: Inter Regular/Bold are downloaded once from Google Fonts (cdn.jsdelivr)
 * and cached under scripts/fonts/. Re-run with a cleared cache to refresh fonts.
 *
 * Usage: bun run og  (or: node scripts/generate-og-images.cjs)
 * Also runs as part of prebuild.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const WIDTH = 1200;
const HEIGHT = 630;
const ACCENT = "#10b981";
const BG = "#F5F5F0";
const INK = "#0a0a0a";
const MARK = "#525252";
const MUTED = "#737373";
const HAIRLINE = "#404040";

const FONTS_DIR = path.join(__dirname, "fonts");
const OUT_DIR = path.join(__dirname, "../public/og");

const FONT_SOURCES = {
  regular: {
    file: "Inter-Regular.ttf",
    // jsDelivr mirror of rsms/inter release assets
    url: "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-400-normal.ttf",
  },
  bold: {
    file: "Inter-Bold.ttf",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-700-normal.ttf",
  },
};

// Pull internal (slug-based) posts from posts.tsx — same idea as generate-rss.cjs.
const getInternalPosts = () => {
  const postsPath = path.join(__dirname, "../src/data/posts.tsx");
  const content = fs.readFileSync(postsPath, "utf8");

  const re =
    /title:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([^"]+)"/g;
  const posts = [];
  let match;
  while ((match = re.exec(content)) !== null) {
    posts.push({
      title: match[1],
      slug: match[2],
      publishedAt: match[3],
    });
  }
  return posts;
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

const buildMarkup = (title) => ({
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: BG,
      position: "relative",
      overflow: "hidden",
    },
    children: [
      // Subtle paper grid texture
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          },
        },
      },
      // Emerald left edge accent
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: "100%",
            backgroundColor: ACCENT,
            display: "flex",
          },
        },
      },
      // Content column
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            padding: "64px 72px 56px 80px",
            position: "relative",
          },
          children: [
            // Site mark
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.28em",
                  color: MARK,
                  textTransform: "uppercase",
                },
                children: "CHIRAGAGGARWAL.TECH",
              },
            },
            // Title + hairline
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                  maxWidth: 1000,
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: 64,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        color: INK,
                        letterSpacing: "-0.02em",
                      },
                      children: title,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        width: 720,
                        height: 2,
                        backgroundColor: HAIRLINE,
                      },
                    },
                  },
                ],
              },
            },
            // Footer — name dark, role muted
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  fontSize: 26,
                  letterSpacing: "0.01em",
                },
                children: [
                  {
                    type: "span",
                    props: {
                      style: {
                        display: "flex",
                        fontWeight: 700,
                        color: INK,
                      },
                      children: "Chirag Aggarwal",
                    },
                  },
                  {
                    type: "span",
                    props: {
                      style: {
                        display: "flex",
                        fontWeight: 400,
                        color: MUTED,
                        marginLeft: 10,
                      },
                      children: "• Platform Engineer",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

// A request pill for the handshake card. `struck` draws the rule through it and
// drops it back to the paper; the live one keeps the accent.
const requestPill = (method, label, struck) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      width: 420,
      height: 62,
      paddingLeft: 22,
      paddingRight: 22,
      borderRadius: 10,
      border: `2px solid ${struck ? "#D6D6CE" : ACCENT}`,
      backgroundColor: struck ? "transparent" : "rgba(16,185,129,0.10)",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: struck ? "#B5B5AC" : INK,
          },
          children: method,
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            marginLeft: 14,
            fontSize: 22,
            fontWeight: 400,
            color: struck ? "#B5B5AC" : MARK,
          },
          children: label,
        },
      },
      ...(struck
        ? [
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  display: "flex",
                  left: 18,
                  top: 30,
                  width: 384,
                  height: 3,
                  backgroundColor: "#C4C4BA",
                },
              },
            },
          ]
        : []),
    ],
  },
});

// Bespoke card for the 2026-07-28 post: two requests struck out, one left
// standing. Falls back to nothing else — every other slug uses buildMarkup.
const buildHandshakeMarkup = () => ({
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: BG,
      position: "relative",
      overflow: "hidden",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: "100%",
            backgroundColor: ACCENT,
            display: "flex",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            padding: "56px 64px 52px 80px",
            position: "relative",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.28em",
                  color: MARK,
                  textTransform: "uppercase",
                },
                children: "CHIRAGAGGARWAL.TECH",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        width: 540,
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: 60,
                              fontWeight: 700,
                              lineHeight: 1.12,
                              color: INK,
                              letterSpacing: "-0.02em",
                            },
                            children: "MCP 2.0",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              marginTop: 14,
                              fontSize: 40,
                              fontWeight: 400,
                              lineHeight: 1.2,
                              color: MARK,
                              letterSpacing: "-0.01em",
                            },
                            children: "the release that deleted the handshake",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              marginTop: 26,
                              width: 460,
                              height: 2,
                              backgroundColor: HAIRLINE,
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: 19,
                              fontWeight: 400,
                              letterSpacing: "0.12em",
                              color: MUTED,
                              textTransform: "uppercase",
                            },
                            children: "ONE TOOL CALL • 2026-07-28",
                          },
                        },
                        requestPill("POST /mcp", "initialize", true),
                        requestPill("POST /mcp", "Mcp-Session-Id", true),
                        requestPill("POST /mcp", "tools/call", false),
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  fontSize: 26,
                  letterSpacing: "0.01em",
                },
                children: [
                  {
                    type: "span",
                    props: {
                      style: {
                        display: "flex",
                        fontWeight: 700,
                        color: INK,
                      },
                      children: "Chirag Aggarwal",
                    },
                  },
                  {
                    type: "span",
                    props: {
                      style: {
                        display: "flex",
                        fontWeight: 400,
                        color: MUTED,
                        marginLeft: 10,
                      },
                      children: "• Platform Engineer",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

// Dark palette for the agent ticket card, which breaks from the paper style on
// purpose: a session transcript fading out behind a ticket that stays sharp.
const NIGHT = "#0B0B0D";
const NIGHT_INK = "#FAFAFA";
const NIGHT_MUTED = "#8A8A93";
const NIGHT_LINE = "#26262B";
const NIGHT_CARD = "#141417";

// Transcript lines behind the ticket, oldest first. Each fades further, the
// way early context drops out of a long session.
const TRANSCRIPT_LINES = [
  { width: 300, opacity: 0.02 },
  { width: 380, opacity: 0.04 },
  { width: 240, opacity: 0.06 },
  { width: 400, opacity: 0.09 },
  { width: 320, opacity: 0.13 },
  { width: 360, opacity: 0.18 },
  { width: 280, opacity: 0.24 },
  { width: 390, opacity: 0.32 },
];

const transcriptLine = ({ width, opacity }) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      width,
      height: 12,
      borderRadius: 6,
      backgroundColor: `rgba(255,255,255,${opacity})`,
    },
  },
});

// A sub-issue row on the ticket. `state` is done, active or found: done rows
// fade, the active one carries the accent, and found rows are dashed for work
// the agent turned up along the way.
const subIssue = (state, label) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      alignItems: "center",
      height: 46,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 8,
      border:
        state === "found"
          ? `2px dashed ${ACCENT}`
          : `2px solid ${state === "active" ? ACCENT : NIGHT_LINE}`,
      backgroundColor:
        state === "active" ? "rgba(16,185,129,0.14)" : "transparent",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 7,
            border: `2px solid ${state === "done" ? "#4A4A52" : ACCENT}`,
            backgroundColor:
              state === "done"
                ? "#4A4A52"
                : state === "active"
                  ? ACCENT
                  : "transparent",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            marginLeft: 12,
            fontSize: 19,
            fontWeight: state === "done" ? 400 : 700,
            color: state === "done" ? "#5C5C66" : NIGHT_INK,
            textDecoration: state === "done" ? "line-through" : "none",
          },
          children: label,
        },
      },
      ...(state === "found"
        ? [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  marginLeft: "auto",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: ACCENT,
                },
                children: "NEW",
              },
            },
          ]
        : []),
    ],
  },
});

// Bespoke card for the agent ticket post.
const buildTicketMarkup = () => ({
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      backgroundColor: NIGHT,
      position: "relative",
      overflow: "hidden",
      padding: "64px 72px",
    },
    children: [
      // Emerald glow behind the ticket
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            right: -160,
            top: 40,
            width: 760,
            height: 560,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at center, rgba(16,185,129,0.18), rgba(16,185,129,0) 65%)",
          },
        },
      },
      // Headline column
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 560,
            height: "100%",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: 58,
                        fontWeight: 700,
                        lineHeight: 1.08,
                        color: NIGHT_INK,
                        letterSpacing: "-0.03em",
                        width: 360,
                      },
                      children: "The agent will forget.",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 8,
                        fontSize: 58,
                        fontWeight: 700,
                        lineHeight: 1.08,
                        color: ACCENT,
                        letterSpacing: "-0.03em",
                      },
                      children: "The ticket won't.",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 28,
                        fontSize: 28,
                        fontWeight: 400,
                        color: NIGHT_MUTED,
                      },
                      children: "Keeping track of your agent's work",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      // Fading transcript with the ticket over it
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            marginLeft: 48,
            justifyContent: "center",
            position: "relative",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  position: "absolute",
                  top: 10,
                  left: 0,
                },
                children: TRANSCRIPT_LINES.map(transcriptLine),
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 150,
                  marginLeft: 40,
                  padding: 22,
                  gap: 10,
                  borderRadius: 14,
                  border: `1px solid ${NIGHT_LINE}`,
                  backgroundColor: NIGHT_CARD,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 6,
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              paddingLeft: 10,
                              paddingRight: 10,
                              height: 26,
                              alignItems: "center",
                              borderRadius: 13,
                              backgroundColor: "rgba(16,185,129,0.16)",
                              color: ACCENT,
                              fontSize: 14,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                            },
                            children: "OPEN",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              marginLeft: 12,
                              fontSize: 20,
                              fontWeight: 700,
                              color: NIGHT_INK,
                            },
                            children: "Absorb libraries into packages/",
                          },
                        },
                      ],
                    },
                  },
                  subIssue("done", "Waves 1–5 shipped"),
                  subIssue("active", "Wave 6: paused, branch saved"),
                  subIssue("found", "500s on long attributes"),
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

const IRELAND_PHOTOS_DIR = path.join(
  __dirname,
  "../public/images/blog/a-masters-in-ireland-while-building-appwrite",
);

const photoUri = (file) =>
  `data:image/jpeg;base64,${fs
    .readFileSync(path.join(IRELAND_PHOTOS_DIR, file))
    .toString("base64")}`;

// A tilted print with a white border and a handwritten-style label strip.
const polaroid = ({ file, label, width, height, left, top, rotate }) => ({
  type: "div",
  props: {
    style: {
      position: "absolute",
      left,
      top,
      display: "flex",
      flexDirection: "column",
      padding: "12px 12px 0 12px",
      backgroundColor: "#ffffff",
      borderRadius: 4,
      boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
      transform: `rotate(${rotate}deg)`,
    },
    children: [
      {
        type: "img",
        props: {
          src: photoUri(file),
          width,
          height,
          style: { objectFit: "cover", borderRadius: 2 },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 42,
            fontSize: 18,
            fontWeight: 400,
            color: MARK,
            letterSpacing: "0.02em",
          },
          children: label,
        },
      },
    ],
  },
});

// Bespoke card for the Ireland post: title on the left, a stack of prints from
// the post on the right.
const buildIrelandMarkup = () => ({
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: BG,
      position: "relative",
      overflow: "hidden",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: "100%",
            backgroundColor: ACCENT,
            display: "flex",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 600,
            width: 600,
            height: HEIGHT,
            display: "flex",
          },
          children: [
            polaroid({
              file: "hackathon.jpg",
              label: "Dublin AI Week",
              width: 300,
              height: 225,
              left: 230,
              top: 26,
              rotate: 5,
            }),
            polaroid({
              file: "cliffs-of-moher.jpg",
              label: "Cliffs of Moher",
              width: 180,
              height: 240,
              left: 372,
              top: 318,
              rotate: 4,
            }),
            polaroid({
              file: "ul-campus.jpg",
              label: "Limerick",
              width: 216,
              height: 288,
              left: 80,
              top: 196,
              rotate: -6,
            }),
          ],
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            padding: "64px 72px 56px 80px",
            position: "relative",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  width: 560,
                  marginTop: "auto",
                  marginBottom: "auto",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: 19,
                        fontWeight: 400,
                        letterSpacing: "0.12em",
                        color: ACCENT,
                      },
                      children: "MSc · University of Limerick",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 18,
                        fontSize: 66,
                        fontWeight: 700,
                        lineHeight: 1.08,
                        color: INK,
                        letterSpacing: "-0.02em",
                      },
                      children: "A Master's in Ireland",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 14,
                        fontSize: 40,
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: MARK,
                        letterSpacing: "-0.01em",
                      },
                      children: "while building Appwrite",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 28,
                        width: 360,
                        height: 2,
                        backgroundColor: HAIRLINE,
                      },
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  fontSize: 26,
                  letterSpacing: "0.01em",
                },
                children: [
                  {
                    type: "span",
                    props: {
                      style: {
                        display: "flex",
                        fontWeight: 700,
                        color: INK,
                      },
                      children: "Chirag Aggarwal",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

// Slugs that get their own card instead of the title template.
// Posts whose OG card is a hand-made image rather than generated type. The
// file is copied through as-is, so it must already be WIDTH x HEIGHT.
const STATIC_OG = {
  "appwrite-mcp-vs-vercel-mcp": "appwrite-mcp-vs-vercel-mcp.png",
};

const STATIC_OG_DIR = path.join(__dirname, "og-static");

const CUSTOM_MARKUP = {
  "mcp-2-0-the-release-that-deleted-the-handshake": buildHandshakeMarkup,
  "a-masters-in-ireland-while-building-appwrite": buildIrelandMarkup,
  "keeping-track-of-your-agents-work": buildTicketMarkup,
};

const generateOgImages = async () => {
  try {
    console.log("🚀 Starting OG image generation…");

    const satori = (await import("satori")).default;
    const { Resvg } = await import("@resvg/resvg-js");

    const fonts = await ensureFonts();
    const posts = getInternalPosts();
    const cards = [
      ...posts,
      {
        title: "Platform Engineer Resume",
        slug: "resume",
      },
    ];
    console.log(
      `📄 Found ${posts.length} internal blog posts and 1 resume page`,
    );

    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    let written = 0;
    for (const post of cards) {
      const outPath = path.join(OUT_DIR, `${post.slug}.png`);

      if (STATIC_OG[post.slug]) {
        fs.copyFileSync(
          path.join(STATIC_OG_DIR, STATIC_OG[post.slug]),
          outPath,
        );
        written += 1;
        console.log(`  ✓ ${post.slug}.png (static)`);
        continue;
      }

      const markup = CUSTOM_MARKUP[post.slug]
        ? CUSTOM_MARKUP[post.slug]()
        : buildMarkup(post.title);
      const svg = await satori(markup, {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          {
            name: "Inter",
            data: fonts.regular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: fonts.bold,
            weight: 700,
            style: "normal",
          },
        ],
      });

      const resvg = new Resvg(svg, {
        fitTo: { mode: "width", value: WIDTH },
      });
      const png = resvg.render().asPng();
      fs.writeFileSync(outPath, png);
      written += 1;
      console.log(`  ✓ ${post.slug}.png`);
    }

    console.log(`✅ Generated ${written} OG images`);
    console.log(`📍 Location: ${OUT_DIR}\n`);
  } catch (error) {
    console.error("💥 Error generating OG images:", error);
    process.exit(1);
  }
};

generateOgImages();
