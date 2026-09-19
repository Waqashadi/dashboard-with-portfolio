export default function LoadingState({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border bg-card">
      <div className="text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />

        <p className="mt-3 text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}