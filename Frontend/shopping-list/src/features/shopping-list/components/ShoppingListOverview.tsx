import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useListPreferences } from "@/context/ListPreferencesContext";
import {
  clearActionFeedback,
  readActionFeedback,
} from "@/shared/utils/actionFeedback";
import { useItems } from "../hooks/useItems";
import { useShoppingList } from "../hooks/useLists";
import { ItemList } from "./ItemList";
import type { ShoppingItem } from "../types/item";

const categories = [
  "alle",
  "Obst & Gemüse",
  "Milchprodukte",
  "Fleisch & Fisch",
  "Getränke",
  "Haushalt",
  "Sonstiges",
] as const;

const statuses = ["alle", "offen", "im Warenkorb", "gekauft"] as const;
const priorities = ["alle", "niedrig", "mittel", "hoch"] as const;

const priorityOrder: Record<ShoppingItem["priority"], number> = {
  hoch: 0,
  mittel: 1,
  niedrig: 2,
};

function sortItems(items: ShoppingItem[], sortBy: string) {
  return [...items].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title, "de");
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "status") return a.status.localeCompare(b.status, "de");
    if (sortBy === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function ShoppingListOverview({ listId }: { listId: string }) {
  const { data: list } = useShoppingList(listId);
  const { data: items, isLoading, isError } = useItems(listId);
  const [feedback, setFeedback] = useState(() => readActionFeedback());
  const {
    search,
    status,
    category,
    priority,
    sortBy,
    setSearch,
    setStatus,
    setCategory,
    setPriority,
    setSortBy,
    resetPreferences,
  } = useListPreferences();

  useEffect(() => {
    clearActionFeedback();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = (items ?? []).filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "alle" || item.status === status;
      const matchesCategory = category === "alle" || item.category === category;
      const matchesPriority = priority === "alle" || item.priority === priority;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPriority
      );
    });

    return sortItems(result, sortBy);
  }, [category, items, priority, search, sortBy, status]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
        <span className="ml-3">Einträge werden geladen...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-8">
        <span>Die Einkaufsliste konnte nicht geladen werden.</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Link to="/lists" className="link link-primary mb-4 inline-block">
        Zurück zu allen Listen
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Einkaufsliste</p>
          <h1 className="text-3xl font-bold">
            {list?.title ?? "Was fehlt noch?"}
          </h1>
          <p className="mt-2 text-base-content/70">
            {list?.description ||
              "Sortiere deine Einkäufe nach Status, Priorität und geplantem Preis."}
          </p>
        </div>
        <Link
          to="/lists/$listId/items/new"
          params={{ listId }}
          className="btn btn-primary"
        >
          Neuer Eintrag
        </Link>
      </div>

      {feedback && (
        <div className="alert alert-success mb-5">
          <span>{feedback}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setFeedback(null)}
          >
            Schließen
          </button>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-base-300 bg-base-100 p-4">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr] lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
          <label className="form-control">
            <span className="label-text mb-1">Suche</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input input-bordered w-full"
              placeholder="Titel oder Beschreibung"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Status</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof statuses)[number])
              }
              className="select select-bordered w-full"
            >
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option === "alle" ? "Alle Status" : option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Kategorie</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as (typeof categories)[number])
              }
              className="select select-bordered w-full"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option === "alle" ? "Alle Kategorien" : option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Priorität</span>
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as (typeof priorities)[number])
              }
              className="select select-bordered w-full"
            >
              {priorities.map((option) => (
                <option key={option} value={option}>
                  {option === "alle" ? "Alle Prioritäten" : option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Sortierung</span>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as
                    | "newest"
                    | "oldest"
                    | "title"
                    | "status"
                    | "priority",
                )
              }
              className="select select-bordered w-full"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="title">Titel A-Z</option>
              <option value="status">Status</option>
              <option value="priority">Priorität</option>
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetPreferences}
              className="btn btn-outline w-full"
            >
              Zurücksetzen
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-base-content/60">
          {filteredItems.length} von {items?.length ?? 0} Einträgen angezeigt
        </p>
      </div>

      <ItemList items={filteredItems} listId={listId} />
    </div>
  );
}
