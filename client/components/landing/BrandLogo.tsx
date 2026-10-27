import Link from 'next/link';
import { BrandMark } from './BrandMark';

type BrandLogoProps = {
  href?: string;
  tagline?: string;
  light?: boolean;
};

export function BrandLogo({ href = '/', tagline, light }: BrandLogoProps) {
  return (
    <Link
      href={href}
      className="logo"
      aria-label="MarriageBio home"
      style={light ? { color: '#fff' } : undefined}
    >
      <BrandMark />
      <span>
        <b style={light ? { color: '#fff' } : undefined}>
          Marriage<i>Bio</i>
        </b>
        {tagline ? <small>{tagline}</small> : null}
      </span>
    </Link>
  );
}
