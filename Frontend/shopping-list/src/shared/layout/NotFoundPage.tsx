export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">Seite nicht gefunden</h1>
      <p className="mt-3 text-base-content/70">
        Die gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <a href="/" className="btn btn-primary mt-6">
        Zur Startseite
      </a>
    </div>
  );
}
