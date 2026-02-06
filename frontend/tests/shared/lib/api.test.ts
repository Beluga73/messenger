import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/shared/lib/api";
import { buildUrl } from "@/shared/lib/buildUrl";
import { handle401 } from "@/shared/lib/interceptors/token401";
import { useTokenStore } from "@/stores/tokenStore";

// Mock dependencies
vi.mock("@/shared/lib/buildUrl", () => ({
  buildUrl: vi.fn(),
}));

vi.mock("@/stores/tokenStore", () => ({
  useTokenStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@/shared/lib/interceptors/token401", () => ({
  handle401: vi.fn(),
}));

const mockBuildUrl = vi.mocked(buildUrl);
const mockGetState = vi.mocked(useTokenStore.getState);
const mockHandle401 = vi.mocked(handle401);

describe("api", () => {
  const mockFetch = vi.fn();
  globalThis.fetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetState.mockReturnValue({ jwtToken: "test-token" } as ReturnType<typeof mockGetState>);
    mockBuildUrl.mockReturnValue("http://localhost:8080/api/test");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("get", () => {
    it("makes GET request with correct URL and headers", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await api.get("/test");

      expect(mockBuildUrl).toHaveBeenCalledWith("/test");
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      });
      expect(result).toEqual({ data: "test" });
    });

    it("includes Authorization header when token exists", async () => {
      mockGetState.mockReturnValue({ jwtToken: "test-token" } as ReturnType<typeof mockGetState>);
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue({}) };
      mockFetch.mockResolvedValue(mockResponse);

      await api.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });

    it("excludes Authorization header when no token", async () => {
      mockGetState.mockReturnValue({ jwtToken: null } as ReturnType<typeof mockGetState>);
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue({}) };
      mockFetch.mockResolvedValue(mockResponse);

      await api.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        })
      );
    });
  });

  describe("post", () => {
    it("makes POST request with JSON body", async () => {
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue({}) };
      mockFetch.mockResolvedValue(mockResponse);

      await api.post("/test", { key: "value" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ key: "value" }),
        })
      );
    });
  });

  describe("put", () => {
    it("makes PUT request with JSON body", async () => {
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue({}) };
      mockFetch.mockResolvedValue(mockResponse);

      await api.put("/test", { key: "value" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/test",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ key: "value" }),
        })
      );
    });
  });

  describe("delete", () => {
    it("makes DELETE request", async () => {
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue({}) };
      mockFetch.mockResolvedValue(mockResponse);

      await api.delete("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/test",
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("error handling", () => {
    it("throws error for non-ok responses", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: "Bad Request" }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(api.get("/test")).rejects.toThrow("Error 400: Bad Request");
    });

    it("handles 401 responses with handle401", async () => {
      const mockResponse401 = {
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ message: "Unauthorized" }),
      };
      const mockResponseSuccess = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: "success" }),
      } as unknown as Response;

      mockFetch.mockResolvedValueOnce(mockResponse401);
      mockFetch.mockResolvedValueOnce(mockResponseSuccess);
      mockHandle401.mockResolvedValue(mockResponseSuccess);

      const result = await api.get("/test");

      expect(mockHandle401).toHaveBeenCalledWith({
        url: "http://localhost:8080/api/test",
        method: "GET",
        body: undefined,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      });
      expect(result).toEqual({ data: "success" });
    });
  });

  describe("custom config", () => {
    it("merges custom headers with default headers", async () => {
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue({}) };
      mockFetch.mockResolvedValue(mockResponse);

      await api.get("/test", {
        headers: { "X-Custom": "value" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/test",
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
            "X-Custom": "value",
          },
        })
      );
    });
  });
});
