interface BiodataTextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function BiodataTextArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
}: BiodataTextAreaProps) {
  return (
    <label className="block">
      <span className="font-body text-sm text-ink/80">
        {label}
        <span className="text-ink/40"> (optional)</span>
      </span>
      <textarea
        className="mt-1.5 w-full border border-maroon/20 bg-ivory/80 px-3 py-3 font-body text-base text-ink outline-none focus:border-maroon"
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
