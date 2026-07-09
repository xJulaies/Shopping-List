import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  markItemAsJustCreated,
  setActionFeedback,
} from "@/shared/utils/actionFeedback";
import { useCreateItem } from "../hooks/useItemMutations";
import { ItemForm } from "./ItemForm";
import type { CreateShoppingItemInput } from "../types/item";

export function CreateItemPage({ listId }: { listId: string }) {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(values: CreateShoppingItemInput) {
    setError(null);
    createItem.mutate(
      { listId, data: values },
      {
        onSuccess: (created) => {
          setActionFeedback("Eintrag wurde erfolgreich erstellt.");
          markItemAsJustCreated();
          navigate({
            to: "/lists/$listId/items/$itemId",
            params: { listId, itemId: created.id },
          });
        },
        onError: () => {
          setError("Item konnte nicht erstellt werden. Bitte erneut versuchen.");
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Einkaufsliste</p>
        <h1 className="text-3xl font-bold">Neuer Eintrag</h1>
        <p className="mt-2 text-base-content/70">
          Trage Menge, Laden und Priorität ein, damit der Einkauf später
          leicht zu scannen ist.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <ItemForm
        onSubmit={handleSubmit}
        isSubmitting={createItem.isPending}
        submitLabel="Erstellen"
      />
    </div>
  );
}
