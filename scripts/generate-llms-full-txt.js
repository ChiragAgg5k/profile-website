const fs = require("fs");
const path = require("path");

const getLocalPosts = () => {
  const postsPath = path.join(__dirname, "../src/data/posts.tsx");
  const postsContent = fs.readFileSync(postsPath, "utf8");

  const postsMatch = postsContent.match(/export const posts = \[([\s\S]*?)\];/);
  if (!postsMatch) {
    throw new Error("Could not parse posts.tsx");
  }

  const postsArrayContent = postsMatch[1];

  const postRegex = /\{\s*title:\s*"([^"]+)",\s*slug:\s*"([^"]+)",/g;
  const posts = [];
  let match;

  while ((match = postRegex.exec(postsArrayContent)) !== null) {
    posts.push({
      title: match[1],
      slug: match[2],
    });
  }

  return posts;
};

const cleanMdxContent = (content) => {
  content = content.replace(/^import .+;$/gm, "");

  content = content.replace(/<[^>]+>/g, "");

  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");
  content = content.trim();

  return content;
};

const generateLlmsTxt = () => {
  try {
    console.log("🚀 Starting llms-full.txt generation...");

    const posts = getLocalPosts();
    console.log(`📄 Found ${posts.length} local blog posts`);

    let llmsContent = `# Chirag Aggarwal's Blog Posts

This file contains all blog posts from Chirag Aggarwal's personal website.
Generated automatically from MDX files during build.

---

`;

    let processedCount = 0;

    for (const post of posts) {
      try {
        const mdxPath = path.join(
          __dirname,
          `../src/app/blog/${post.slug}/page.mdx`,
        );

        if (!fs.existsSync(mdxPath)) {
          console.log(`⚠️  Skipping ${post.slug}: MDX file not found`);
          continue;
        }

        const mdxContent = fs.readFileSync(mdxPath, "utf8");
        const cleanedContent = cleanMdxContent(mdxContent);

        llmsContent += `## ${post.title}\n\n`;
        llmsContent += `**Slug:** ${post.slug}\n\n`;
        llmsContent += `${cleanedContent}\n\n`;
        llmsContent += `---\n\n`;

        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing ${post.slug}:`, error.message);
      }
    }

    const outputPath = path.join(__dirname, "../public/llms-full.txt");
    fs.writeFileSync(outputPath, llmsContent, "utf8");

    console.log(
      `✅ Successfully generated llms-full.txt with ${processedCount} blog posts`,
    );
    console.log(`📍 File location: ${outputPath}`);
  } catch (error) {
    console.error("💥 Error generating llms-full.txt:", error);
    process.exit(1);
  }
};

generateLlmsTxt();
