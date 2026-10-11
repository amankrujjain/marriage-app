import Link from 'next/link';
import { OrnamentDiv } from '@/components/landing/Ornaments';

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="landing auth-bg">
      <main id="main" className="auth">
        <div className="auth-box">
          <div className="auth-logo">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <b>Vivah Patra</b>
            </Link>
            <OrnamentDiv className="orn" />
          </div>
          <h1>{title}</h1>
          {subtitle ? <p className="sub">{subtitle}</p> : null}
          {children}
        </div>
      </main>
    </div>
  );
}
