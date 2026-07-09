import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import {
  createList,
  deleteList,
  getListById,
  getLists,
  updateList,
} from "../services/listService";
import { shoppingQueryKeys } from "../queryKeys";
import type {
  CreateShoppingListInput,
  ShoppingList,
  UpdateShoppingListInput,
} from "../types/list";

export function useLists() {
  const { getToken, isSignedIn, userId } = useAuth();

  return useQuery({
    queryKey: shoppingQueryKeys.lists(userId ?? "signed-out"),
    queryFn: async () => getLists(await getToken()),
    enabled: Boolean(isSignedIn),
  });
}

export function useShoppingList(listId: string) {
  const { getToken, isSignedIn, userId } = useAuth();

  return useQuery({
    queryKey: shoppingQueryKeys.list(userId ?? "signed-out", listId),
    queryFn: async () => getListById(listId, await getToken()),
    enabled: Boolean(isSignedIn) && Boolean(listId),
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation<ShoppingList, Error, CreateShoppingListInput>({
    mutationFn: async (data) => createList(data, await getToken()),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: shoppingQueryKeys.lists(userId),
        });
      }
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation<
    ShoppingList,
    Error,
    { listId: string; data: UpdateShoppingListInput }
  >({
    mutationFn: async ({ listId, data }) =>
      updateList(listId, data, await getToken()),
    onSuccess: (updatedList) => {
      if (!userId) return;
      queryClient.setQueryData(
        shoppingQueryKeys.list(userId, updatedList.id),
        updatedList,
      );
      queryClient.invalidateQueries({
        queryKey: shoppingQueryKeys.lists(userId),
      });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation<void, Error, string>({
    mutationFn: async (listId) => deleteList(listId, await getToken()),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: shoppingQueryKeys.lists(userId),
        });
      }
    },
  });
}
