import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ItemDetails } from "../../../features/shopping-list/components/ItemDetails";

export const Route = createFileRoute("/_authenticated/items/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const isEditRoute = useRouterState({
    select: (state) => state.location.pathname.endsWith("/edit"),
  });

  if (isEditRoute) {
    return <Outlet />;
  }

  return <ItemDetails itemId={itemId} />;
}
