import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
  useDeleteItem,
  useUpdateItem,
} from "../hooks/useItemMutations";
import type { ShoppingItem } from "../types/item";

const statusColors: Record<ShoppingItem["status"], string> = {
  offen: "badge-warning",
  "im Warenkorb": "badge-info",
  gekauft: "badge-success",
};

const nextStatus: Record<
  ShoppingItem["status"],
  ShoppingItem["status"]
> = {
  offen: "im Warenkorb",
  "im Warenkorb": "gekauft",
  gekauft: "offen",
};

export function ItemCard({
  item,
  listId,
}: {
  item: ShoppingItem;
  listId: string;
}) {
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const upcomingStatus = nextStatus[item.status];

  const cycleStatus = () => {
    updateItem.mutate({
      listId,
      id: item.id,
      data: { status: upcomingStatus },
    });
  };

  const handleDelete = () => {
    deleteItem.mutate(
      { listId, id: item.id },
      { onSuccess: () => setIsDeleteDialogOpen(false) },
    );
  };

  return (
    <>
      <div
        className="grid gap-3 px-4 py-4 transition-colors hover:bg-base-200/60 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]"
      >
      <Link
        to="/lists/$listId/items/$itemId"
        params={{ listId, itemId: item.id }}
        className="min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
      >
        <h3 className="font-semibold leading-snug">{item.title}</h3>
        <p className="mt-1 text-sm leading-5 text-base-content/65">
          {item.description}
        </p>
      </Link>
      <div className="hidden min-w-0 lg:block">
        <h3 className="font-semibold leading-snug">{item.title}</h3>
        <p className="mt-1 text-sm leading-5 text-base-content/65">
          {item.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:contents">
        <span className="whitespace-nowrap text-sm">
          {item.quantity} {item.unit}
        </span>
        <button
          type="button"
          className={`badge shrink-0 cursor-pointer transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-60 ${statusColors[item.status]}`}
          aria-label={`Status von ${item.status} zu ${upcomingStatus} ändern`}
          title={`Nächster Status: ${upcomingStatus}`}
          disabled={updateItem.isPending}
          onClick={cycleStatus}
        >
          {item.status}
        </button>
        <span className="ml-auto whitespace-nowrap text-sm font-semibold sm:ml-0 sm:min-w-20 sm:text-right">
          {item.price !== undefined
            ? item.price.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })
            : "-"}
        </span>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/lists/$listId/items/$itemId/edit"
            params={{ listId, itemId: item.id }}
            className="btn btn-outline btn-sm"
          >
            Bearbeiten
          </Link>
          <button
            type="button"
            className="btn btn-error btn-sm"
            disabled={deleteItem.isPending}
            onClick={() => setIsDeleteDialogOpen(true)}
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
    </>
  );
}
