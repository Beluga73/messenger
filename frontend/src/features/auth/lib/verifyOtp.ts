import { fetchWrapper } from "@/lib/fetchWrapper";
import { buildUrl } from "@/lib/buildUrl";

export const verifyOtp = async (body: {
  phoneNumber: string;
  code: string;
}) => {
  const url = buildUrl("/api/auth/register/verify");
  return fetchWrapper(url, "POST", body);
};
