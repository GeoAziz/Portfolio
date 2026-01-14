export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" data-testid="404-page">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
        <p className="mt-4 text-muted-foreground">The page you requested could not be found.</p>
      </div>
    </div>
  );
}
