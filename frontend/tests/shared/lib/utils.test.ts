import { describe, expect, it } from "vitest";

import { cn } from "@/shared/lib/utils";

describe("cn", () => {
  it("returns a single class string", () => {
    expect(cn("btn")).toBe("btn");
  });

  it("handles conditional values", () => {
    // eslint-disable-next-line no-constant-binary-expression
    expect(cn("btn", false && "hidden", undefined, null)).toBe("btn");
  });

  it("merges arrays and nested values", () => {
    expect(cn(["btn", ["text-sm", "px-2"]])).toBe("btn text-sm px-2");
  });

  it("deduplicates and merges Tailwind conflicts", () => {
    expect(cn("p-2", "p-4", "text-sm", "text-lg")).toBe("p-4 text-lg");
  });

  it("supports object syntax", () => {
    expect(cn({ btn: true, hidden: false }, "text-sm")).toBe("btn text-sm");
  });
});
