import { createFileRoute } from "@tanstack/react-router";
import { EditItemPage } from "../../../../features/shopping-list/components/EditItemPage";

export const Route = createFileRoute("/_authenticated/items/$itemId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  return <EditItemPage itemId={itemId} />;
}
