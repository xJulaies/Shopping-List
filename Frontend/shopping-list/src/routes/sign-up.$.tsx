import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/features/auth/components/SignUpPage";

export const Route = createFileRoute("/sign-up/$")({
  component: SignUpPage,
});
