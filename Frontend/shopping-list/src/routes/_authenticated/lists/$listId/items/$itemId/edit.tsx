import { createFileRoute } from "@tanstack/react-router";
import { EditItemPage } from "../../../../../../features/shopping-list/components/EditItemPage";

export const Route = createFileRoute(
  "/_authenticated/lists/$listId/items/$itemId/edit",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId, itemId } = Route.useParams();
  return <EditItemPage listId={listId} itemId={itemId} />;
}
