import { useTokenStore } from "@/stores/tokenStore";

import { buildUrl } from "./buildUrl";
import { handle401 } from "./interceptors/token401";

const request = async <T>(endpoint: string, config: RequestInit = {}): Promise<T> => {
  const url = buildUrl(endpoint);
  const { jwtToken } = useTokenStore.getState();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
    ...(config.headers || {}),
  };

  let res = await fetch(url, { ...config, headers });

  if (res.status === 401) {
    res = await handle401({
      url,
      method: config.method || "GET",
      body: config.body,
      headers,
    });
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Error ${res.status}: ${errorData.message}`);
  }

  return res.json() as Promise<T>;
};

export const api = {
  get: <T>(endpoint: string, config?: RequestInit) =>
    request<T>(endpoint, { ...config, method: "GET" }),
  post: <T>(endpoint: string, body: any, config?: RequestInit) =>
    request<T>(endpoint, { ...config, method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, config?: RequestInit) =>
    request<T>(endpoint, { ...config, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, config?: RequestInit) =>
    request<T>(endpoint, { ...config, method: "DELETE" }),
};
