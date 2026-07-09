import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
  clearActionFeedback,
  clearItemJustCreated,
  readActionFeedback,
  readItemJustCreated,
  setActionFeedback,
} from "@/shared/utils/actionFeedback";
import { useItem } from "../hooks/useItem";
import { useDeleteItem } from "../hooks/useItemMutations";

export function ItemDetails({
  listId,
  itemId,
}: {
  listId: string;
  itemId: string;
}) {
  const { data: item, isLoading, isError } = useItem(listId, itemId);
  const deleteItem = useDeleteItem();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(() => readActionFeedback());
  const [wasJustCreated] = useState(() => readItemJustCreated());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    clearActionFeedback();
    clearItemJustCreated();
  }, []);

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
        <Link
          to="/lists/$listId"
          params={{ listId }}
          className="link link-primary"
        >
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  function handleDelete() {
    deleteItem.mutate(
      { listId, id: itemId },
      {
        onSuccess: () => {
          setActionFeedback("Eintrag wurde gelöscht.");
          navigate({ to: "/lists/$listId", params: { listId } });
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link
          to="/lists/$listId"
          params={{ listId }}
          className="link link-primary text-sm"
        >
          Zurück zur Übersicht
        </Link>
        {wasJustCreated && (
          <Link
            to="/lists/$listId/items/new"
            params={{ listId }}
            className="btn btn-primary btn-square btn-sm text-xl"
            aria-label="Weiteres Produkt hinzufügen"
            title="Weiteres Produkt hinzufügen"
          >
            +
          </Link>
        )}
      </div>

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
                {item.price !== undefined ? `${item.price.toFixed(2)} EUR` : "-"}
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
              to="/lists/$listId/items/$itemId/edit"
              params={{ listId, itemId: item.id }}
              className="btn btn-outline"
            >
              Bearbeiten
            </Link>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteItem.isPending}
              className="btn btn-error"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Produkt löschen?"
        description={`Möchtest du "${item.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel="Produkt löschen"
        isPending={deleteItem.isPending}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
