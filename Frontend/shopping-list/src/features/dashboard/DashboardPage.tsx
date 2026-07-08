import { Link } from "@tanstack/react-router";
import { useItems } from "../shopping-list/hooks/useItems";

export function DashboardPage() {
  const { data: items = [], isLoading, isError } = useItems();
  const openItems = items.filter((item) => item.status !== "gekauft");
  const cartItems = items.filter((item) => item.status === "im Warenkorb");
  const boughtItems = items.filter((item) => item.status === "gekauft");
  const plannedTotal = openItems.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0,
  );
  const highPriority = items.filter((item) => item.priority === "hoch").length;
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const newestItems = [...items]
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
            Alle wichtigen Zahlen deiner aktuellen Liste auf einen Blick.
          </p>
        </div>
        <Link to="/items/new" className="btn btn-primary">
          Neuer Eintrag
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
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Alle Einträge</p>
              <p className="mt-2 text-3xl font-bold">{items.length}</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Noch offen</p>
              <p className="mt-2 text-3xl font-bold">{openItems.length}</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Im Warenkorb</p>
              <p className="mt-2 text-3xl font-bold">{cartItems.length}</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Gekauft</p>
              <p className="mt-2 text-3xl font-bold">{boughtItems.length}</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/60">Geplante Kosten</p>
              <p className="mt-2 text-3xl font-bold">
                {plannedTotal.toFixed(2)} €
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Neueste Einträge</h2>
                <Link to="/items" className="link link-primary text-sm">
                  Alle anzeigen
                </Link>
              </div>

              {newestItems.length === 0 ? (
                <p className="mt-4 text-base-content/70">
                  Noch keine Einträge vorhanden.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-base-300">
                  {newestItems.map((item) => (
                    <Link
                      key={item.id}
                      to="/items/$itemId"
                      params={{ itemId: item.id }}
                      className="flex items-center justify-between gap-4 py-3 hover:text-primary"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.title}</p>
                        <p className="text-sm text-base-content/60">
                          {item.category} · {item.status}
                        </p>
                      </div>
                      <span className="badge badge-outline shrink-0">
                        {item.priority}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-base-300 bg-base-100 p-5">
              <h2 className="text-xl font-semibold">Kategorien</h2>
              {categories.length === 0 ? (
                <p className="mt-4 text-base-content/70">
                  Noch keine Kategorien vorhanden.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {categories.map((category) => {
                    const count = items.filter(
                      (item) => item.category === category,
                    ).length;

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between gap-4"
                      >
                        <span>{category}</span>
                        <span className="badge badge-primary">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-base-300 bg-base-100 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Nächster Schritt</h2>
                <p className="mt-1 text-base-content/70">
                  {highPriority > 0
                    ? `${highPriority} wichtige Einträge warten noch auf dich.`
                    : "Alles wirkt entspannt. Ergänze deine Liste, wenn etwas fehlt."}
                </p>
              </div>
              <Link to="/items" className="btn btn-outline">
                Liste ansehen
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
