import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/95 px-4 text-base-content shadow-sm backdrop-blur">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            aria-label="Menü öffnen"
            className="btn btn-ghost hover:bg-base-200 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-56 border border-base-300 bg-base-100 p-2 text-base-content shadow-xl"
          >
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/items">Einkaufsliste</Link>
            </li>
            <li>
              <Link to="/items/new">Eintrag hinzufügen</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <button type="button" onClick={toggleTheme}>
                {isDark ? "Bright Mode" : "Dark Mode"}
              </button>
            </li>
            <li>
              <Link to="/sign-in">Anmelden</Link>
            </li>
            <li>
              <Link to="/sign-up">Registrieren</Link>
            </li>
          </ul>
        </div>
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold hover:bg-base-200"
        >
          Shopping List
        </Link>
      </div>

      <div className="navbar-end hidden lg:flex items-center gap-3">
        <ul className="menu menu-horizontal px-1 gap-1">
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
              to="/items"
              className="text-base-content/75 hover:bg-base-200 hover:text-base-content"
              activeProps={{ className: "bg-neutral text-neutral-content" }}
            >
              Einkaufsliste
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

        <Link
          to="/items/new"
          className="btn btn-sm btn-primary"
        >
          Neuer Eintrag
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-sm btn-outline"
          aria-label={
            isDark ? "Bright Mode aktivieren" : "Dark Mode aktivieren"
          }
        >
          {isDark ? "Bright" : "Dark"}
        </button>
        <SignedOut>
          <Link
            to="/sign-in"
            className="btn btn-sm btn-ghost hover:bg-base-200"
          >
            Anmelden
          </Link>
          <Link
            to="/sign-up"
            className="btn btn-sm btn-outline"
          >
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
