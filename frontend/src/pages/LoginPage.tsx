import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement login
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-xs md:max-w-md" onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <h1 className="text-3xl">Login</h1>
            <FieldGroup>
              <Field>
                <FieldLabel>Email or phone</FieldLabel>
                <Input name="identifier" type="text" />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input name="password" type="password" />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit">Sign in</Button>
          </Field>
        </FieldGroup>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
