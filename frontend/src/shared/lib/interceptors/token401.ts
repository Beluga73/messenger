import { useTokenStore } from "@/stores/tokenStore";

import { buildUrl } from "../buildUrl";
import { requestQueue } from "../requestQueue";

export interface InterceptorRequest {
  url: string;
  method: string;
  body?: any;
  headers: HeadersInit;
}

export async function handle401(request: InterceptorRequest): Promise<Response> {
  const { refreshToken, setTokens, clearTokens } = useTokenStore.getState();

  if (!refreshToken) {
    throw new Error("Unauthorized");
  }

  // If already refreshing, queue this request
  if (requestQueue.isRefreshingInProgress()) {
    return new Promise((resolve, reject) => {
      requestQueue.add({
        ...request,
        resolve,
        reject,
      });
    });
  }

  requestQueue.setRefreshing(true);

  try {
    const refreshUrl = buildUrl("/api/auth/token/refresh");
    const refreshResponse = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!refreshResponse.ok) {
      requestQueue.clear();
      clearTokens();
      throw new Error("Token refresh failed");
    }

    const { jwtToken: newJwtToken, refreshToken: newRefreshToken } = await refreshResponse.json();
    setTokens(newJwtToken, newRefreshToken);

    // Execute queued requests
    await requestQueue.executeAll(newJwtToken);

    // Retry original request with new token
    const retryResponse = await fetch(request.url, {
      method: request.method,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${newJwtToken}`,
      },
      body: request.body && JSON.stringify(request.body),
    });

    return retryResponse;
  } finally {
    requestQueue.setRefreshing(false);
  }
}
