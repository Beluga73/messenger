import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { requestQueue } from "../../../src/shared/lib/requestQueue";

// Mock fetch globalThisly
globalThis.fetch = vi.fn();

describe("requestQueue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset queue state by calling clear with error handling
    try {
      // Clear any remaining requests from previous tests
      requestQueue.setRefreshing(false);
    } catch (e) {
      // Ignore if queue is empty
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("add()", () => {
    it("should add a request to the queue", async () => {
      const mockRequest = {
        url: "https://api.example.com/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      // Verify by attempting to execute - if request was added, it should be processed
      await requestQueue.executeAll("test-token");
      expect(mockRequest.resolve).toHaveBeenCalled();
    });

    it("should add multiple requests to the queue in order", async () => {
      const request1 = {
        url: "https://api.example.com/users/1",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      const request2 = {
        url: "https://api.example.com/users/2",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(request1);
      requestQueue.add(request2);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      await requestQueue.executeAll("test-token");

      expect(request1.resolve).toHaveBeenCalled();
      expect(request2.resolve).toHaveBeenCalled();
    });

    it("should add request with body", async () => {
      const mockRequest = {
        url: "https://api.example.com/users",
        method: "POST",
        body: { name: "John", email: "john@example.com" },
        headers: { "Content-Type": "application/json" },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 1 }),
      });

      await requestQueue.executeAll("test-token");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "John", email: "john@example.com" }),
        })
      );
    });
  });

  describe("isRefreshingInProgress()", () => {
    it("should return false initially", () => {
      const result = requestQueue.isRefreshingInProgress();
      expect(result).toBe(false);
    });

    it("should return true after setRefreshing(true)", () => {
      requestQueue.setRefreshing(true);
      expect(requestQueue.isRefreshingInProgress()).toBe(true);
    });

    it("should return false after setRefreshing(false)", () => {
      requestQueue.setRefreshing(true);
      requestQueue.setRefreshing(false);
      expect(requestQueue.isRefreshingInProgress()).toBe(false);
    });
  });

  describe("setRefreshing()", () => {
    it("should set refreshing state to true", () => {
      requestQueue.setRefreshing(true);
      expect(requestQueue.isRefreshingInProgress()).toBe(true);
    });

    it("should set refreshing state to false", () => {
      requestQueue.setRefreshing(false);
      expect(requestQueue.isRefreshingInProgress()).toBe(false);
    });

    it("should toggle refreshing state", () => {
      expect(requestQueue.isRefreshingInProgress()).toBe(false);

      requestQueue.setRefreshing(true);
      expect(requestQueue.isRefreshingInProgress()).toBe(true);

      requestQueue.setRefreshing(false);
      expect(requestQueue.isRefreshingInProgress()).toBe(false);
    });
  });

  describe("executeAll()", () => {
    it("should execute a single queued request", async () => {
      const mockResolve = vi.fn();
      const mockReject = vi.fn();

      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        resolve: mockResolve,
        reject: mockReject,
      };

      requestQueue.add(mockRequest);

      const responseData = { id: 1, name: "Test" };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      });

      await requestQueue.executeAll("new-jwt-token");

      expect(mockResolve).toHaveBeenCalled();
      expect(mockReject).not.toHaveBeenCalled();
    });

    it("should add Authorization header to requests", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      const testToken = "my-new-jwt-token";
      await requestQueue.executeAll(testToken);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${testToken}`,
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should preserve existing headers while adding Authorization", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "custom-value",
        },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      await requestQueue.executeAll("token-123");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer token-123",
            "Content-Type": "application/json",
            "X-Custom-Header": "custom-value",
          }),
        })
      );
    });

    it("should process multiple requests in queue", async () => {
      const request1 = {
        url: "https://api.example.com/users/1",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      const request2 = {
        url: "https://api.example.com/users/2",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      const request3 = {
        url: "https://api.example.com/users/3",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(request1);
      requestQueue.add(request2);
      requestQueue.add(request3);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      await requestQueue.executeAll("token-123");

      expect(request1.resolve).toHaveBeenCalled();
      expect(request2.resolve).toHaveBeenCalled();
      expect(request3.resolve).toHaveBeenCalled();
      expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("executeAll() - error handling", () => {
    it("should reject request when response is not ok", async () => {
      const mockResolve = vi.fn();
      const mockReject = vi.fn();

      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: {},
        resolve: mockResolve,
        reject: mockReject,
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ message: "Unauthorized" }),
      });

      await requestQueue.executeAll("invalid-token");

      expect(mockReject).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Error 401"),
        })
      );
      expect(mockResolve).not.toHaveBeenCalled();
    });

    it("should handle 400 Bad Request error", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "POST",
        headers: {},
        body: { invalid: "data" },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: "Bad Request" }),
      });

      await requestQueue.executeAll("token");

      expect(mockRequest.reject).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Error 400"),
        })
      );
    });

    it("should handle 500 Server Error", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ message: "Internal Server Error" }),
      });

      await requestQueue.executeAll("token");

      expect(mockRequest.reject).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Error 500"),
        })
      );
    });

    it("should catch and reject fetch errors", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      const networkError = new Error("Network request failed");
      (globalThis.fetch as any).mockRejectedValue(networkError);

      await requestQueue.executeAll("token");

      expect(mockRequest.reject).toHaveBeenCalledWith(networkError);
      expect(mockRequest.resolve).not.toHaveBeenCalled();
    });

    it("should handle JSON parse errors in error response", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      });

      await requestQueue.executeAll("token");

      expect(mockRequest.reject).toHaveBeenCalled();
      expect(mockRequest.resolve).not.toHaveBeenCalled();
    });

    it("should continue processing remaining requests after one fails", async () => {
      const request1 = {
        url: "https://api.example.com/users/1",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      const request2 = {
        url: "https://api.example.com/users/2",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(request1);
      requestQueue.add(request2);

      // First call fails, second succeeds
      (globalThis.fetch as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: vi.fn().mockResolvedValue({ message: "Not Found" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ id: 2 }),
        });

      await requestQueue.executeAll("token");

      expect(request1.reject).toHaveBeenCalled();
      expect(request2.resolve).toHaveBeenCalled();
    });
  });

  describe("queue state management", () => {
    it("should empty queue after executeAll()", async () => {
      const mockRequest = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      await requestQueue.executeAll("token");

      // Add another request and execute - should process just the new one
      const secondRequest = {
        url: "https://api.example.com/data2",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(secondRequest);
      await requestQueue.executeAll("token");

      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    it("should handle executeAll() with empty queue", async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      // Should not throw error
      await expect(requestQueue.executeAll("token")).resolves.toBeUndefined();
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("should preserve queue when executeAll() encounters errors", async () => {
      const request1 = {
        url: "https://api.example.com/data",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(request1);

      (globalThis.fetch as any).mockRejectedValue(new Error("Network error"));

      await requestQueue.executeAll("token");

      // Queue should be emptied even on error
      expect(request1.reject).toHaveBeenCalled();
    });
  });

  describe("HTTP methods", () => {
    it("should handle GET requests", async () => {
      const mockRequest = {
        url: "https://api.example.com/users",
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ users: [] }),
      });

      await requestQueue.executeAll("token");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should handle POST requests with body", async () => {
      const mockRequest = {
        url: "https://api.example.com/users",
        method: "POST",
        body: { name: "Alice", email: "alice@example.com" },
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 1, name: "Alice" }),
      });

      await requestQueue.executeAll("token");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
        })
      );
    });

    it("should handle PUT requests with body", async () => {
      const mockRequest = {
        url: "https://api.example.com/users/1",
        method: "PUT",
        body: { name: "Bob" },
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 1, name: "Bob" }),
      });

      await requestQueue.executeAll("token");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "PUT" })
      );
    });

    it("should handle DELETE requests", async () => {
      const mockRequest = {
        url: "https://api.example.com/users/1",
        method: "DELETE",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      requestQueue.add(mockRequest);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      await requestQueue.executeAll("token");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("real-world scenarios", () => {
    it("should handle token refresh flow with queued requests", async () => {
      const userRequest = {
        url: "https://api.example.com/users/me",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      const settingsRequest = {
        url: "https://api.example.com/settings",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        resolve: vi.fn(),
        reject: vi.fn(),
      };

      // Simulate token refresh in progress
      requestQueue.setRefreshing(true);
      expect(requestQueue.isRefreshingInProgress()).toBe(true);

      // Queue up requests during refresh
      requestQueue.add(userRequest);
      requestQueue.add(settingsRequest);

      // Complete refresh
      requestQueue.setRefreshing(false);

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      // Execute queued requests with new token
      const newToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      await requestQueue.executeAll(newToken);

      expect(userRequest.resolve).toHaveBeenCalled();
      expect(settingsRequest.resolve).toHaveBeenCalled();
      expect(requestQueue.isRefreshingInProgress()).toBe(false);
    });

    it("should handle mixed success and failure in concurrent requests", async () => {
      const requests = Array.from({ length: 5 }, (_, i) => ({
        url: `https://api.example.com/data/${i}`,
        method: "GET",
        headers: {},
        resolve: vi.fn(),
        reject: vi.fn(),
      }));

      requests.forEach((req) => requestQueue.add(req));

      // Simulate somerequests succeeding and some failing
      (globalThis.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ id: 0 }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: vi.fn().mockResolvedValue({ message: "Not Found" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ id: 2 }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ message: "Server Error" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ id: 4 }),
        });

      await requestQueue.executeAll("token-123");

      expect(requests[0].resolve).toHaveBeenCalled();
      expect(requests[1].reject).toHaveBeenCalled();
      expect(requests[2].resolve).toHaveBeenCalled();
      expect(requests[3].reject).toHaveBeenCalled();
      expect(requests[4].resolve).toHaveBeenCalled();
    });
  });
});
