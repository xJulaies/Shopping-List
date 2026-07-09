import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { createItem, deleteItem, updateItem } from "../services/itemService";
import { shoppingQueryKeys } from "../queryKeys";
import type {
  CreateShoppingItemInput,
  ShoppingItem,
  UpdateShoppingItemInput,
} from "../types/item";

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation<
    ShoppingItem,
    Error,
    { listId: string; data: CreateShoppingItemInput }
  >({
    mutationFn: async ({ listId, data }) =>
      createItem(listId, data, await getToken()),
    onSuccess: (_createdItem, variables) => {
      if (!userId) return;
      queryClient.invalidateQueries({
        queryKey: shoppingQueryKeys.items(userId, variables.listId),
      });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation<
    ShoppingItem,
    Error,
    { listId: string; id: string; data: UpdateShoppingItemInput }
  >({
    mutationFn: async ({ listId, id, data }) =>
      updateItem(listId, id, data, await getToken()),
    onSuccess: (updatedItem, variables) => {
      if (!userId) return;
      queryClient.setQueryData(
        shoppingQueryKeys.item(userId, variables.listId, variables.id),
        updatedItem,
      );
      queryClient.setQueryData<ShoppingItem[]>(
        shoppingQueryKeys.items(userId, variables.listId),
        (items) =>
        items?.map((item) =>
          item.id === variables.id ? updatedItem : item,
        ),
      );
      queryClient.invalidateQueries({
        queryKey: shoppingQueryKeys.items(userId, variables.listId),
      });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation<void, Error, { listId: string; id: string }>({
    mutationFn: async ({ listId, id }) =>
      deleteItem(listId, id, await getToken()),
    onSuccess: (_data, variables) => {
      if (!userId) return;
      queryClient.invalidateQueries({
        queryKey: shoppingQueryKeys.items(userId, variables.listId),
      });
    },
  });
}
