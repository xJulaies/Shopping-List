/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type StatusFilter = "alle" | "offen" | "im Warenkorb" | "gekauft";
type CategoryFilter =
  | "alle"
  | "Obst & Gemüse"
  | "Milchprodukte"
  | "Fleisch & Fisch"
  | "Getränke"
  | "Haushalt"
  | "Sonstiges";
type PriorityFilter = "alle" | "niedrig" | "mittel" | "hoch";
type SortOption = "newest" | "oldest" | "title" | "status" | "priority";

interface ListPreferences {
  search: string;
  status: StatusFilter;
  category: CategoryFilter;
  priority: PriorityFilter;
  sortBy: SortOption;
}

interface ListPreferencesContextValue extends ListPreferences {
  setSearch: (value: string) => void;
  setStatus: (value: StatusFilter) => void;
  setCategory: (value: CategoryFilter) => void;
  setPriority: (value: PriorityFilter) => void;
  setSortBy: (value: SortOption) => void;
  resetPreferences: () => void;
}

const STORAGE_KEY = "shopping-list-preferences";

const defaultPreferences: ListPreferences = {
  search: "",
  status: "alle",
  category: "alle",
  priority: "alle",
  sortBy: "newest",
};

const ListPreferencesContext =
  createContext<ListPreferencesContextValue | null>(null);

function loadPreferences(): ListPreferences {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) return defaultPreferences;

  try {
    return { ...defaultPreferences, ...JSON.parse(stored) };
  } catch {
    return defaultPreferences;
  }
}

export function ListPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ListPreferences>(() =>
    loadPreferences(),
  );

  function updatePreferences(next: Partial<ListPreferences>) {
    setPreferences((current) => {
      const updated = { ...current, ...next };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  const value = useMemo<ListPreferencesContextValue>(
    () => ({
      ...preferences,
      setSearch: (search) => updatePreferences({ search }),
      setStatus: (status) => updatePreferences({ status }),
      setCategory: (category) => updatePreferences({ category }),
      setPriority: (priority) => updatePreferences({ priority }),
      setSortBy: (sortBy) => updatePreferences({ sortBy }),
      resetPreferences: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setPreferences(defaultPreferences);
      },
    }),
    [preferences],
  );

  return (
    <ListPreferencesContext.Provider value={value}>
      {children}
    </ListPreferencesContext.Provider>
  );
}

export function useListPreferences() {
  const context = useContext(ListPreferencesContext);

  if (!context) {
    throw new Error(
      "useListPreferences muss innerhalb von ListPreferencesProvider verwendet werden",
    );
  }

  return context;
}
