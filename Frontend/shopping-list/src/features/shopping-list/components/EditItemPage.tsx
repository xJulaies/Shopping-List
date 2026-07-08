import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setActionFeedback } from "@/shared/utils/actionFeedback";
import { useItem } from "../hooks/useItem";
import { useUpdateItem } from "../hooks/useItemMutations";
import { ItemForm } from "./ItemForm";
import type { CreateShoppingItemInput } from "../types/item";

export function EditItemPage({ itemId }: { itemId: string }) {
  const navigate = useNavigate();
  const { data: item, isLoading, isError } = useItem(itemId);
  const updateItem = useUpdateItem();
  const [error, setError] = useState<string | null>(null);

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
      </div>
    );
  }

  function handleSubmit(values: CreateShoppingItemInput) {
    setError(null);
    updateItem.mutate(
      { id: itemId, data: values },
      {
        onSuccess: () => {
          setActionFeedback("Änderungen wurden erfolgreich gespeichert.");
          navigate({
            to: "/items/$itemId",
            params: { itemId },
          });
        },
        onError: () => {
          setError("Änderungen konnten nicht gespeichert werden.");
        },
      },
    );
  }

  const initialValues: CreateShoppingItemInput = {
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status,
    quantity: item.quantity,
    unit: item.unit,
    priority: item.priority,
    store: item.store ?? "",
    price: item.price,
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Einkaufsliste</p>
        <h1 className="text-3xl font-bold">Eintrag bearbeiten</h1>
        <p className="mt-2 text-base-content/70">
          Aktualisiere Status, Menge oder Preis, wenn sich beim Einkauf etwas
          ändert.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <ItemForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={updateItem.isPending}
        submitLabel="Änderungen speichern"
      />
    </div>
  );
}
