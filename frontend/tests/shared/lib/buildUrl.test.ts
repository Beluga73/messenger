import { buildUrl } from "@/shared/lib/buildUrl";

describe("buildUrl", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8080");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should build a complete URL", () => {
    expect(buildUrl("/api/users")).toBe("http://localhost:8080/api/users");
  });

  it("should handle path without leading slash", () => {
    expect(buildUrl("api/users")).toBe("http://localhost:8080/api/users");
  });

  it("shold work with emtpty path", () => {
    expect(buildUrl("")).toBe("http://localhost:8080/");
  });

  it("should preserver query params", () => {
    expect(buildUrl("api/users?skip0&limit=50")).toBe(
      "http://localhost:8080/api/users?skip0&limit=50"
    );
  });

  it("should throw when VITE_API_BASE_URL is not set", () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    expect(() => buildUrl("")).toThrow("VITE_API_BASE_URL is not set");
  });

  vi.unstubAllEnvs();
});
