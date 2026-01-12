import { create } from "zustand";

type VerificationState = {
  phoneNumber: string;
  sessionInfo: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setSessionInfo: (sessionInfo: string) => void;
  setVerificationData: (phoneNumber: string, sessionInfo: string) => void;
  resetVerificationData: () => void;
};

export const usePhoneNumberStore = create<VerificationState>((set) => ({
  phoneNumber: "",
  sessionInfo: "",
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setSessionInfo: (sessionInfo) => set({ sessionInfo }),
  setVerificationData: (phoneNumber, sessionInfo) =>
    set({ phoneNumber, sessionInfo }),
  resetVerificationData: () => set({ phoneNumber: "", sessionInfo: "" }),
}));
