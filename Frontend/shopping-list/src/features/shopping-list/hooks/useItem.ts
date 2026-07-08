import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getItemById } from "../services/itemService";

export function useItem(listId: string, id: string) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["lists", listId, "items", id],
    queryFn: async () => getItemById(listId, id, await getToken()),
    enabled: Boolean(listId) && Boolean(id) && Boolean(isSignedIn),
  });
}
