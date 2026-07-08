import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import {
  createList,
  deleteList,
  getListById,
  getLists,
  updateList,
} from "../services/listService";
import type {
  CreateShoppingListInput,
  ShoppingList,
  UpdateShoppingListInput,
} from "../types/list";

export function useLists() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["lists"],
    queryFn: async () => getLists(await getToken()),
    enabled: Boolean(isSignedIn),
  });
}

export function useShoppingList(listId: string) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["lists", listId],
    queryFn: async () => getListById(listId, await getToken()),
    enabled: Boolean(isSignedIn) && Boolean(listId),
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<ShoppingList, Error, CreateShoppingListInput>({
    mutationFn: async (data) => createList(data, await getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<
    ShoppingList,
    Error,
    { listId: string; data: UpdateShoppingListInput }
  >({
    mutationFn: async ({ listId, data }) =>
      updateList(listId, data, await getToken()),
    onSuccess: (updatedList) => {
      queryClient.setQueryData(["lists", updatedList.id], updatedList);
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<void, Error, string>({
    mutationFn: async (listId) => deleteList(listId, await getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}
