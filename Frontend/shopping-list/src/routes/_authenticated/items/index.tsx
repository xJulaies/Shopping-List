import { createFileRoute } from "@tanstack/react-router";
import { ShoppingListOverview } from "@/features/shopping-list/components/ShoppingListOverview";

export const Route = createFileRoute("/_authenticated/items/")({
  component: ShoppingListOverview,
});
