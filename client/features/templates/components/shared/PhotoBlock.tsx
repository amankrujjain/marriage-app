export function PhotoBlock({
  url,
  className,
}: {
  url?: string;
  className: string;
}) {
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="Profile" className={className} crossOrigin="anonymous" />
  );
}
