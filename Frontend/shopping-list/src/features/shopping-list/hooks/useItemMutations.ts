import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { createItem, deleteItem, updateItem } from "../services/itemService";
import type {
  CreateShoppingItemInput,
  ShoppingItem,
  UpdateShoppingItemInput,
} from "../types/item";

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<
    ShoppingItem,
    Error,
    { listId: string; data: CreateShoppingItemInput }
  >({
    mutationFn: async ({ listId, data }) =>
      createItem(listId, data, await getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<
    ShoppingItem,
    Error,
    { listId: string; id: string; data: UpdateShoppingItemInput }
  >({
    mutationFn: async ({ listId, id, data }) =>
      updateItem(listId, id, data, await getToken()),
    onSuccess: (updatedItem, variables) => {
      queryClient.setQueryData(
        ["lists", variables.listId, "items", variables.id],
        updatedItem,
      );
      queryClient.setQueryData<ShoppingItem[]>(
        ["lists", variables.listId, "items"],
        (items) =>
        items?.map((item) =>
          item.id === variables.id ? updatedItem : item,
        ),
      );
      queryClient.invalidateQueries({
        queryKey: ["lists", variables.listId, "items"],
      });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<void, Error, { listId: string; id: string }>({
    mutationFn: async ({ listId, id }) =>
      deleteItem(listId, id, await getToken()),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lists", variables.listId, "items"],
      });
    },
  });
}
