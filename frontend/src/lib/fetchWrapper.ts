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
    body: body ?? JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Network response was not ok");
  }

  return response.json();
};
