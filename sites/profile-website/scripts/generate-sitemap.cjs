const fs = require("fs");
const path = require("path");

// Canonical origin. Parsed from resume.tsx so it stays in sync with the
// `url` used for canonicals/OpenGraph (currently the `www` host).
const getSiteUrl = () => {
  const resumePath = path.join(__dirname, "../src/data/resume.tsx");
  const content = fs.readFileSync(resumePath, "utf8");
  const match = content.match(/url:\s*"([^"]+)"/);
  return (match ? match[1] : "https://www.chiragaggarwal.tech").replace(
    /\/$/,
    "",
  );
};

// Pull internal (slug-based) posts and their publish dates from posts.tsx.
// External posts (href, no slug) live elsewhere and are intentionally excluded.
const getInternalPosts = () => {
  const postsPath = path.join(__dirname, "../src/data/posts.tsx");
  const content = fs.readFileSync(postsPath, "utf8");

  const re = /slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([^"]+)"/g;
  const posts = [];
  let match;
  while ((match = re.exec(content)) !== null) {
    posts.push({ slug: match[1], publishedAt: normalizeDate(match[2]) });
  }
  return posts;
};

// Normalize loose dates (e.g. "2025-03-9") to ISO "YYYY-MM-DD".
const normalizeDate = (value) => {
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const urlEntry = ({ loc, lastmod, changefreq, priority }) =>
  [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority != null ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");

const generateSitemap = () => {
  try {
    console.log("🚀 Starting sitemap.xml generation...");

    const siteUrl = getSiteUrl();
    const posts = getInternalPosts();
    console.log(`📄 Found ${posts.length} internal blog posts`);

    const latestPost = posts
      .map((p) => p.publishedAt)
      .sort()
      .pop();
    const today = new Date().toISOString().slice(0, 10);

    const entries = [
      urlEntry({
        loc: siteUrl,
        lastmod: today,
        changefreq: "monthly",
        priority: "1.0",
      }),
      urlEntry({
        loc: `${siteUrl}/blog`,
        lastmod: latestPost || today,
        changefreq: "weekly",
        priority: "0.8",
      }),
      urlEntry({
        loc: `${siteUrl}/developers`,
        lastmod: today,
        changefreq: "monthly",
        priority: "0.8",
      }),
      urlEntry({
        loc: `${siteUrl}/resume`,
        lastmod: today,
        changefreq: "monthly",
        priority: "0.8",
      }),
      urlEntry({
        loc: `${siteUrl}/trends`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.7",
      }),
      ...posts.map((post) =>
        urlEntry({
          loc: `${siteUrl}/blog/${post.slug}`,
          lastmod: post.publishedAt,
          changefreq: "yearly",
          priority: "0.7",
        }),
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

    const outputPath = path.join(__dirname, "../public/sitemap.xml");
    fs.writeFileSync(outputPath, xml, "utf8");

    console.log(
      `✅ Generated sitemap.xml with ${entries.length} URLs (1 home, 1 blog index, 1 developers, 1 resume, 1 trends, ${posts.length} posts)`,
    );
    console.log(`📍 Location: ${outputPath}\n`);
  } catch (error) {
    console.error("💥 Error generating sitemap.xml:", error);
    process.exit(1);
  }
};

generateSitemap();
