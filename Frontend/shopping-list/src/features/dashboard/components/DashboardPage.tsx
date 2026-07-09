import { Link } from "@tanstack/react-router";
import { useLists } from "@/features/shopping-list/hooks/useLists";

export function DashboardPage() {
  const { data: lists = [], isLoading, isError } = useLists();
  const newestLists = [...lists]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard</p>
          <h1 className="text-3xl font-bold">Dein Einkaufsüberblick</h1>
          <p className="mt-2 text-base-content/70">
            Erstelle Einkaufslisten und füge danach Produkte hinzu.
          </p>
        </div>
        <Link to="/lists" className="btn btn-primary">
          Listen verwalten
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 flex items-center gap-3">
          <span className="loading loading-spinner loading-md" />
          <span>Dashboard wird geladen...</span>
        </div>
      ) : isError ? (
        <div className="alert alert-error mt-8">
          <span>Dashboard-Daten konnten nicht geladen werden.</span>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Einkaufslisten</p>
              <p className="mt-2 text-3xl font-bold">{lists.length}</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Neueste Liste</p>
              <p className="mt-2 truncate text-xl font-bold">
                {newestLists[0]?.title ?? "-"}
              </p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Nächster Schritt</p>
              <p className="mt-2 text-xl font-bold">Produkte eintragen</p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-base-300 bg-base-100 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Neueste Einkaufslisten</h2>
              <Link to="/lists" className="link link-primary text-sm">
                Alle anzeigen
              </Link>
            </div>

            {newestLists.length === 0 ? (
              <p className="mt-4 text-base-content/70">
                Noch keine Einkaufsliste vorhanden.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-base-300">
                {newestLists.map((list) => (
                  <Link
                    key={list.id}
                    to="/lists/$listId"
                    params={{ listId: list.id }}
                    className="block py-3 hover:text-primary"
                  >
                    <p className="font-medium">{list.title}</p>
                    <p className="text-sm text-base-content/60">
                      {list.description || "Keine Beschreibung"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
