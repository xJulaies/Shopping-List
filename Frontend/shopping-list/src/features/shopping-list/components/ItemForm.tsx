import { useForm } from "@tanstack/react-form";
import { itemSchema } from "../schemas/itemSchema";
import type { CreateShoppingItemInput } from "../types/item";

const categories = [
  "Obst & Gemüse",
  "Milchprodukte",
  "Fleisch & Fisch",
  "Getränke",
  "Haushalt",
  "Sonstiges",
] as const;

const statuses = ["offen", "im Warenkorb", "gekauft"] as const;
const units = ["Stück", "kg", "g", "Liter", "Packung"] as const;
const priorities = ["niedrig", "mittel", "hoch"] as const;

const defaultValues: CreateShoppingItemInput = {
  title: "",
  description: "",
  category: "Sonstiges",
  status: "offen",
  quantity: 1,
  unit: "Stück",
  priority: "mittel",
  store: "",
  price: undefined,
};

interface ItemFormProps {
  initialValues?: CreateShoppingItemInput;
  onSubmit: (values: CreateShoppingItemInput) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ItemForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Speichern",
}: ItemFormProps) {
  const form = useForm({
    defaultValues: initialValues ?? defaultValues,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4 max-w-xl"
    >
      {/* Title */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            const result = itemSchema.shape.title.safeParse(value);
            return result.success ? undefined : result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="form-control flex flex-col gap-1">
            <label className="label" htmlFor={field.name}>
              <span className="label-text">Titel</span>
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="input input-bordered w-full"
              placeholder="z.B. Milch, 1,5%"
            />
            {field.state.meta.errors.length > 0 && (
              <span className="text-error text-sm">
                {field.state.meta.errors.join(", ")}
              </span>
            )}
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) => {
            const result = itemSchema.shape.description.safeParse(value);
            return result.success ? undefined : result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="form-control flex flex-col gap-1">
            <label className="label" htmlFor={field.name}>
              <span className="label-text">Beschreibung</span>
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="textarea textarea-bordered w-full"
              placeholder="z.B. Bio wenn möglich"
              rows={3}
            />
            {field.state.meta.errors.length > 0 && (
              <span className="text-error text-sm">
                {field.state.meta.errors.join(", ")}
              </span>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <form.Field name="category">
          {(field) => (
            <div className="form-control flex flex-col gap-1">
              <label className="label" htmlFor={field.name}>
                <span className="label-text">Kategorie</span>
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value as (typeof categories)[number],
                  )
                }
                className="select select-bordered w-full"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        {/* Status */}
        <form.Field name="status">
          {(field) => (
            <div className="form-control flex flex-col gap-1">
              <label className="label" htmlFor={field.name}>
                <span className="label-text">Status</span>
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value as (typeof statuses)[number],
                  )
                }
                className="select select-bordered w-full"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        {/* Quantity */}
        <form.Field
          name="quantity"
          validators={{
            onChange: ({ value }) => {
              const result = itemSchema.shape.quantity.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <div className="form-control flex flex-col gap-1">
              <label className="label" htmlFor={field.name}>
                <span className="label-text">Menge</span>
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === "" ? 1 : Number(e.target.value),
                  )
                }
                onBlur={field.handleBlur}
                className="input input-bordered w-full"
                min={1}
                step="any"
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-error text-sm">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Unit */}
        <form.Field name="unit">
          {(field) => (
            <div className="form-control flex flex-col gap-1">
              <label className="label" htmlFor={field.name}>
                <span className="label-text">Einheit</span>
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as (typeof units)[number])
                }
                className="select select-bordered w-full"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>
      </div>

      {/* Priority */}
      <form.Field name="priority">
        {(field) => (
          <div className="form-control flex flex-col gap-1">
            <span className="label-text">Priorität</span>
            <div className="flex gap-4">
              {priorities.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.name}
                    checked={field.state.value === p}
                    onChange={() => field.handleChange(p)}
                    className="radio radio-sm"
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        {/* Store */}
        <form.Field name="store">
          {(field) => (
            <div className="form-control flex flex-col gap-1">
              <label className="label" htmlFor={field.name}>
                <span className="label-text">Laden (optional)</span>
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                className="input input-bordered w-full"
                placeholder="z.B. Rewe"
              />
            </div>
          )}
        </form.Field>

        {/* Price */}
        <form.Field
          name="price"
          validators={{
            onChange: ({ value }) => {
              if (value === undefined) return undefined;
              const result = itemSchema.shape.price.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="form-control flex flex-col gap-1">
              <label className="label" htmlFor={field.name}>
                <span className="label-text">Preis (optional)</span>
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === "" || Number.isNaN(e.target.valueAsNumber)
                      ? undefined
                      : e.target.valueAsNumber,
                  )
                }
                onBlur={field.handleBlur}
                className="input input-bordered w-full"
                min={0}
                step="0.01"
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-error text-sm">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(formIsSubmitting) => (
          <button
            type="submit"
            disabled={isSubmitting || formIsSubmitting}
            className="btn btn-primary mt-2"
          >
            {isSubmitting ? "Speichern..." : submitLabel}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
