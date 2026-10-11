import { normalizeDateStorage, toDateInputValue } from '@/lib/formatDate';

type EditorFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
  wide?: boolean;
};

export function EditorField({
  label,
  name,
  value,
  onChange,
  hint,
  placeholder,
  type = 'text',
  wide = false,
}: EditorFieldProps) {
  const isDate = type === 'date';

  return (
    <label className={`editor-field ${wide ? 'is-wide' : ''}`}>
      <span className="editor-field-label">
        {label}
        {hint ? <span className="editor-field-hint">{hint}</span> : null}
      </span>
      <input
        className="editor-input"
        type={type}
        name={name}
        value={isDate ? toDateInputValue(value) : value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            isDate ? normalizeDateStorage(event.target.value) : event.target.value,
          )
        }
      />
    </label>
  );
}
