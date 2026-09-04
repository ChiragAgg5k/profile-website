import { describe, expect, test } from "bun:test";
import { formatDate } from "./utils";

describe("formatDate", () => {
  test("formats publication dates deterministically", () => {
    expect(formatDate("2026-08-19")).toBe("Aug 19, 2026");
  });
});
