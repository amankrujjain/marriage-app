'use client';

import { SiteHeader } from '@/components/landing/SiteHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { FreeTools } from '@/components/landing/FreeTools';
import { WhyUs } from '@/components/landing/WhyUs';
import { Pricing } from '@/components/landing/Pricing';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { useReveal } from '@/components/landing/useReveal';

export default function HomePage() {
  useReveal();

  return (
    <div className="landing">
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <HowItWorks />
        <DesignsStrip />
        <FreeTools />
        <WhyUs />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
