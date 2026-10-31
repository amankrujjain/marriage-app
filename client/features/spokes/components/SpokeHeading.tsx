type SpokeHeadingProps = {
  h1: string;
  lede?: string;
};

/** Shared spoke page H1 + lede (SSR fallback and live editor). */
export function SpokeHeading({ h1, lede }: SpokeHeadingProps) {
  return (
    <header className="wrap home-intro">
      <h1>{h1}</h1>
      {lede ? <p>{lede}</p> : null}
    </header>
  );
}
