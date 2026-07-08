import { createFileRoute } from "@tanstack/react-router";
import { ShoppingListsPage } from "../../../features/shopping-list/components/ShoppingListsPage";

export const Route = createFileRoute("/_authenticated/items/$itemId")({
  component: ShoppingListsPage,
});
