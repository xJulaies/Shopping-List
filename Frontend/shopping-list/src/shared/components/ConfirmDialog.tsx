import { useEffect, useId, useRef } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Bestätigen",
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
    >
      <div className="modal-box max-w-md rounded-lg border border-base-300">
        <h2 id={titleId} className="text-lg font-bold">
          {title}
        </h2>
        <p id={descriptionId} className="mt-3 text-base-content/70">
          {description}
        </p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={isPending}
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="btn btn-error"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Löschen...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
