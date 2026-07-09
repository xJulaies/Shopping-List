import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/footer/Footer";
import { ListPreferencesProvider } from "@/context/ListPreferencesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { useAuth } from "@clerk/clerk-react";

interface RouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <ThemeProvider>
      <ListPreferencesProvider>
        <div className="min-h-screen flex flex-col bg-base-200 text-base-content transition-colors">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ListPreferencesProvider>
    </ThemeProvider>
  ),
  notFoundComponent: () => (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">Seite nicht gefunden</h1>
      <p className="mt-3 text-base-content/70">
        Die gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <a href="/" className="btn btn-primary mt-6">
        Zur Startseite
      </a>
    </div>
  ),
});
