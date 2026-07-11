const fs = require("fs");
const path = require("path");

const getSiteUrl = () => {
  const resumePath = path.join(__dirname, "../src/data/resume.tsx");
  const content = fs.readFileSync(resumePath, "utf8");
  const match = content.match(/url:\s*"([^"]+)"/);
  return (match ? match[1] : "https://www.chiragaggarwal.tech").replace(
    /\/$/,
    "",
  );
};

const getInternalPosts = () => {
  const postsPath = path.join(__dirname, "../src/data/posts.tsx");
  const content = fs.readFileSync(postsPath, "utf8");

  const re =
    /title:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([^"]+)"(?:[\s\S]*?description:\s*"([^"]+)")?/g;
  const posts = [];
  let match;
  while ((match = re.exec(content)) !== null) {
    posts.push({
      title: match[1],
      slug: match[2],
      publishedAt: match[3],
      description: match[4] ?? "",
    });
  }
  return posts;
};

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (isoDate) =>
  new Date(isoDate).toUTCString().replace("GMT", "+0000");

const generateRss = () => {
  try {
    console.log("🚀 Starting feed.xml generation...");

    const siteUrl = getSiteUrl();
    const posts = getInternalPosts().sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
    );

    const channelTitle = `${escapeXml("Chirag Aggarwal")} — Blog`;
    const channelDescription = escapeXml(
      "Articles on platform engineering, open source, and backend development by Chirag Aggarwal.",
    );

    const items = posts
      .map((post) => {
        const link = `${siteUrl}/blog/${post.slug}`;
        const description =
          post.description ||
          `Read ${post.title} by Chirag Aggarwal.`;

        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRfc822(post.publishedAt)}</pubDate>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channelTitle}</title>
    <link>${siteUrl}/blog</link>
    <description>${channelDescription}</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(new Date().toISOString().slice(0, 10))}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

    const outputPath = path.join(__dirname, "../public/feed.xml");
    fs.writeFileSync(outputPath, xml, "utf8");

    console.log(`✅ Generated feed.xml with ${posts.length} posts`);
    console.log(`📍 Location: ${outputPath}\n`);
  } catch (error) {
    console.error("💥 Error generating feed.xml:", error);
    process.exit(1);
  }
};

generateRss();
