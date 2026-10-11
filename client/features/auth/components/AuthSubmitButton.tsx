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
      className="btn btn-primary btn-block"
      style={{ minHeight: 52, fontSize: '1.02rem' }}
    >
      {loading ? 'Please wait…' : label}{' '}
      {!loading ? (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      ) : null}
    </button>
  );
}
