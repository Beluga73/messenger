import { api } from "@/shared/lib/api";

interface SendPhoneNumberParams {
  phoneNumber: string;
  recaptchaToken: string;
}

interface SendPhoneNumberResponse {
  sessionInfo: string;
}

export const sendPhoneNumber = async ({ phoneNumber, recaptchaToken }: SendPhoneNumberParams) => {
  return api.post<SendPhoneNumberResponse>("/api/auth/register/initiate", {
    phoneNumber,
    recaptchaToken,
  });
};

interface VerifyOtpParams {
  phoneNumber: string;
  code: string;
  sessionInfo: string;
}

interface VerifyOtpResponse {
  jwtToken: string;
  refreshToken: string;
}

export const verifyOtp = async (body: VerifyOtpParams) => {
  return api.post<VerifyOtpResponse>("/api/auth/register/verify", body);
};
