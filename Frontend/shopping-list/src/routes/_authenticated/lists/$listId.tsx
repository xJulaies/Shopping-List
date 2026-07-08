import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ShoppingListOverview } from "../../../features/shopping-list/components/ShoppingListOverview";

export const Route = createFileRoute("/_authenticated/lists/$listId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const isItemRoute = useRouterState({
    select: (state) => state.location.pathname.includes("/items/"),
  });

  if (isItemRoute) {
    return <Outlet />;
  }

  return <ShoppingListOverview listId={listId} />;
}
