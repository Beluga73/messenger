import { type ChangeEvent, FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhoneNumberStore } from "@/features/auth/hooks/usePhoneNumberStore";
import { Input } from "@/shared/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { useSubmitOtp } from "@/features/auth/hooks/useSubmitOtp";

const DIGITS = 6;

export const OtpForm = () => {
  const { mutateAsync, isPending } = useSubmitOtp();
  const { phoneNumber } = usePhoneNumberStore();
  const [otp, setOtp] = useState<string[]>(new Array(DIGITS).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>(
    new Array(DIGITS).fill(null)
  );
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);

  const focusInput = (idx: number) => {
    inputs.current[idx]?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value || "";
    const digit = raw.replace(/\D/g, "").slice(-1); // only last numeric char
    setError(null);

    setOtp((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });

    if (digit && idx < DIGITS - 1) focusInput(idx + 1);
  };

  // handle Backspace, Arrow keys, Enter
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        // clear current input or previous if current is empty
        if (next[idx]) {
          next[idx] = "";
        } else if (idx > 0) {
          next[idx - 1] = "";
        }

        return next;
      });

      if (otp[idx]) {
        focusInput(idx);
      } else if (idx > 0) {
        focusInput(idx - 1);
      }
    } else if (key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focusInput(idx - 1);
    } else if (key === "ArrowRight") {
      e.preventDefault();
      if (idx < DIGITS - 1) focusInput(idx + 1);
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!paste) return;

    setOtp((prev) => {
      const next = [...prev];
      for (let i = 0; i < paste.length && idx + i < DIGITS; i++) {
        next[idx + i] = paste[i];
      }
      return next;
    });

    const lastIdx = Math.min(DIGITS - 1, idx + paste.length - 1);
    focusInput(lastIdx);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== DIGITS) {
      setError(new Error("Enter a valid OTP code"));
      return;
    }

    try {
      await mutateAsync({ code, phoneNumber });
      navigate("/chats");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Request failed."));
    }
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <form
        className="w-full max-w-sm px-4 text-center"
        onSubmit={handleSubmit}
      >
        <FieldGroup>
          <FieldSet>
            <h1 className="text-3xl">Verify your email address</h1>
            <FieldDescription className="opacity-80">
              Enter the six digit verification code sent to <br />
              <strong>{phoneNumber}</strong>
            </FieldDescription>
            <FieldGroup>
              <div className="flex justify-between">
                {new Array(DIGITS).fill("").map((_, idx) => (
                  <Input
                    key={idx}
                    ref={(el) => {
                      inputs.current[idx] = el;
                    }}
                    type="tel"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={(e) => handlePaste(e, idx)}
                    aria-label={`OTP digit ${idx}`}
                    autoComplete={idx === 0 ? "one-time-code" : "off"}
                    className="w-12 h-14"
                  />
                ))}
              </div>
              {error && (
                <h3 role="alert" className="text-destructive">
                  {error.message}
                </h3>
              )}
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button
              type="submit"
              disabled={isPending || otp.join("").length !== DIGITS}
            >
              {isPending ? "Verifying..." : "Continue"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </main>
  );
};
