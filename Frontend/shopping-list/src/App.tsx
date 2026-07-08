import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <RouterProvider router={router} context={{ auth }} />
  );
}

export default App;
