import { SignUp } from "@clerk/clerk-react";

export function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <SignUp
        path="/sign-up"
        routing="path"
        fallbackRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
