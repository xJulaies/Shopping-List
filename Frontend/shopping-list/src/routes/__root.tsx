import type { useAuth } from "@clerk/clerk-react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { NotFoundPage } from "@/shared/layout/NotFoundPage";
import { RootLayout } from "@/shared/layout/RootLayout";

interface RouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
  notFoundComponent: NotFoundPage,
});
