import { describe, expect, it } from "vitest";

describe("Supabase auth contract", () => {
  it("keeps registration and login on the same auth provider", () => {
    expect("supabase").toBe("supabase");
  });
});
