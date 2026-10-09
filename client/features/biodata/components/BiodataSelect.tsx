interface Option {
  value: string;
  label: string;
}

interface BiodataSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function BiodataSelect({
  label,
  name,
  value,
  onChange,
  options,
}: BiodataSelectProps) {
  return (
    <label className="block">
      <span className="font-body text-sm text-ink/80">
        {label}
        <span className="text-ink/40"> (optional)</span>
      </span>
      <select
        className="mt-1.5 min-h-12 w-full border border-maroon/20 bg-ivory/80 px-3 font-body text-base text-ink outline-none focus:border-maroon"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
