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

const getLocalPosts = () => {
  const postsPath = path.join(__dirname, "../src/data/posts.tsx");
  const postsContent = fs.readFileSync(postsPath, "utf8");
  const postsMatch =
    postsContent.match(/const basePosts: BlogPost\[] = \[([\s\S]*?)\];/) ||
    postsContent.match(/export const posts = \[([\s\S]*?)\];/);
  if (!postsMatch) {
    throw new Error("Could not parse posts.tsx");
  }

  const postRegex = /\{\s*title:\s*"([^"]+)",\s*slug:\s*"([^"]+)",/g;
  const posts = [];
  let match;
  while ((match = postRegex.exec(postsMatch[1])) !== null) {
    posts.push({ title: match[1], slug: match[2] });
  }
  return posts;
};

const write = (relativePath, contents) => {
  const outputPath = path.join(__dirname, "..", relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, contents, "utf8");
  console.log(`📝 ${relativePath}`);
};

const generateAgentMarkdown = () => {
  const siteUrl = getSiteUrl();
  const posts = getLocalPosts();
  const developerPosts = posts.filter((post) =>
    /mcp|appwrite|api|rest|authorization|logging|cli/i.test(post.title),
  );

  write(
    "public/index.md",
    `# Chirag Aggarwal

Platform Engineer at Appwrite. Personal site for [chiragaggarwal.tech](${siteUrl}).

I build backend systems with open-source technologies and write about platform engineering, MCP, and system architecture.

## Pages

- [Chirag Aggarwal developer resources](${siteUrl}/developers)
- [Resume](${siteUrl}/resume)
- [Blog](${siteUrl}/blog)
- [Trends](${siteUrl}/trends)
- [llms.txt](${siteUrl}/llms.txt)
- [Sitemap](${siteUrl}/sitemap.xml)
- [RSS](${siteUrl}/feed.xml)

## Contact

- Email: chiragaggarwal5k@gmail.com
- GitHub: https://github.com/ChiragAgg5k
`,
  );

  write(
    "public/blog.md",
    `# Blog | Chirag Aggarwal

Writing from chiragaggarwal.tech on platform engineering, MCP, Appwrite, and the tools I use day to day.

${posts.map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug})`).join("\n")}

Also available as [llms.txt](${siteUrl}/llms.txt) and [RSS](${siteUrl}/feed.xml).
`,
  );

  write(
    "public/developers.md",
    `# Chirag Aggarwal developer resources

Developer resources for [chiragaggarwal.tech](${siteUrl}). This is a personal site, not a hosted product API.

## Machine-readable files

- [llms.txt](${siteUrl}/llms.txt) — site index for agents
- [llms-full.txt](${siteUrl}/llms-full.txt) — full-text posts
- [sitemap.xml](${siteUrl}/sitemap.xml)
- [feed.xml](${siteUrl}/feed.xml)
- Pages also negotiate \`Accept: text/markdown\` on the canonical URL

## MCP and platform writing

${developerPosts.map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug})`).join("\n")}

## Elsewhere

- Appwrite docs: https://appwrite.io/docs
- Appwrite MCP: https://appwrite.io/docs/tooling/mcp
- GitHub: https://github.com/ChiragAgg5k
- Email: chiragaggarwal5k@gmail.com
`,
  );

  write(
    "public/resume.md",
    `# Chirag Aggarwal — Platform Engineer

Platform Engineer at Appwrite based in Delhi NCR, India.

## Experience

### Appwrite — Platform Engineer

December 2024–Present

- Build and run Appwrite Cloud using PHP, Swoole, Kubernetes, and edge infrastructure.
- Rewrote the Appwrite CLI in Go and maintain SDKs for more than 11 languages.
- Built Appwrite's hosted MCP server with OAuth 2.1 and four tools over 981 endpoints.
- Work on observability and synthetic monitoring with Grafana and OpenTelemetry.
- More than 2,000 merged pull requests across open-source and internal repositories.

### Skillarena — Backend Developer

July 2024–September 2024

### Clearmind AI — Fullstack Developer

October 2023–December 2023

## Skills

PHP, TypeScript, Node.js, Python, Postgres, Docker, Kubernetes, Appwrite, and Go.

## Education

B.Tech in Computer Science Engineering, Bennett University (2022–2026), 9.71 CGPA.

## Links

- [HTML resume](${siteUrl}/resume)
- [Download PDF](${siteUrl}/resume.pdf)
- [GitHub](https://github.com/ChiragAgg5k)
- [LinkedIn](https://www.linkedin.com/in/chiragagg5k/)
- Email: chiragaggarwal5k@gmail.com
`,
  );

  write(
    "public/trends.md",
    `# My agentic trends | Chirag Aggarwal

API-rate token usage across Claude Code, Codex, and other coding agents I run locally.

HTML: ${siteUrl}/trends
`,
  );

  write(
    "public/404.md",
    `# Page not found

This path does not exist on chiragaggarwal.tech.

## Where to look next

- [Home](${siteUrl}/)
- [Chirag Aggarwal developer resources](${siteUrl}/developers)
- [Blog](${siteUrl}/blog)
- [llms.txt](${siteUrl}/llms.txt)
- [Sitemap](${siteUrl}/sitemap.xml)
- [RSS feed](${siteUrl}/feed.xml)
`,
  );

  console.log(`✅ Generated agent markdown for ${posts.length} posts\n`);
};

generateAgentMarkdown();
