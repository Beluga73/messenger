import { OtpForm, RegisterForm } from "@/features/auth/components";
import { useRegisterStepStore } from "@/features/auth/hooks";

export default function RegisterPage() {
  const { step } = useRegisterStepStore();
  return step === "register" ? <RegisterForm /> : <OtpForm />;
}
