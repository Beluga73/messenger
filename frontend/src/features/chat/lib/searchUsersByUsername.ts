import { fetchWrapper } from "@/shared/lib/fetchWrapper";
import { buildUrl } from "@/shared/lib/buildUrl";
import { SearchUserResult } from "@/features/chat/types";

export async function searchUsersByUsername(
  query: string
): Promise<SearchUserResult[]> {
  const url = buildUrl(`/Search/by-name?query=${encodeURIComponent(query)}`);
  return fetchWrapper(url, "GET");
}
