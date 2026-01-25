interface QueuedRequest {
  url: string;
  method: string;
  body?: any;
  headers: HeadersInit;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

const queue: QueuedRequest[] = [];
let isRefreshing = false;

export const requestQueue = {
  add(request: QueuedRequest): void {
    queue.push(request);
  },

  isRefreshingInProgress(): boolean {
    return isRefreshing;
  },

  setRefreshing(value: boolean): void {
    isRefreshing = value;
  },

  async executeAll(newJwtToken: string): Promise<void> {
    const requests = queue.splice(0);

    for (const request of requests) {
      try {
        const headers = {
          ...request.headers,
          Authorization: `Bearer ${newJwtToken}`,
        };

        const response = await fetch(request.url, {
          method: request.method,
          headers,
          body: request.body && JSON.stringify(request.body),
        });

        if (response.ok) {
          request.resolve(response.json());
        } else {
          const errorData = await response.json();
          request.reject(new Error(`Error ${response.status}: ${errorData.message}`));
        }
      } catch (error) {
        request.reject(error);
      }
    }
  },

  clear(): void {
    const requests = queue.splice(0);
    for (const request of requests) {
      request.reject(new Error("Token refresh failed"));
    }
  },
};
