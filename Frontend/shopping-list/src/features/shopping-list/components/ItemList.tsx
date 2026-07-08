import type { ShoppingItem } from "../types/item";
import { ItemCard } from "./ItemCard";

export function ItemList({
  items,
  listId,
}: {
  items: ShoppingItem[];
  listId: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-base-300 bg-base-100 py-16 text-center">
        <p className="text-lg font-medium">Noch keine Einträge vorhanden.</p>
        <p className="mt-1 text-base-content/60">
          Erstelle deinen ersten Einkaufseintrag.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} listId={listId} />
      ))}
    </div>
  );
}
