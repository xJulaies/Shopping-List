import type { ShoppingItem } from "../types/item";

type PricedItem = Pick<ShoppingItem, "price" | "quantity">;

export function getItemTotalPrice(item: PricedItem) {
  if (item.price === undefined) return undefined;

  return Math.round(item.price * item.quantity * 100) / 100;
}

export function formatEuroPrice(value: number) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}
