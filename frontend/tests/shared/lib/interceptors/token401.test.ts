import { buildUrl } from "@/shared/lib/buildUrl";
import { handle401 } from "@/shared/lib/interceptors/token401";
import { requestQueue } from "@/shared/lib/requestQueue";
import { useTokenStore } from "@/stores/tokenStore";

// Mock dependencies
vi.mock("@/stores/tokenStore");
vi.mock("@/shared/lib/buildUrl");
vi.mock("@/shared/lib/requestQueue");

const mockGetState = vi.mocked(useTokenStore.getState);
const mockBuildUrl = vi.mocked(buildUrl);
const mockRequestQueue = vi.mocked(requestQueue);

describe("handle401", () => {
  const mockFetch = vi.fn();
  globalThis.fetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBuildUrl.mockReturnValue("http://localhost:8080/api/auth/token/refresh");
    mockRequestQueue.isRefreshingInProgress.mockReturnValue(false);
    mockRequestQueue.setRefreshing.mockImplementation(() => {});
    mockRequestQueue.clear.mockImplementation(() => {});
    mockRequestQueue.executeAll.mockResolvedValue(undefined);
    mockRequestQueue.add.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws error when no refresh token available", async () => {
    mockGetState.mockReturnValue({
      jwtToken: null,
      refreshToken: null,
      setTokens: vi.fn(),
      clearTokens: vi.fn(),
    } as any);

    const request = {
      url: "http://localhost:8080/api/test",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    await expect(handle401(request)).rejects.toThrow("Unauthorized");
  });

  it("queues request when already refreshing", async () => {
    const setTokens = vi.fn();
    const clearTokens = vi.fn();

    mockGetState.mockReturnValue({
      jwtToken: "old-token",
      refreshToken: "refresh-token",
      setTokens,
      clearTokens,
    } as any);

    mockRequestQueue.isRefreshingInProgress.mockReturnValue(true);

    const request = {
      url: "http://localhost:8080/api/test",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    handle401(request);

    expect(mockRequestQueue.add).toHaveBeenCalledWith(
      expect.objectContaining({
        url: request.url,
        method: request.method,
      })
    );

    // The promise should resolve when the queued request resolves
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("successfully refreshes token and retries original request", async () => {
    const setTokens = vi.fn();
    const clearTokens = vi.fn();

    mockGetState.mockReturnValue({
      jwtToken: "old-token",
      refreshToken: "refresh-token",
      setTokens,
      clearTokens,
    } as any);

    const refreshResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        jwtToken: "new-jwt-token",
        refreshToken: "new-refresh-token",
      }),
    } as unknown as Response;

    const retryResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: "success" }),
    } as unknown as Response;

    mockFetch.mockResolvedValueOnce(refreshResponse).mockResolvedValueOnce(retryResponse);

    const request = {
      url: "http://localhost:8080/api/test",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer old-token",
      },
    };

    const result = await handle401(request);

    // Verify refresh token was called
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8080/api/auth/token/refresh",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: "refresh-token" }),
      })
    );

    // Verify tokens were updated
    expect(setTokens).toHaveBeenCalledWith("new-jwt-token", "new-refresh-token");

    // Verify queued requests were executed
    expect(mockRequestQueue.executeAll).toHaveBeenCalledWith("new-jwt-token");

    // Verify original request was retried with new token
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/test",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer new-jwt-token",
        }),
      })
    );

    expect(result).toBe(retryResponse);
  });

  it("clears tokens and queue when refresh fails", async () => {
    const setTokens = vi.fn();
    const clearTokens = vi.fn();

    mockGetState.mockReturnValue({
      jwtToken: "old-token",
      refreshToken: "refresh-token",
      setTokens,
      clearTokens,
    } as any);

    const failedRefreshResponse = {
      ok: false,
      status: 401,
    } as unknown as Response;

    mockFetch.mockResolvedValueOnce(failedRefreshResponse);

    const request = {
      url: "http://localhost:8080/api/test",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    await expect(handle401(request)).rejects.toThrow("Token refresh failed");

    expect(mockRequestQueue.clear).toHaveBeenCalled();
    expect(clearTokens).toHaveBeenCalled();
  });

  it("sets refreshing flag to false in finally block", async () => {
    const setTokens = vi.fn();
    const clearTokens = vi.fn();

    mockGetState.mockReturnValue({
      jwtToken: "old-token",
      refreshToken: "refresh-token",
      setTokens,
      clearTokens,
    } as any);

    const refreshResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        jwtToken: "new-jwt-token",
        refreshToken: "new-refresh-token",
      }),
    } as unknown as Response;

    const retryResponse = {
      ok: true,
    } as unknown as Response;

    mockFetch.mockResolvedValueOnce(refreshResponse).mockResolvedValueOnce(retryResponse);

    const request = {
      url: "http://localhost:8080/api/test",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    await handle401(request);

    // Verify setRefreshing was called twice - once with true, once with false
    expect(mockRequestQueue.setRefreshing).toHaveBeenNthCalledWith(1, true);
    expect(mockRequestQueue.setRefreshing).toHaveBeenNthCalledWith(2, false);
  });

  it("handles request with body correctly", async () => {
    const setTokens = vi.fn();
    const clearTokens = vi.fn();

    mockGetState.mockReturnValue({
      jwtToken: "old-token",
      refreshToken: "refresh-token",
      setTokens,
      clearTokens,
    } as any);

    const refreshResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        jwtToken: "new-jwt-token",
        refreshToken: "new-refresh-token",
      }),
    } as unknown as Response;

    const retryResponse = {
      ok: true,
    } as unknown as Response;

    mockFetch.mockResolvedValueOnce(refreshResponse).mockResolvedValueOnce(retryResponse);

    const requestBody = { key: "value" };
    const request = {
      url: "http://localhost:8080/api/test",
      method: "POST",
      body: requestBody,
      headers: { "Content-Type": "application/json" },
    };

    await handle401(request);

    // Verify retry request includes serialized body
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify(requestBody),
      })
    );
  });
});
