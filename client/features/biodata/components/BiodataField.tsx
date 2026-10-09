interface BiodataFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  optional?: boolean;
  hidden?: boolean;
  onToggleHidden?: () => void;
}

export function BiodataField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  optional = true,
  hidden,
  onToggleHidden,
}: BiodataFieldProps) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 font-body text-sm text-ink/80">
        <span>
          {label}
          {optional ? <span className="text-ink/40"> (optional)</span> : null}
        </span>
        {onToggleHidden ? (
          <button
            type="button"
            onClick={onToggleHidden}
            className="text-xs text-maroon underline decoration-gold underline-offset-2"
          >
            {hidden ? 'Show in biodata' : 'Hide in biodata'}
          </button>
        ) : null}
      </span>
      <input
        className="mt-1.5 min-h-12 w-full border border-maroon/20 bg-ivory/80 px-3 font-body text-base text-ink outline-none focus:border-maroon"
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
