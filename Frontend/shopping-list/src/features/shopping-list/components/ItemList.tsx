import type { ShoppingItem } from "../types/item";
import { ItemCard } from "./ItemCard";

const categoryOrder: ShoppingItem["category"][] = [
  "Obst & Gemüse",
  "Milchprodukte",
  "Fleisch & Fisch",
  "Getränke",
  "Haushalt",
  "Sonstiges",
];

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

  const itemsByCategory = categoryOrder
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  const totalPrice = items.reduce((total, item) => total + (item.price ?? 0), 0);

  return (
    <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
      {itemsByCategory.map(({ category, items: categoryItems }) => (
        <section key={category} aria-labelledby={`category-${category}`}>
          <h2
            id={`category-${category}`}
            className="border-y border-base-300 bg-base-200 px-4 py-3 text-base font-bold first:border-t-0 sm:px-5"
          >
            {category}
          </h2>
          <div className="divide-y divide-base-300">
            {categoryItems.map((item) => (
              <ItemCard key={item.id} item={item} listId={listId} />
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center justify-between border-t border-base-300 bg-base-200 px-4 py-4 sm:px-5">
        <span className="font-medium">Gesamtpreis</span>
        <span className="text-lg font-bold">
          {totalPrice.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
          })}
        </span>
      </div>
    </div>
  );
}
