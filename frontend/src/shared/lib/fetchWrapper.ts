import { useTokenStore } from "@/stores/tokenStore";
import { buildUrl } from "./buildUrl";

export const fetchWrapper = async (
  url: string,
  method = "GET",
  body?: any,
  headers?: HeadersInit
) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body && JSON.stringify(body),
  });

  if (response.status === 401) {
    const { refreshToken, setTokens } = useTokenStore.getState();

    if (!refreshToken) {
      const error = await response.json();
      throw new Error(error?.message || "Unauthorized");
    }

    try {
      const url = buildUrl("/api/auth/token/refresh");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Token refresh failed");
      }

      const { jwtToken, _refreshToken } = await response.json();
      setTokens(jwtToken, _refreshToken);

      // Retry original request with new token
      const retryResponse = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
          ...headers,
        },
        body: body && JSON.stringify(body),
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json();
        throw new Error(error?.message || "Network response was not ok");
      }

      return retryResponse.json();
    } catch (err) {
      throw err;
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Network response was not ok");
  }

  return response.json();
};
