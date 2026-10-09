export function MotifBg() {
  return (
    <div
      aria-hidden
      className="motif-layer pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%236B1E2F' stroke-width='1'%3E%3Ccircle cx='60' cy='60' r='28'/%3E%3Ccircle cx='60' cy='60' r='18'/%3E%3Cpath d='M60 20 L66 40 L86 40 L70 52 L76 72 L60 60 L44 72 L50 52 L34 40 L54 40 Z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '140px 140px',
      }}
    />
  );
}
