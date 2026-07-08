import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/95 px-4 text-base-content shadow-sm backdrop-blur">
      <div className="navbar-start">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold hover:bg-base-200"
        >
          Shopping List
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-3">
        <ul className="menu menu-horizontal hidden gap-1 px-1 lg:flex">
          <li>
            <Link
              to="/dashboard"
              className="text-base-content/75 hover:bg-base-200 hover:text-base-content"
              activeProps={{ className: "bg-neutral text-neutral-content" }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/lists"
              className="text-base-content/75 hover:bg-base-200 hover:text-base-content"
              activeProps={{ className: "bg-neutral text-neutral-content" }}
            >
              Einkaufslisten
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-base-content/75 hover:bg-base-200 hover:text-base-content"
              activeProps={{ className: "bg-neutral text-neutral-content" }}
            >
              About
            </Link>
          </li>
        </ul>

        <Link to="/lists" className="btn btn-sm btn-primary">
          Neue Liste
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-sm btn-outline"
          aria-label={isDark ? "Bright Mode aktivieren" : "Dark Mode aktivieren"}
        >
          {isDark ? "Bright" : "Dark"}
        </button>
        <SignedOut>
          <Link to="/sign-in" className="btn btn-sm btn-ghost hover:bg-base-200">
            Anmelden
          </Link>
          <Link to="/sign-up" className="btn btn-sm btn-outline">
            Registrieren
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
}
