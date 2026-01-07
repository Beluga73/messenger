import { useRegisterStepStore } from "@/features/auth/hooks";
import { RegisterForm, OtpForm } from "@/features/auth/components";

export default function RegisterPage() {
  const { step } = useRegisterStepStore();
  return step === "register" ? <RegisterForm /> : <OtpForm />;
}
