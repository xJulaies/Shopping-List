import type { ShoppingItem } from "../types/item";

export const statusBadgeColors: Record<ShoppingItem["status"], string> = {
  offen: "badge-warning",
  "im Warenkorb": "badge-info",
  gekauft: "badge-success",
};

export const nextItemStatus: Record<
  ShoppingItem["status"],
  ShoppingItem["status"]
> = {
  offen: "im Warenkorb",
  "im Warenkorb": "gekauft",
  gekauft: "offen",
};
