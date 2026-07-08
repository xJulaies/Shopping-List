import { createFileRoute } from "@tanstack/react-router";
import { CreateItemPage } from "../../../features/shopping-list/components/CreateItemPage";

export const Route = createFileRoute("/_authenticated/items/new")({
  component: CreateItemPage,
});
