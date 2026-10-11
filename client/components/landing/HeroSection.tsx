import Link from 'next/link';
import { OrnamentDiv } from './Ornaments';
import { VpThumb } from './VpThumb';

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="h1">
      <div className="wrap">
        <div>
          <div className="hero-kicker reveal">
            <OrnamentDiv />
            <span className="dev" lang="hi">
              ॥ शुभ विवाह ॥
            </span>
            <OrnamentDiv flip />
          </div>
          <h1 id="h1" className="reveal">
            A marriage biodata your family will be proud to send
          </h1>
          <p className="lead reveal">
            Beautiful A4 PDF biodata designs that look perfect in print and as a WhatsApp image.
            Professional, respectful and made for Indian families.
          </p>
          <div className="cta-row reveal">
            <Link href="/marriage-biodata-maker" className="btn btn-primary">
              Create my biodata{' '}
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </Link>
            <Link href="/templates" className="btn btn-ghost">
              Browse designs
            </Link>
          </div>
          <ul className="checks reveal">
            <li>Professionally designed A4 PDF</li>
            <li>Perfect for print, share &amp; WhatsApp</li>
            <li>Trusted by families across India</li>
          </ul>
        </div>
        <div
          className="hero-art reveal"
          aria-label="Sample biodata on an A4 page, and the same biodata shared as a PDF in WhatsApp on a phone"
        >
          <div className="a4">
            <VpThumb
              slug="zari-traditional"
              credit
              aria-label="Sample Zari Traditional biodata for Ananya Sharma"
            />
          </div>
          <div className="phone" aria-hidden="true">
            <div className="phone-screen">
              <div className="wa-bar">
                <i />
                <div>
                  Ananya Sharma
                  <small>online</small>
                </div>
              </div>
              <div className="wa-body">
                <div className="wa-msg">
                  Here is the biodata of Ananya Sharma.
                  <small>11:30 AM ✓✓</small>
                </div>
                <div className="wa-file">
                  <span className="pdf-ic">PDF</span>
                  <div>
                    <b>Ananya_Sharma_Biodata.pdf</b>
                    <span>612 KB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
