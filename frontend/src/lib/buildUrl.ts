// safe-url.ts
export function buildUrl(
  path: string,
  base = process.env.NEXT_PUBLIC_API_BASE_URL
) {
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  return new URL(path, base).toString();
}
