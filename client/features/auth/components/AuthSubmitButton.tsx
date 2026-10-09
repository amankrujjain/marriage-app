export function AuthSubmitButton({
  label,
  loading,
}: {
  label: string;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 inline-flex min-h-12 w-full items-center justify-center bg-maroon px-6 font-body text-base font-medium text-ivory transition-colors hover:bg-[var(--color-maroon-deep)] disabled:opacity-60"
    >
      {loading ? 'Please wait…' : label}
    </button>
  );
}
