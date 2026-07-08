import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="text-sm font-medium text-primary">Projektinfo</p>
      <h1 className="mt-1 text-3xl font-bold">Shopping List App</h1>
      <p className="mt-3 max-w-3xl text-base-content/70">
        Diese App ist ein React-Gruppenprojekt zum Verwalten einer gemeinsamen
        Einkaufsliste. Nutzer können Einträge erstellen, bearbeiten, löschen,
        filtern, sortieren und Details auf eigenen Seiten ansehen.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-base-300 bg-base-100 p-5">
          <h2 className="font-semibold">Tech Stack</h2>
          <p className="mt-2 text-sm text-base-content/70">
            React, Vite, TypeScript, TanStack Router, TanStack Query, TanStack
            Form, Zod, Clerk und Tailwind/DaisyUI.
          </p>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-5">
          <h2 className="font-semibold">Daten</h2>
          <p className="mt-2 text-sm text-base-content/70">
            Die Einkaufseinträge werden über Service-Funktionen geladen und
            lokal im Browser gespeichert, wenn keine API konfiguriert ist.
          </p>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-5">
          <h2 className="font-semibold">Funktionen</h2>
          <p className="mt-2 text-sm text-base-content/70">
            CRUD, Auth-Routen, Dashboard, Suche, Filter, Sortierung,
            Formularvalidierung und saubere UX-Zustände.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/dashboard" className="btn btn-primary">
          Zum Dashboard
        </Link>
        <Link to="/items" className="btn btn-outline">
          Einkaufsliste ansehen
        </Link>
      </div>
    </div>
  );
}
