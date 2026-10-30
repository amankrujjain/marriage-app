type SpokeHeadingProps = {
  h1: string;
  lede?: string;
};

/** Shared spoke page H1 + lede (SSR fallback and live editor). */
export function SpokeHeading({ h1, lede }: SpokeHeadingProps) {
  return (
    <header className="wrap" style={{ paddingTop: 28, paddingBottom: 8 }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {h1}
      </h1>
      {lede ? (
        <p style={{ marginTop: 10, color: 'var(--ink-2)', maxWidth: 560 }}>
          {lede}
        </p>
      ) : null}
    </header>
  );
}
