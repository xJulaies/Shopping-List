import type {
  CreateShoppingItemInput,
  ShoppingItem,
  UpdateShoppingItemInput,
} from "../types/item";
import { mockItems } from "../data/mockItems";

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_KEY = "shopping-list-items";

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

export async function getItems(): Promise<ShoppingItem[]> {
  if (!API_URL) {
    return getStoredItems();
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Einträge");
    }
    return response.json();
  } catch {
    return getStoredItems();
  }
}

export async function getItemById(id: string): Promise<ShoppingItem> {
  if (!API_URL) {
    const item = getStoredItems().find((storedItem) => storedItem.id === id);

    if (!item) {
      throw new Error("Eintrag nicht gefunden");
    }

    return item;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Eintrag nicht gefunden");
    }
    return response.json();
  } catch {
    const item = getStoredItems().find((storedItem) => storedItem.id === id);

    if (!item) {
      throw new Error("Eintrag nicht gefunden");
    }

    return item;
  }
}

export async function createItem(
  data: CreateShoppingItemInput,
): Promise<ShoppingItem> {
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

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Erstellen des Eintrags");
    }
    return response.json();
  } catch {
    const items = getStoredItems();
    saveStoredItems([...items, newItem]);
    return newItem;
  }
}

export async function updateItem(
  id: string,
  data: UpdateShoppingItemInput,
): Promise<ShoppingItem> {
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

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, updatedAt }),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren des Eintrags");
    }
    return response.json();
  } catch {
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
}

export async function deleteItem(id: string): Promise<void> {
  if (!API_URL) {
    const items = getStoredItems();
    saveStoredItems(items.filter((item) => item.id !== id));
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen des Eintrags");
    }
  } catch {
    const items = getStoredItems();
    saveStoredItems(items.filter((item) => item.id !== id));
  }
}
