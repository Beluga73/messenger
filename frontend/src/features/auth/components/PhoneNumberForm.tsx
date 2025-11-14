"use client";

import { useState } from "react";
import { CountryCombobox } from "@/features/auth/components/CountryCombobox";
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
import { useSubmitPhoneNumber } from "../hooks/useSubmitPhoneNumber";
import { Phone } from "lucide-react";

type PhoneNumberFormProps = {
  heading: string;
  buttonText: string;
  handlePhoneNumberSubmit: (phoneNumber: string) => Promise<void>;
};

export default function PhoneNumberForm({
  heading,
  buttonText,
  handlePhoneNumberSubmit,
}: PhoneNumberFormProps) {
  const [nationalNumber, setNationalNumber] = useState("");
  const [callingCode, setCallingCode] = useState<CountryCallingCode>(
    getCountryCallingCode("PL")
  );
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let phoneNumberObject: PhoneNumber;

    try {
      phoneNumberObject = parsePhoneNumberWithError(
        `+${callingCode}${nationalNumber}`
      );
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

    try {
      await handlePhoneNumberSubmit(phoneNumberObject.number);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to contact server. Please try again.";
      setError(new Error(errorMsg));
    }

    return (
      <div className="h-screen flex justify-center items-center">
        <form className="w-full max-w-xs md:max-w-md" onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <h1 className="text-3xl">{heading}</h1>
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
                      <Phone className="mr-2 h-4 w-4 opacity-70" />+
                      {callingCode}
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
                    <h3 className="text-destructive">{error.message}</h3>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field>
              <Button>{buttonText}</Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    );
  };
}
