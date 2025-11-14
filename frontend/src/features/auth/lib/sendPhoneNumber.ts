import { fetchWrapper } from "@/lib/fetchWrapper";

export const sendPhoneNumber = async (phoneNumber: string) => {
  return fetchWrapper("/api/auth/register/initiate", "POST", { phoneNumber });
};
