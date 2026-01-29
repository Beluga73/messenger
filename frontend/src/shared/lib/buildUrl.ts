export function buildUrl(path: string, base = import.meta.env.VITE_API_BASE_URL) {
  if (!base) throw new Error("VITE_API_BASE_URL is not set");
  return new URL(path, base).toString();
}
