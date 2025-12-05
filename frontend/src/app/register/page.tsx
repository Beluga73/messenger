"use client";

import { useRegisterStepStore } from "@/features/auth/hooks/useRegisterStepStore";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { OtpForm } from "@/features/auth/components/OtpForm";

export default function Register() {
  const { step } = useRegisterStepStore();
  return step === "register" ? <RegisterForm /> : <OtpForm />;
}
