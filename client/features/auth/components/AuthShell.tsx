import { OrnamentDiv } from '@/components/landing/Ornaments';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="landing auth-bg page-col">
      <SiteHeader variant="app" />
      <main id="main" className="auth">
        <div className="auth-box">
          <OrnamentDiv className="auth-orn" />
          <h1>{title}</h1>
          {subtitle ? <p className="sub">{subtitle}</p> : null}
          {children}
        </div>
      </main>
      <SiteFooter variant="mini" />
    </div>
  );
}
