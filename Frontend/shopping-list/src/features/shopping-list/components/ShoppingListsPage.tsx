import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateList, useLists } from "../hooks/useLists";

export function ShoppingListsPage() {
  const navigate = useNavigate();
  const { data: lists = [], isLoading, isError } = useLists();
  const createList = useCreateList();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    createList.mutate(
      {
        title,
        description,
      },
      {
        onSuccess: (createdList) => {
          setTitle("");
          setDescription("");
          navigate({
            to: "/lists/$listId",
            params: { listId: createdList.id },
          });
        },
        onError: () => {
          setError("Einkaufsliste konnte nicht erstellt werden.");
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Einkaufslisten</p>
        <h1 className="text-3xl font-bold">Plane deinen Einkauf</h1>
        <p className="mt-2 text-base-content/70">
          Erstelle zuerst eine Liste und füge danach Produkte hinzu.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-3 rounded-lg border border-base-300 bg-base-100 p-4 md:grid-cols-[1fr_1.4fr_auto]"
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="input input-bordered w-full"
          placeholder="z.B. Wochenendeinkauf"
          minLength={2}
          maxLength={80}
          required
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="input input-bordered w-full"
          placeholder="Beschreibung optional"
          maxLength={300}
        />
        <button
          type="submit"
          disabled={createList.isPending}
          className="btn btn-primary"
        >
          {createList.isPending ? "Erstelle..." : "Liste erstellen"}
        </button>
      </form>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg" />
          <span className="ml-3">Listen werden geladen...</span>
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Einkaufslisten konnten nicht geladen werden.</span>
        </div>
      ) : lists.length === 0 ? (
        <div className="rounded-lg border border-dashed border-base-300 bg-base-100 py-16 text-center">
          <p className="text-lg font-medium">Noch keine Einkaufsliste vorhanden.</p>
          <p className="mt-1 text-base-content/60">
            Erstelle deine erste Liste, um Produkte hinzuzufügen.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              to="/lists/$listId"
              params={{ listId: list.id }}
              className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="card-body">
                <h2 className="card-title">{list.title}</h2>
                <p className="text-sm text-base-content/70">
                  {list.description || "Keine Beschreibung"}
                </p>
                <p className="mt-2 text-xs text-base-content/50">
                  Erstellt am {new Date(list.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
