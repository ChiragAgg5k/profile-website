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
    console.log("🚀 Starting llms.txt generation...");

    const posts = getLocalPosts();
    console.log(`📄 Found ${posts.length} local blog posts`);

    // Create llms directory in public/
    const llmsDir = path.join(__dirname, "../public/blog");
    if (!fs.existsSync(llmsDir)) {
      fs.mkdirSync(llmsDir, { recursive: true });
    }

    // Start building the main llms.txt content
    let llmsContent = `# Chirag Aggarwal's Blog Posts

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

        // Generate individual .txt file for this post
        const postTxtPath = path.join(llmsDir, `${post.slug}.txt`);
        const postContent = `# ${post.title}

${cleanedContent}`;

        fs.writeFileSync(postTxtPath, postContent, "utf8");

        // Add entry to main llms.txt
        llmsContent += `- [${post.title}](https://chiragaggarwal.tech/blog/${post.slug}.txt)\n`;

        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing ${post.slug}:`, error.message);
      }
    }

    // Write the main llms.txt file
    const outputPath = path.join(__dirname, "../public/llms.txt");
    fs.writeFileSync(outputPath, llmsContent, "utf8");

    console.log(
      `✅ Successfully generated llms.txt with ${processedCount} blog posts`,
    );
    console.log(`📍 Main file location: ${outputPath}`);
    console.log(`📍 Individual files location: ${llmsDir}`);
  } catch (error) {
    console.error("💥 Error generating llms.txt:", error);
    process.exit(1);
  }
};

generateLlmsTxt();
