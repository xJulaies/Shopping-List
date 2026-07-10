import { useForm } from "@tanstack/react-form";
import { useEffect, useId, useRef, useState } from "react";
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
const units = ["Stück", "kg", "Liter", "Packung"] as const;
const priorities = ["niedrig", "mittel", "hoch"] as const;
const PRICE_STEP = 0.5;
const stores = [
  "Kaufland",
  "Lidl",
  "Rewe",
  "Edeka",
  "Penny",
  "Aldi",
  "Netto",
  "Famila",
] as const;

interface FormDropdownProps {
  label: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function FormDropdown({
  label,
  name,
  value,
  options,
  onChange,
  placeholder,
}: FormDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="form-control flex min-w-0 flex-col gap-1">
      <label className="label" htmlFor={`${menuId}-button`}>
        <span className="label-text">{label}</span>
      </label>
      <div ref={dropdownRef} className="dropdown w-full">
        <input type="hidden" name={name} value={value} />
        <button
          id={`${menuId}-button`}
          type="button"
          className="btn btn-outline w-full justify-between px-4 font-normal"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-haspopup="listbox"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="truncate">{value || placeholder}</span>
          <span aria-hidden="true">⌄</span>
        </button>
        {isOpen && (
          <ul
            id={menuId}
            role="listbox"
            className="menu dropdown-content z-20 mt-1 max-h-64 w-full flex-nowrap overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
          >
            {placeholder && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === ""}
                  className={value === "" ? "menu-active" : ""}
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                >
                  {placeholder}
                </button>
              </li>
            )}
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option}
                  className={value === option ? "menu-active" : ""}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface PriceInputProps {
  id: string;
  name: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
}

function PriceInput({
  id,
  name,
  value,
  onChange,
  onBlur,
}: PriceInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const formattedPrice =
    value === undefined
      ? ""
      : `${value.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} €`;

  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode="decimal"
      value={isEditing ? draft : formattedPrice}
      placeholder="0,00 €"
      onFocus={() => {
        setDraft(value === undefined ? "" : value.toFixed(2).replace(".", ","));
        setIsEditing(true);
      }}
      onChange={(event) => {
        const nextDraft = event.target.value;
        if (!/^\d*(?:[.,]\d{0,2})?$/.test(nextDraft)) return;

        setDraft(nextDraft);
        const parsedValue = Number(nextDraft.replace(",", "."));
        onChange(
          nextDraft === "" || Number.isNaN(parsedValue) ? undefined : parsedValue,
        );
      }}
      onBlur={() => {
        setIsEditing(false);
        onBlur();
      }}
      className="input input-bordered join-item min-w-0 flex-1 text-center"
    />
  );
}

const defaultValues: CreateShoppingItemInput = {
  title: "",
  description: "",
  category: "Sonstiges",
  status: "offen",
  quantity: 1,
  unit: "Stück",
  priority: "mittel",
  store: undefined,
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: initialValues ?? defaultValues,
    onSubmit: async ({ value }) => {
      const result = itemSchema.safeParse(value);

      if (!result.success) {
        setSubmitError(
          result.error.issues[0]?.message ?? "Bitte prüfe deine Eingaben.",
        );
        return;
      }

      setSubmitError(null);
      onSubmit(result.data);
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
      {submitError && (
        <div className="alert alert-error" role="alert">
          <span>{submitError}</span>
        </div>
      )}

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Category */}
        <form.Field name="category">
          {(field) => (
            <FormDropdown
              label="Kategorie"
              name={field.name}
              value={field.state.value}
              options={categories}
              onChange={(value) =>
                field.handleChange(value as (typeof categories)[number])
              }
            />
          )}
        </form.Field>

        {/* Status */}
        <form.Field name="status">
          {(field) => (
            <FormDropdown
              label="Status"
              name={field.name}
              value={field.state.value}
              options={statuses}
              onChange={(value) =>
                field.handleChange(value as (typeof statuses)[number])
              }
            />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Store */}
        <form.Field name="store">
          {(field) => (
            <FormDropdown
              label="Laden (optional)"
              name={field.name}
              value={field.state.value ?? ""}
              options={stores}
              placeholder="Keinen Laden auswählen"
              onChange={(value) =>
                field.handleChange(
                  value === ""
                    ? undefined
                    : (value as (typeof stores)[number]),
                )
              }
            />
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
                <span className="label-text">Preis pro Einheit (optional)</span>
              </label>
              <div className="join w-full">
                <button
                  type="button"
                  className="btn btn-outline join-item"
                  aria-label={`Preis um ${PRICE_STEP.toFixed(2)} EUR verringern`}
                  disabled={!field.state.value || field.state.value <= 0}
                  onClick={() =>
                    field.handleChange(
                      Math.max(
                        0,
                        Math.round(
                          ((field.state.value ?? 0) - PRICE_STEP) * 100,
                        ) / 100,
                      ),
                    )
                  }
                >
                  −
                </button>
                <PriceInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                />
                <button
                  type="button"
                  className="btn btn-outline join-item"
                  aria-label={`Preis um ${PRICE_STEP.toFixed(2)} EUR erhöhen`}
                  onClick={() =>
                    field.handleChange(
                      Math.round(
                        ((field.state.value ?? 0) + PRICE_STEP) * 100,
                      ) / 100,
                    )
                  }
                >
                  +
                </button>
              </div>
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
