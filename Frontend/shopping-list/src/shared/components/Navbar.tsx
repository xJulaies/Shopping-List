import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/sign-in">Anmelden</Link>
            </li>
            <li>
              <Link to="/sign-up">Registrieren</Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          🛒 Shopping List
        </Link>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link to="/dashboard" activeProps={{ className: "btn-active" }}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/sign-in" activeProps={{ className: "btn-active" }}>
              Anmelden
            </Link>
          </li>
          <li>
            <Link to="/sign-up" activeProps={{ className: "btn-active" }}>
              Registrieren
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
