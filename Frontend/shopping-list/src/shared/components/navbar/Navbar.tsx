import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

function SunIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 7.5 9 9 0 1 1-9-7.5Z" />
    </svg>
  );
}

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="navbar sticky top-0 z-20 min-h-16 border-b border-base-300 bg-base-100/95 px-3 text-base-content shadow-sm backdrop-blur sm:px-4">
      <div className="navbar-start min-w-0">
        <div ref={mobileMenuRef} className="dropdown dropdown-start lg:hidden">
          <button
            type="button"
            className="btn btn-square btn-sm btn-ghost"
            aria-label={
              isMobileMenuOpen ? "Navigation schliessen" : "Navigation oeffnen"
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            <span
              className="flex h-4 w-5 flex-col justify-between"
              aria-hidden="true"
            >
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
            </span>
          </button>
          {isMobileMenuOpen && (
            <ul
              id="mobile-navigation"
              className="menu dropdown-content z-30 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              <li>
                <Link to="/lists" hash="new-list" onClick={closeMobileMenu}>
                  Neue Liste
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  activeProps={{ className: "bg-neutral text-neutral-content" }}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/lists"
                  onClick={closeMobileMenu}
                  activeProps={{ className: "bg-neutral text-neutral-content" }}
                >
                  Einkaufslisten
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  activeProps={{ className: "bg-neutral text-neutral-content" }}
                >
                  About
                </Link>
              </li>
            </ul>
          )}
        </div>

        <Link
          to="/"
          className="btn btn-ghost hidden min-w-0 px-2 text-xl font-bold hover:bg-base-200 lg:inline-flex"
        >
          <span className="truncate">Shopping List</span>
        </Link>
      </div>

      <div className="navbar-center min-w-0 lg:hidden">
        <Link
          to="/"
          className="btn btn-ghost min-w-0 px-2 text-lg font-bold hover:bg-base-200"
        >
          <span className="truncate">Shopping List</span>
        </Link>
      </div>

      <div className="navbar-end flex shrink-0 items-center gap-1 sm:gap-2">
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

        <Link
          to="/lists"
          hash="new-list"
          className="btn btn-sm btn-primary hidden lg:inline-flex"
        >
          Neue Liste
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-square btn-sm btn-outline"
          aria-label={isDark ? "Bright Mode aktivieren" : "Dark Mode aktivieren"}
          title={isDark ? "Bright Mode aktivieren" : "Dark Mode aktivieren"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <SignedOut>
          <Link
            to="/sign-in"
            className="btn btn-sm btn-ghost hidden hover:bg-base-200 sm:inline-flex"
          >
            Anmelden
          </Link>
          <Link
            to="/sign-up"
            className="btn btn-sm btn-outline hidden sm:inline-flex"
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
