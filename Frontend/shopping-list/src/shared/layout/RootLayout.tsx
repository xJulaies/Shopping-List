import { Outlet } from "@tanstack/react-router";
import { ListPreferencesProvider } from "@/context/ListPreferencesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Footer } from "@/shared/components/footer/Footer";
import { Navbar } from "@/shared/components/navbar/Navbar";

export function RootLayout() {
  return (
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
  );
}
