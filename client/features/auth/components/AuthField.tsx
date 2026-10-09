interface AuthFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
}

export function AuthField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  autoComplete,
  error,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="font-body text-sm text-ink/80">{label}</span>
      <input
        className="mt-1.5 min-h-12 w-full border border-maroon/20 bg-ivory/80 px-3 font-body text-base text-ink outline-none transition focus:border-maroon"
        type={type}
        name={name}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="mt-1 block text-sm text-maroon">{error}</span> : null}
    </label>
  );
}
