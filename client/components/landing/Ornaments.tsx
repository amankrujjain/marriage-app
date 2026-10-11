/** Inline ports of ui-v1 sprite symbols `#vp-div` and `#vp-divlotus`. */

export function OrnamentDiv({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 16"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M0 8h92M148 8h92" />
        <path d="M120 1.5l6.5 6.5-6.5 6.5-6.5-6.5z" fill="currentColor" />
        <path d="M104 8c-3-5-9-5-9 0s6 5 9 0M136 8c3-5 9-5 9 0s-6 5-9 0" />
        <circle cx="108" cy="8" r="1" fill="currentColor" />
        <circle cx="132" cy="8" r="1" fill="currentColor" />
      </g>
    </svg>
  );
}

export function OrnamentDivLotus({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'orn'} viewBox="0 0 240 24" aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 14h96M144 14h96" />
        <path
          d="M120 3c-5 5-5 11 0 16 5-5 5-11 0-16z"
          fill="currentColor"
          fillOpacity=".25"
        />
        <path
          d="M120 19c-9-1-14-6-15-12 7 1 13 5 15 12zM120 19c9-1 14-6 15-12-7 1-13 5-15 12z"
          fill="currentColor"
          fillOpacity=".15"
        />
        <path d="M120 20c-14 1-22-3-26-9 9-1 20 2 26 9zM120 20c14 1 22-3 26-9-9-1-20 2-26 9z" />
      </g>
    </svg>
  );
}
