export const MARKDOWN_TYPE = "text/markdown";
export const HTML_TYPE = "text/html";

export type SupportedType = typeof MARKDOWN_TYPE | typeof HTML_TYPE;

type AcceptEntry = {
  type: string;
  q: number;
  specificity: number;
  index: number;
};

type Match = {
  q: number;
  specificity: number;
  index: number;
};

const SPECIFICITY_EXACT = 3;
const SPECIFICITY_SUBTYPE_WILDCARD = 2;
const SPECIFICITY_FULL_WILDCARD = 1;

function parseAcceptEntries(header: string): AcceptEntry[] {
  return header.split(",").flatMap((part, index) => {
    const segments = part.split(";").map((segment) => segment.trim());
    const type = segments.shift()?.toLowerCase();
    if (!type) {
      return [];
    }

    let q = 1;
    for (const parameter of segments) {
      const [key, rawValue] = parameter.split("=").map((item) => item.trim());
      if (key?.toLowerCase() === "q") {
        const parsed = Number.parseFloat(rawValue ?? "");
        q = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
      }
    }

    const specificity =
      type === "*/*"
        ? SPECIFICITY_FULL_WILDCARD
        : type.endsWith("/*")
          ? SPECIFICITY_SUBTYPE_WILDCARD
          : SPECIFICITY_EXACT;

    return [{ type, q, specificity, index }];
  });
}

function matchingEntry(produced: string, entries: AcceptEntry[]): Match | null {
  const producedType = produced.toLowerCase();
  const [producedMain] = producedType.split("/");
  let best: (Match & { matched: true }) | null = null;

  for (const entry of entries) {
    const [type, subtype] = entry.type.split("/");
    const matches =
      entry.type === "*/*" ||
      (type === producedMain && subtype === "*") ||
      entry.type === producedType;

    if (!matches) {
      continue;
    }

    const better =
      !best ||
      entry.specificity > best.specificity ||
      (entry.specificity === best.specificity && entry.q > best.q) ||
      (entry.specificity === best.specificity &&
        entry.q === best.q &&
        entry.index < best.index);

    if (better) {
      best = {
        q: entry.q,
        specificity: entry.specificity,
        index: entry.index,
        matched: true,
      };
    }
  }

  if (!best || best.q === 0) {
    return null;
  }

  return best;
}

function compareMatches(left: Match, right: Match): number {
  if (left.q !== right.q) {
    return left.q - right.q;
  }
  if (left.specificity !== right.specificity) {
    return left.specificity - right.specificity;
  }
  return right.index - left.index;
}

export function negotiateAccept(
  acceptHeader: string | null | undefined,
  supported: readonly SupportedType[],
  fallback: SupportedType = HTML_TYPE,
): SupportedType | "406" {
  if (acceptHeader == null || acceptHeader.trim() === "") {
    return fallback;
  }

  const entries = parseAcceptEntries(acceptHeader);
  let winner: SupportedType | null = null;
  let winnerMatch: Match | null = null;

  for (const type of supported) {
    const match = matchingEntry(type, entries);
    if (!match) {
      continue;
    }

    const better =
      !winnerMatch ||
      compareMatches(match, winnerMatch) > 0 ||
      (compareMatches(match, winnerMatch) === 0 && type === fallback);

    if (better) {
      winner = type;
      winnerMatch = match;
    }
  }

  if (!winner || !winnerMatch) {
    return "406";
  }

  return winner;
}

export function prefersMarkdown(
  acceptHeader: string | null | undefined,
): boolean {
  return (
    negotiateAccept(acceptHeader, [MARKDOWN_TYPE, HTML_TYPE]) === MARKDOWN_TYPE
  );
}
