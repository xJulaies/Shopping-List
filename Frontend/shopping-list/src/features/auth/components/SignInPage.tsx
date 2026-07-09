import { SignIn } from "@clerk/clerk-react";

export function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <SignIn
        path="/sign-in"
        routing="path"
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
