import type {
  CreateShoppingItemInput,
  ShoppingItem,
  UpdateShoppingItemInput,
} from "../types/item";
import { mockItems } from "../data/mockItems";

const API_URL = import.meta.env.VITE_API_URL;
const USE_LOCAL_STORAGE = import.meta.env.MODE === "test";
const STORAGE_KEY = "shopping-list-items";

type AuthToken = string | null | undefined;

function getApiUrl() {
  if (!API_URL) {
    throw new Error("VITE_API_URL fehlt in der Frontend-Konfiguration");
  }

  return API_URL;
}

function getStoredItems(): ShoppingItem[] {
  const storedItems = window.localStorage.getItem(STORAGE_KEY);

  if (!storedItems) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockItems));
    return mockItems;
  }

  return JSON.parse(storedItems) as ShoppingItem[];
}

function saveStoredItems(items: ShoppingItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getAuthHeaders(token: AuthToken) {
  if (!token) {
    throw new Error("Authentifizierung fehlt");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function getJsonHeaders(token: AuthToken) {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(token),
  };
}

export async function getItemsByList(
  listId: string,
  token?: AuthToken,
): Promise<ShoppingItem[]> {
  if (USE_LOCAL_STORAGE) {
    return getStoredItems().filter((item) => item.listId === listId);
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}/items`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Einträge");
  }

  return response.json();
}

export async function getItemById(
  listId: string,
  id: string,
  token?: AuthToken,
): Promise<ShoppingItem> {
  if (USE_LOCAL_STORAGE) {
    const item = getStoredItems().find(
      (storedItem) => storedItem.listId === listId && storedItem.id === id,
    );

    if (!item) {
      throw new Error("Eintrag nicht gefunden");
    }

    return item;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}/items/${id}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Eintrag nicht gefunden");
  }

  return response.json();
}

export async function createItem(
  listId: string,
  data: CreateShoppingItemInput,
  token?: AuthToken,
): Promise<ShoppingItem> {
  const now = new Date().toISOString();
  const newItem: ShoppingItem = {
    ...data,
    id: crypto.randomUUID(),
    listId,
    createdAt: now,
    updatedAt: now,
  };

  if (USE_LOCAL_STORAGE) {
    const items = getStoredItems();
    saveStoredItems([...items, newItem]);
    return newItem;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}/items`, {
    method: "POST",
    headers: getJsonHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Erstellen des Eintrags");
  }

  return response.json();
}

export async function updateItem(
  listId: string,
  id: string,
  data: UpdateShoppingItemInput,
  token?: AuthToken,
): Promise<ShoppingItem> {
  const updatedAt = new Date().toISOString();

  if (USE_LOCAL_STORAGE) {
    const items = getStoredItems();
    const item = items.find(
      (storedItem) => storedItem.listId === listId && storedItem.id === id,
    );

    if (!item) {
      throw new Error("Eintrag nicht gefunden");
    }

    const updatedItem = { ...item, ...data, updatedAt };
    saveStoredItems(
      items.map((storedItem) =>
        storedItem.listId === listId && storedItem.id === id
          ? updatedItem
          : storedItem,
      ),
    );

    return updatedItem;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}/items/${id}`, {
    method: "PATCH",
    headers: getJsonHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren des Eintrags");
  }

  return response.json();
}

export async function deleteItem(
  listId: string,
  id: string,
  token?: AuthToken,
): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const items = getStoredItems();
    saveStoredItems(
      items.filter((item) => item.listId !== listId || item.id !== id),
    );
    return;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}/items/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen des Eintrags");
  }
}
