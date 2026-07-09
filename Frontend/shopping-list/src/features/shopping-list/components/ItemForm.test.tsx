import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ItemForm } from "./ItemForm";

describe("ItemForm", () => {
  it("does not submit untouched invalid values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ItemForm onSubmit={onSubmit} submitLabel="Erstellen" />);
    await user.click(screen.getByRole("button", { name: "Erstellen" }));

    expect(
      await screen.findByText("Titel muss mindestens 2 Zeichen lang sein"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits values after the complete schema succeeds", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ItemForm onSubmit={onSubmit} submitLabel="Erstellen" />);
    await user.type(screen.getByLabelText("Titel"), "Milch");
    await user.type(
      screen.getByLabelText("Beschreibung"),
      "Bio Milch kaufen",
    );
    await user.click(screen.getByRole("button", { name: "Erstellen" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Milch",
        description: "Bio Milch kaufen",
      }),
    );
  });
});
