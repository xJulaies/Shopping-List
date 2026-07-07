import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "../features/auth/sign-in/SignInPage";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});
