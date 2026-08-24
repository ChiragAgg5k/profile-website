import { describe, expect, test } from "bun:test";
import {
  HTML_TYPE,
  MARKDOWN_TYPE,
  negotiateAccept,
  prefersMarkdown,
} from "./accept";

const supported = [MARKDOWN_TYPE, HTML_TYPE] as const;

describe("negotiateAccept (acceptmarkdown.com vectors)", () => {
  test("text/markdown prefers markdown", () => {
    expect(negotiateAccept("text/markdown", supported)).toBe(MARKDOWN_TYPE);
  });

  test("markdown before html wins", () => {
    expect(
      negotiateAccept("text/markdown, text/html;q=0.8", supported),
    ).toBe(MARKDOWN_TYPE);
  });

  test("text/html prefers html", () => {
    expect(negotiateAccept("text/html", supported)).toBe(HTML_TYPE);
  });

  test("markdown q=0 falls back to html", () => {
    expect(
      negotiateAccept("text/markdown;q=0, text/html", supported),
    ).toBe(HTML_TYPE);
  });

  test("markdown q=0 with markdown only is 406", () => {
    expect(negotiateAccept("text/markdown;q=0", [MARKDOWN_TYPE])).toBe("406");
  });

  test("missing Accept serves the html default", () => {
    expect(negotiateAccept(null, supported)).toBe(HTML_TYPE);
    expect(negotiateAccept(undefined, supported)).toBe(HTML_TYPE);
  });

  test("*/* serves the html default", () => {
    expect(negotiateAccept("*/*", supported)).toBe(HTML_TYPE);
  });

  test("Chrome-like Accept stays on html", () => {
    expect(
      negotiateAccept(
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        supported,
      ),
    ).toBe(HTML_TYPE);
  });

  test("equal-q markdown listed first wins", () => {
    expect(
      negotiateAccept("text/markdown, text/html", supported),
    ).toBe(MARKDOWN_TYPE);
  });
});

describe("prefersMarkdown", () => {
  test("is true only when markdown outranks html", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/html")).toBe(false);
    expect(prefersMarkdown(null)).toBe(false);
  });
});
