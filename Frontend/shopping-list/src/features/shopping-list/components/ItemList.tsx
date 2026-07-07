import type { ShoppingItem } from "../types/item";
import { ItemCard } from "./ItemCard";

export function ItemList({ items }: { items: ShoppingItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium">No items found.</p>
        <p className="text-base-content/60 mt-1">Create your first item.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
