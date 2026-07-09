import type {
  CreateShoppingListInput,
  ShoppingList,
  UpdateShoppingListInput,
} from "../types/list";

const API_URL = import.meta.env.VITE_API_URL;
const USE_LOCAL_STORAGE = import.meta.env.MODE === "test";
const STORAGE_KEY = "shopping-lists";

type AuthToken = string | null | undefined;

function getApiUrl() {
  if (!API_URL) {
    throw new Error("VITE_API_URL fehlt in der Frontend-Konfiguration");
  }

  return API_URL;
}

function getStoredLists(): ShoppingList[] {
  const storedLists = window.localStorage.getItem(STORAGE_KEY);

  if (!storedLists) {
    return [];
  }

  return JSON.parse(storedLists) as ShoppingList[];
}

function saveStoredLists(lists: ShoppingList[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
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

export async function getLists(token?: AuthToken): Promise<ShoppingList[]> {
  if (USE_LOCAL_STORAGE) {
    return getStoredLists();
  }

  const response = await fetch(`${getApiUrl()}/lists`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Einkaufslisten");
  }

  return response.json();
}

export async function getListById(
  listId: string,
  token?: AuthToken,
): Promise<ShoppingList> {
  if (USE_LOCAL_STORAGE) {
    const list = getStoredLists().find((storedList) => storedList.id === listId);

    if (!list) {
      throw new Error("Einkaufsliste nicht gefunden");
    }

    return list;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Einkaufsliste nicht gefunden");
  }

  return response.json();
}

export async function createList(
  data: CreateShoppingListInput,
  token?: AuthToken,
): Promise<ShoppingList> {
  const now = new Date().toISOString();
  const newList: ShoppingList = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description ?? "",
    createdAt: now,
    updatedAt: now,
  };

  if (USE_LOCAL_STORAGE) {
    const lists = getStoredLists();
    saveStoredLists([newList, ...lists]);
    return newList;
  }

  const response = await fetch(`${getApiUrl()}/lists`, {
    method: "POST",
    headers: getJsonHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Erstellen der Einkaufsliste");
  }

  return response.json();
}

export async function updateList(
  listId: string,
  data: UpdateShoppingListInput,
  token?: AuthToken,
): Promise<ShoppingList> {
  if (USE_LOCAL_STORAGE) {
    const lists = getStoredLists();
    const list = lists.find((storedList) => storedList.id === listId);

    if (!list) {
      throw new Error("Einkaufsliste nicht gefunden");
    }

    const updatedList = {
      ...list,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveStoredLists(
      lists.map((storedList) =>
        storedList.id === listId ? updatedList : storedList,
      ),
    );

    return updatedList;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}`, {
    method: "PATCH",
    headers: getJsonHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren der Einkaufsliste");
  }

  return response.json();
}

export async function deleteList(
  listId: string,
  token?: AuthToken,
): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    saveStoredLists(getStoredLists().filter((list) => list.id !== listId));
    return;
  }

  const response = await fetch(`${getApiUrl()}/lists/${listId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen der Einkaufsliste");
  }
}
