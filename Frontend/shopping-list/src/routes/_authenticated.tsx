import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const isLoggedIn = true; // Platzhalter

    if (!isLoggedIn) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: () => <Outlet />,
});
