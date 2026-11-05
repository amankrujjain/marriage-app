type BrandMarkProps = {
  /** Ivory seal for maroon/dark backgrounds. Default is maroon seal for light backgrounds. */
  light?: boolean;
  className?: string;
};

export function BrandMark({ light = false, className }: BrandMarkProps) {
  const src = light ? '/brand/seal-dark.svg' : '/brand/seal-light.svg';
  return (
    <img
      src={src}
      alt=""
      width={44}
      height={44}
      className={className}
      aria-hidden="true"
      decoding="async"
    />
  );
}
