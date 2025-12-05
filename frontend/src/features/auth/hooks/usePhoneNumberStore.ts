import { create } from "zustand";

type PhoneNumberState = {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  resetPhoneNumber: () => void;
};

export const usePhoneNumberStore = create<PhoneNumberState>((set) => ({
  phoneNumber: "",
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  resetPhoneNumber: () => set({ phoneNumber: "" }),
}));
