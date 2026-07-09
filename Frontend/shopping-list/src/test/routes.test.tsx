import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { useAuth } from "@clerk/clerk-react";
import { routeTree } from "../routeTree.gen";

vi.mock("@clerk/clerk-react", () => ({
  SignedIn: () => null,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignIn: () => <div>Clerk Sign In</div>,
  SignUp: () => <div>Clerk Sign Up</div>,
  UserButton: () => <button type="button">User menu</button>,
}));

function renderRoute(path: string, isSignedIn = true) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [path],
    }),
    context: {
      auth: {
        isLoaded: true,
        isSignedIn,
      } as unknown as ReturnType<typeof useAuth>,
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("routes", () => {
  it("renders the home route", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("heading", {
        name: /einkauf planen, abhaken und den überblick behalten/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the about route", async () => {
    renderRoute("/about");

    expect(
      await screen.findByRole("heading", { name: /shopping list app/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/react, vite, typescript/i)).toBeInTheDocument();
  });

  it("redirects protected routes to sign in when signed out", async () => {
    renderRoute("/lists", false);

    expect(await screen.findByText("Clerk Sign In")).toBeInTheDocument();
  });

  it("renders not found for unknown routes", async () => {
    renderRoute("/route-gibt-es-nicht");

    await waitFor(() => {
      expect(screen.getByText("404")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: /seite nicht gefunden/i }),
    ).toBeInTheDocument();
  });
});
