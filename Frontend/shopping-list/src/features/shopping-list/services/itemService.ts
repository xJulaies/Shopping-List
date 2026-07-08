import type {
  CreateShoppingItemInput,
  ShoppingItem,
  UpdateShoppingItemInput,
} from "../types/item";
import { mockItems } from "../data/mockItems";

const API_URL =
  import.meta.env.MODE === "test" ? undefined : import.meta.env.VITE_API_URL;
const STORAGE_KEY = "shopping-list-items";

type AuthToken = string | null | undefined;

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

export async function getItems(): Promise<ShoppingItem[]> {
  if (!API_URL) {
    return getStoredItems();
  }

  throw new Error("listId is required");
}

export async function getItemsByList(
  listId: string,
  token?: AuthToken,
): Promise<ShoppingItem[]> {
  if (!API_URL) {
    return getStoredItems();
  }

  const response = await fetch(`${API_URL}/lists/${listId}/items`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Einträge");
  }

  return response.json();
}

export async function getItemById(
  listIdOrId: string,
  idOrToken?: string | AuthToken,
  token?: AuthToken,
): Promise<ShoppingItem> {
  const listId = typeof idOrToken === "string" ? listIdOrId : undefined;
  const id = typeof idOrToken === "string" ? idOrToken : listIdOrId;
  const authToken = typeof idOrToken === "string" ? token : idOrToken;

  if (!API_URL) {
    const item = getStoredItems().find((storedItem) => storedItem.id === id);

    if (!item) {
      throw new Error("Eintrag nicht gefunden");
    }

    return item;
  }

  const response = await fetch(`${API_URL}/lists/${listId}/items/${id}`, {
    headers: getAuthHeaders(authToken),
  });

  if (!response.ok) {
    throw new Error("Eintrag nicht gefunden");
  }

  return response.json();
}

export async function createItem(
  listIdOrData: string | CreateShoppingItemInput,
  dataOrToken?: CreateShoppingItemInput | AuthToken,
  token?: AuthToken,
): Promise<ShoppingItem> {
  const listId = typeof listIdOrData === "string" ? listIdOrData : undefined;
  const data =
    typeof listIdOrData === "string"
      ? (dataOrToken as CreateShoppingItemInput)
      : listIdOrData;
  const authToken =
    typeof listIdOrData === "string" ? token : (dataOrToken as AuthToken);
  const now = new Date().toISOString();
  const newItem = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  if (!API_URL) {
    const items = getStoredItems();
    saveStoredItems([...items, newItem]);
    return newItem;
  }

  const response = await fetch(`${API_URL}/lists/${listId}/items`, {
    method: "POST",
    headers: getJsonHeaders(authToken),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Erstellen des Eintrags");
  }

  return response.json();
}

export async function updateItem(
  listIdOrId: string,
  idOrData: string | UpdateShoppingItemInput,
  dataOrToken?: UpdateShoppingItemInput | AuthToken,
  token?: AuthToken,
): Promise<ShoppingItem> {
  const listId = typeof idOrData === "string" ? listIdOrId : undefined;
  const id = typeof idOrData === "string" ? idOrData : listIdOrId;
  const data =
    typeof idOrData === "string"
      ? (dataOrToken as UpdateShoppingItemInput)
      : idOrData;
  const authToken =
    typeof idOrData === "string" ? token : (dataOrToken as AuthToken);
  const updatedAt = new Date().toISOString();

  if (!API_URL) {
    const items = getStoredItems();
    const item = items.find((storedItem) => storedItem.id === id);

    if (!item) {
      throw new Error("Eintrag nicht gefunden");
    }

    const updatedItem = { ...item, ...data, updatedAt };
    saveStoredItems(
      items.map((storedItem) =>
        storedItem.id === id ? updatedItem : storedItem,
      ),
    );

    return updatedItem;
  }

  const response = await fetch(`${API_URL}/lists/${listId}/items/${id}`, {
    method: "PATCH",
    headers: getJsonHeaders(authToken),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren des Eintrags");
  }

  return response.json();
}

export async function deleteItem(
  listIdOrId: string,
  idOrToken?: string | AuthToken,
  token?: AuthToken,
): Promise<void> {
  const listId = typeof idOrToken === "string" ? listIdOrId : undefined;
  const id = typeof idOrToken === "string" ? idOrToken : listIdOrId;
  const authToken = typeof idOrToken === "string" ? token : idOrToken;

  if (!API_URL) {
    const items = getStoredItems();
    saveStoredItems(items.filter((item) => item.id !== id));
    return;
  }

  const response = await fetch(`${API_URL}/lists/${listId}/items/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(authToken),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen des Eintrags");
  }
}
