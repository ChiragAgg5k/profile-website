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

// Slugs that get their own card instead of the title template.
// Posts whose OG card is a hand-made image rather than generated type. The
// file is copied through as-is, so it must already be WIDTH x HEIGHT.
const STATIC_OG = {
  "appwrite-mcp-vs-vercel-mcp": "appwrite-mcp-vs-vercel-mcp.png",
};

const STATIC_OG_DIR = path.join(__dirname, "og-static");

const CUSTOM_MARKUP = {
  "mcp-2-0-the-release-that-deleted-the-handshake": buildHandshakeMarkup,
};

const generateOgImages = async () => {
  try {
    console.log("🚀 Starting OG image generation…");

    const satori = (await import("satori")).default;
    const { Resvg } = await import("@resvg/resvg-js");

    const fonts = await ensureFonts();
    const posts = getInternalPosts();
    console.log(`📄 Found ${posts.length} internal blog posts`);

    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    let written = 0;
    for (const post of posts) {
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
