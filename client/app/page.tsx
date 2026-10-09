import { SiteHeader } from '@/components/landing/SiteHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { WhyUs } from '@/components/landing/WhyUs';
import { Pricing } from '@/components/landing/Pricing';
import { Faq } from '@/components/landing/Faq';
import { SiteFooter } from '@/components/landing/SiteFooter';

export default function HomePage() {
  return (
    <div className="landing">
      <SiteHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <DesignsStrip />
        <WhyUs />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
