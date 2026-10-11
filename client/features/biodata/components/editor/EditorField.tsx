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
}: EditorFieldProps) {
  const isDate = type === 'date';
  const isArea = type === 'textarea' || Boolean(hint?.toLowerCase().includes('about'));

  if (isArea || type === 'textarea') {
    return (
      <div className="field">
        <label htmlFor={name} style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--ink-2)' }}>
          {label}
          {hint ? (
            <span className="note" style={{ display: 'block', fontWeight: 500 }}>
              {hint}
            </span>
          ) : null}
        </label>
        <textarea
          className="input"
          id={name}
          name={name}
          rows={4}
          style={{ minHeight: 96, resize: 'vertical' }}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="frow">
      <label htmlFor={name}>
        {label}
        {hint ? (
          <span className="note" style={{ display: 'block', fontWeight: 500, fontSize: '.75rem' }}>
            {hint}
          </span>
        ) : null}
      </label>
      <input
        className="input"
        id={name}
        type={isDate ? 'date' : type}
        name={name}
        value={isDate ? toDateInputValue(value) : value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) =>
          onChange(isDate ? normalizeDateStorage(event.target.value) : event.target.value)
        }
      />
    </div>
  );
}
