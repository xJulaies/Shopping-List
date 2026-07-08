import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getItemsByList } from "../services/itemService";

export function useItems(listId: string) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["lists", listId, "items"],
    queryFn: async () => getItemsByList(listId, await getToken()),
    enabled: Boolean(isSignedIn) && Boolean(listId),
  });
}
