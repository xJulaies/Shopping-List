import { Link } from "@tanstack/react-router";

const items = [
  { label: "Milch, 1,5%", price: "2,49", done: true },
  { label: "Bananen", price: "1,29", done: true },
  { label: "Kaffeebohnen", price: "8,99", done: false },
  { label: "Spülmittel", price: "3,49", done: false },
];

export function HeroSection() {
  return (
    <section className="bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-5 py-12 md:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-300">
            Shopping List · gemeinsame Einkaufsliste
          </p>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Einkauf planen, abhaken und den Überblick behalten.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-emerald-100/80">
            Eine klare Liste für Haushalt, WG oder Familie. Du siehst sofort,
            was noch offen ist, was schon im Warenkorb liegt und wie hoch die
            geplanten Kosten sind.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/items" className="btn btn-primary">
              Liste erstellen
            </Link>
            <Link
              to="/items/new"
              className="btn border-emerald-700 bg-transparent text-emerald-50 hover:border-amber-300 hover:bg-emerald-900"
            >
              Eintrag hinzufügen
            </Link>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-emerald-100/70">Start-Einträge</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12,48 €</p>
              <p className="text-emerald-100/70">offen geplant</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">lokal</p>
              <p className="text-emerald-100/70">ohne Setup nutzbar</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-sm rotate-[-2deg] rounded-sm bg-stone-50 p-6 text-stone-900 shadow-2xl transition hover:rotate-[-1deg]">
            <div className="text-center font-mono text-sm font-bold tracking-widest">
              SHOPPING LIST
            </div>
            <div className="my-4 border-t-2 border-dashed border-stone-300" />

            <div className="space-y-3 font-mono text-sm">
              {items.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between gap-4 ${
                    item.done ? "text-stone-400 line-through" : "text-stone-900"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border border-stone-800 text-[10px] ${
                        item.done ? "bg-stone-900 text-stone-50" : ""
                      }`}
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span>{item.price} €</span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t-2 border-dashed border-stone-300" />
            <div className="flex justify-between font-mono text-sm font-bold">
              <span>Offen</span>
              <span>12,48 €</span>
            </div>
            <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-wider text-stone-400">
              4 Artikel · gerade aktualisiert
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
