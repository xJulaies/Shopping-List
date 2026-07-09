import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getItemsByList } from "../services/itemService";
import { shoppingQueryKeys } from "../queryKeys";

export function useItems(listId: string) {
  const { getToken, isSignedIn, userId } = useAuth();

  return useQuery({
    queryKey: shoppingQueryKeys.items(userId ?? "signed-out", listId),
    queryFn: async () => getItemsByList(listId, await getToken()),
    enabled: Boolean(isSignedIn) && Boolean(listId),
  });
}
