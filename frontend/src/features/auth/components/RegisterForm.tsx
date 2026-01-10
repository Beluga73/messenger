import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { CountryCombobox } from "@/features/auth/components";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  getCountryCallingCode,
  parsePhoneNumberWithError,
  ParseError,
  type CountryCallingCode,
  type PhoneNumber,
} from "libphonenumber-js";
import { useSubmitPhoneNumber } from "@/features/auth/hooks/useSubmitPhoneNumber";
import { useRegisterStepStore } from "@/features/auth/hooks/useRegisterStepStore";
import { usePhoneNumberStore } from "@/features/auth/hooks/usePhoneNumberStore";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const RegisterForm = () => {
  const { setStep } = useRegisterStepStore();
  const { setVerificationData } = usePhoneNumberStore();
  const { mutateAsync, isPending } = useSubmitPhoneNumber();
  const [nationalNumber, setNationalNumber] = useState("");
  const [callingCode, setCallingCode] = useState<CountryCallingCode>(
    getCountryCallingCode("PL")
  );
  const [error, setError] = useState<Error | null>(null);
  // No need to keep recaptchaToken in state for v3
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let phoneNumberObject: PhoneNumber;

    // Validating phone number
    try {
      phoneNumberObject = parsePhoneNumberWithError(
        `+${callingCode}${nationalNumber}`
      );
      if (!phoneNumberObject.isValid()) {
        setError(new Error("Enter a valid phone number!"));
        return;
      }
    } catch (err) {
      if (err instanceof ParseError) {
        if (err.message.includes("TOO_SHORT")) {
          setError(new Error("Phone number is too short."));
        } else if (err.message.includes("TOO_LONG")) {
          setError(new Error("Phone number is too long."));
        } else {
          setError(new Error("Enter a valid phone number!"));
        }
      } else {
        setError(new Error("An unknown error occurred."));
      }
      return;
    }

    // reCAPTCHA v3: execute programmatically
    try {
      const recaptcha = recaptchaRef.current;
      if (!recaptcha) {
        setError(new Error("reCAPTCHA not loaded. Try reloading the page"));
        return;
      }
      const token = await recaptcha.executeAsync();
      if (!token) {
        setError(new Error("Failed to get reCAPTCHA token."));
        return;
      }
      const phoneNumber = phoneNumberObject.number;

      const response = await mutateAsync({
        phoneNumber,
        recaptchaToken: token,
      });
      setVerificationData(phoneNumber, response.sessionInfo);
      setStep("verify");
      recaptcha.reset();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Request failed."));
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-xs md:max-w-md" onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <h1 className="text-3xl">Register</h1>
            <FieldSeparator />
            <FieldGroup>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <CountryCombobox
                  setCallingCode={setCallingCode}
                ></CountryCombobox>
              </Field>
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <div className="flex rounded-md border border-input focus-within:ring-2 focus-within:ring-offset-0 focus-within:ring-primary">
                  <div className="flex items-center px-3 text-sm bg-muted text-muted-foreground rounded-l-md border-input">
                    <Phone className="mr-2 h-4 w-4 opacity-70" />+{callingCode}
                  </div>
                  <Input
                    type="tel"
                    value={nationalNumber}
                    onChange={(e) => {
                      setError(null);
                      setNationalNumber(e.target.value);
                    }}
                    className="rounded-l-none focus-visible:ring-0 border-none"
                  />
                </div>
                {error && (
                  <h3 role="alert" className="text-destructive">
                    {error.message}
                  </h3>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            {/* reCAPTCHA v3 is invisible, no widget shown */}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              size="invisible"
              badge="bottomright"
            />
            <Button disabled={isPending}>
              {isPending ? "Submitting..." : "Register"}
            </Button>
          </Field>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? Login{" "}
            <Link to="/login" className="text-primary underline">
              here
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
