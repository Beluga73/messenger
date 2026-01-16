import { useTokenStore } from "@/stores/tokenStore";
import { buildUrl } from "./buildUrl";

export const fetchWrapper = async (
  url: string,
  method = "GET",
  body?: any,
  headers?: HeadersInit
) => {
  const { jwtToken, refreshToken, setTokens } = useTokenStore.getState();

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
      ...headers,
    },
    body: body && JSON.stringify(body),
  });

  if (response.status === 401) {
    if (!refreshToken) {
      const error = await response.json();
      throw new Error(error?.message || "Unauthorized");
    }

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
        const error = await refreshResponse.json();
        throw new Error(error?.message || "Token refresh failed");
      }

      const { jwtToken: newJwtToken, newRefreshToken } =
        await refreshResponse.json();
      setTokens(newJwtToken, newRefreshToken);

      // Retry original request with new token
      const retryResponse = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newJwtToken}`,
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
