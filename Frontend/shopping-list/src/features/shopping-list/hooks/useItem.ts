import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getItemById } from "../services/itemService";
import { shoppingQueryKeys } from "../queryKeys";

export function useItem(listId: string, id: string) {
  const { getToken, isSignedIn, userId } = useAuth();

  return useQuery({
    queryKey: shoppingQueryKeys.item(userId ?? "signed-out", listId, id),
    queryFn: async () => getItemById(listId, id, await getToken()),
    enabled: Boolean(listId) && Boolean(id) && Boolean(isSignedIn),
  });
}
