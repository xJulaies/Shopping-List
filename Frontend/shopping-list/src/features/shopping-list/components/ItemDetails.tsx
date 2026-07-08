import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  setActionFeedback,
  takeActionFeedback,
} from "@/shared/utils/actionFeedback";
import { useItem } from "../hooks/useItem";
import { useDeleteItem } from "../hooks/useItemMutations";

export function ItemDetails({ itemId }: { itemId: string }) {
  const { data: item, isLoading, isError } = useItem(itemId);
  const deleteItem = useDeleteItem();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(() => takeActionFeedback());

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
        <span className="ml-3">Eintrag wird geladen...</span>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="flex flex-col items-center py-16 text-center gap-3">
        <p className="text-lg font-medium">Eintrag nicht gefunden.</p>
        <Link to="/items" className="link link-primary">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  function handleDelete() {
    const shouldDelete = window.confirm(
      "Möchtest du diesen Eintrag wirklich löschen?",
    );
    if (!shouldDelete) return;

    deleteItem.mutate(itemId, {
      onSuccess: () => {
        setActionFeedback("Eintrag wurde gelöscht.");
        navigate({ to: "/items" });
      },
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <Link
        to="/items"
        className="link link-primary text-sm mb-4 inline-block"
      >
        ← Zurück zur Übersicht
      </Link>

      {feedback && (
        <div className="alert alert-success mb-4">
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

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <div className="flex items-start justify-between gap-2">
            <h1 className="card-title text-2xl">{item.title}</h1>
            <span className="badge badge-lg">{item.status}</span>
          </div>

          <p className="text-base-content/70">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <span className="text-base-content/50">Kategorie</span>
              <p className="font-medium">{item.category}</p>
            </div>
            <div>
              <span className="text-base-content/50">Priorität</span>
              <p className="font-medium">{item.priority}</p>
            </div>
            <div>
              <span className="text-base-content/50">Menge</span>
              <p className="font-medium">
                {item.quantity} {item.unit}
              </p>
            </div>
            <div>
              <span className="text-base-content/50">Preis</span>
              <p className="font-medium">
                {item.price !== undefined ? `${item.price.toFixed(2)} €` : "—"}
              </p>
            </div>
            {item.store && (
              <div>
                <span className="text-base-content/50">Laden</span>
                <p className="font-medium">{item.store}</p>
              </div>
            )}
          </div>

          <div className="card-actions justify-end mt-6">
            <Link
              to="/items/$itemId/edit"
              params={{ itemId: item.id }}
              className="btn btn-outline"
            >
              Bearbeiten
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteItem.isPending}
              className="btn btn-error"
            >
              {deleteItem.isPending ? "Löschen..." : "Löschen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
