export type RelatedPostInput = {
  slug: string;
  title: string;
  description?: string;
  publishedAt: string;
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "for",
  "with",
  "on",
  "at",
  "from",
  "how",
  "my",
  "we",
  "our",
  "your",
  "is",
  "are",
  "was",
  "using",
  "into",
  "that",
  "this",
  "what",
  "why",
  "when",
  "its",
  "also",
  "about",
  "over",
  "can",
  "just",
  "more",
  "some",
  "any",
  "guide",
  "experience",
  "journey",
  "comprehensive",
  "open",
  "source",
  "web",
  "development",
  "building",
  "learned",
  "smart",
  "modern",
  "software",
  "code",
  "full",
  "time",
]);

const CANONICAL_TOKENS: Record<string, string> = {
  hacktoberfest: "hackathon",
  hackfrost: "hackathon",
  hackathons: "hackathon",
  k8s: "kubernetes",
};

export function tokenizeRelatedText(text: string): Set<string> {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const tokens = new Set<string>();

  for (const word of words) {
    if (word.length < 3 || STOP_WORDS.has(word)) {
      continue;
    }
    tokens.add(CANONICAL_TOKENS[word] ?? word);
  }

  return tokens;
}

export function rankRelatedPosts<T extends RelatedPostInput>(
  posts: T[],
  currentSlug: string,
  limit = 3,
): T[] {
  const current = posts.find((post) => post.slug === currentSlug);
  if (!current || limit <= 0) {
    return [];
  }

  const currentTokens = tokenizeRelatedText(
    `${current.title} ${current.description ?? ""}`,
  );

  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const tokens = tokenizeRelatedText(
        `${post.title} ${post.description ?? ""}`,
      );
      let overlap = 0;
      for (const token of tokens) {
        if (currentTokens.has(token)) {
          overlap += 1;
        }
      }

      return {
        post,
        overlap,
        recency: new Date(post.publishedAt).getTime(),
      };
    })
    .sort((a, b) => b.overlap - a.overlap || b.recency - a.recency)
    .slice(0, limit)
    .map((entry) => entry.post);
}
