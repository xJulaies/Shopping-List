import { Link } from "@tanstack/react-router";
import { useItems } from "../hooks/useItems";
import { ItemList } from "./ItemList";

export function ShoppingListOverview() {
  const { data: items, isLoading, isError } = useItems();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
        <span className="ml-3">Loading items...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-8">
        <span>Something went wrong.</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Einkaufsliste</h1>
        <Link to="/_authenticated/items/new" className="btn btn-primary">
          Neuer Eintrag
        </Link>
      </div>

      <ItemList items={items ?? []} />
    </div>
  );
}
