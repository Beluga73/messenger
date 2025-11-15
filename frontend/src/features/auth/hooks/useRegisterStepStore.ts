import { create } from "zustand";

type RegisterStep = "register" | "verify";

type RegisterStepState = {
  step: RegisterStep;
  setStep: (step: RegisterStep) => void;
  reset: () => void;
};

export const useRegisterStepStore = create<RegisterStepState>((set) => ({
  step: "register",
  setStep: (step: RegisterStep) => set({ step }),
  reset: () => set({ step: "register" }),
}));
