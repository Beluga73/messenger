import { create } from "zustand";

type RegisterStep = "register" | "verify";

type RegisterStepsState = {
  step: RegisterStep;
  setStep: (step: RegisterStep) => void;
  reset: () => void;
};

export const useRegisterStep = create<RegisterStepsState>((set) => ({
  step: "register",
  setStep: (step: RegisterStep) => set({ step }),
  reset: () => set({ step: "register" }),
}));
