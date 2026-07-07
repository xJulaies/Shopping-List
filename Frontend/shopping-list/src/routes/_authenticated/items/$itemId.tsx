import { createFileRoute } from "@tanstack/react-router";
import { ItemDetails } from "@/features/shopping-list/components/ItemDetails";

export const Route = createFileRoute("/_authenticated/items/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  return <ItemDetails itemId={itemId} />;
}
