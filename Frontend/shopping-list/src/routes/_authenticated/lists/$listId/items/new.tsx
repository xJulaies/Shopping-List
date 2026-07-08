import { createFileRoute } from "@tanstack/react-router";
import { CreateItemPage } from "../../../../../features/shopping-list/components/CreateItemPage";

export const Route = createFileRoute("/_authenticated/lists/$listId/items/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  return <CreateItemPage listId={listId} />;
}
