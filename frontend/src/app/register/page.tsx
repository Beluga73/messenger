"use client";

import { useRegisterStep } from "@/features/auth/hooks/useRegisterStep";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function Register() {
  const { step } = useRegisterStep();
  return step === "register" ? <RegisterForm /> : <div>Verify step</div>;
}
