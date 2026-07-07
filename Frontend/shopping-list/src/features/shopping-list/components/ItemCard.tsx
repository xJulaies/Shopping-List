import { Link } from "@tanstack/react-router";
import type { ShoppingItem } from "../types/item";

const statusColors: Record<ShoppingItem["status"], string> = {
  offen: "badge-warning",
  "im Warenkorb": "badge-info",
  gekauft: "badge-success",
};

const priorityColors: Record<ShoppingItem["priority"], string> = {
  hoch: "badge-error",
  mittel: "badge-warning",
  niedrig: "badge-ghost",
};

export function ItemCard({ item }: { item: ShoppingItem }) {
  return (
    <Link
      to="/_authenticated/items/$itemId"
      params={{ itemId: item.id }}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-300"
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <h2 className="card-title text-base">{item.title}</h2>
          <span className={`badge ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="badge badge-outline">{item.category}</span>
          <span className={`badge ${priorityColors[item.priority]}`}>
            {item.priority}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2 text-sm">
          <span>
            {item.quantity} {item.unit}
          </span>
          {item.price !== undefined && (
            <span className="font-semibold">{item.price.toFixed(2)} €</span>
          )}
        </div>
      </div>
    </Link>
  );
}
