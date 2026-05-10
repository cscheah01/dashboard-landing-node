export default function FormError({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
      {message}
    </p>
  );
}
