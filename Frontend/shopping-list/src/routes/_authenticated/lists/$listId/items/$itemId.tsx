import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ItemDetails } from "../../../../../features/shopping-list/components/ItemDetails";

export const Route = createFileRoute(
  "/_authenticated/lists/$listId/items/$itemId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId, itemId } = Route.useParams();
  const isEditRoute = useRouterState({
    select: (state) => state.location.pathname.endsWith("/edit"),
  });

  if (isEditRoute) {
    return <Outlet />;
  }

  return <ItemDetails listId={listId} itemId={itemId} />;
}
