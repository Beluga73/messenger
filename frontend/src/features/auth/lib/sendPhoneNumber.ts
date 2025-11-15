import { fetchWrapper } from "@/lib/fetchWrapper";
import { buildUrl } from "@/lib/buildUrl";

export const sendPhoneNumber = async (phoneNumber: string) => {
  const url = buildUrl("/api/auth/register/initiate");
  return fetchWrapper(url, "POST", { phoneNumber });
};
