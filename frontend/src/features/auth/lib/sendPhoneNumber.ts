import { fetchWrapper } from "@/shared/lib/fetchWrapper";
import { buildUrl } from "@/shared/lib/buildUrl";

// Accepts an object with phoneNumber and recaptchaToken
export const sendPhoneNumber = async ({ phoneNumber, recaptchaToken }: { phoneNumber: string; recaptchaToken: string }) => {
  const url = buildUrl("/api/auth/register/initiate");
  return fetchWrapper(url, "POST", { phoneNumber, recaptchaToken });
};
