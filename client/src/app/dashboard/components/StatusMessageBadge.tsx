export default function StatusMessageBadge({
  hasError,
  message,
}: {
  hasError: boolean;
  message: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        hasError ? "bg-rose-300/10 text-rose-200" : "bg-teal-300/10 text-teal-200"
      }`}
    >
      {message}
    </span>
  );
}
