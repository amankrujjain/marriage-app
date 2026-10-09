import Link from 'next/link';
import { CheckIcon } from './CheckIcon';

function HeroSheet() {
  return (
    <div className="hero-sheet">
      <div className="hero-sheet-frame" />
      <p className="hero-sheet-blessing">॥ श्री गणेशाय नमः ॥</p>
      <p className="hero-sheet-name">Ananya Sharma</p>
      <div className="hero-sheet-body">
        <div className="mini-row">
          <b>Date of Birth</b>
          <span>:</span>
          <span>14 Aug 1997</span>
          <b>Height</b>
          <span>:</span>
          <span>5 ft 4 in</span>
          <b>Rashi</b>
          <span>:</span>
          <span>Simha</span>
          <b>Education</b>
          <span>:</span>
          <span>M.Sc. Chemistry</span>
          <b>Occupation</b>
          <span>:</span>
          <span>Asst. Professor</span>
        </div>
        <div className="hero-sheet-photo">
          <div className="hero-sheet-photo-inner" />
        </div>
      </div>
      <p className="hero-sheet-section">— Family Details —</p>
      <div className="mini-row">
        <b>Father</b>
        <span>:</span>
        <span>Shri Ramesh Kumar Sharma</span>
        <b>Mother</b>
        <span>:</span>
        <span>Smt. Sunita Sharma</span>
        <b>Siblings</b>
        <span>:</span>
        <span>1 elder brother (married)</span>
        <b>Native Place</b>
        <span>:</span>
        <span>Gaya, Bihar</span>
      </div>
      <p className="hero-sheet-section">— Contact —</p>
      <div className="mini-row">
        <b>Mobile</b>
        <span>:</span>
        <span>+91 98765 43210</span>
      </div>
    </div>
  );
}

function HeroPhone() {
  return (
    <div className="hero-phone">
      <div className="hero-phone-screen">
        <div className="hero-chat-in">Didi ka biodata bhej dijiye</div>
        <div className="hero-chat-out">
          <div className="hero-chat-preview" />
          <div className="hero-chat-file">Ananya_Biodata.pdf</div>
          <div className="hero-chat-meta">1 page · A4</div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-copy animate-rise">
        <p className="hero-blessing">॥ शुभ विवाह ॥</p>
        <h1 className="hero-h">A marriage biodata your family will be proud to send</h1>
        <p className="hero-sub">
          Fill in your details once, try them on every design, and download a print-ready A4 PDF
          plus a WhatsApp-sized image. No sign-up. Your details stay on your phone.
        </p>
        <div className="hero-ctas animate-rise-delay">
          <Link href="/marriage-biodata-maker" className="btn-primary btn-primary-lg">
            Create my biodata — free
          </Link>
          <Link href="/templates" className="btn-outline">
            See all designs
          </Link>
        </div>
        <div className="hero-trust animate-rise-delay-2">
          <span className="hero-trust-item">
            <CheckIcon />
            No sign-up or OTP
          </span>
          <span className="hero-trust-item">
            <CheckIcon />
            Hindi, English + 6 languages
          </span>
          <span className="hero-trust-item">
            <CheckIcon />
            Edit and re-download anytime
          </span>
        </div>
      </div>

      <div className="hero-visual hide-sm" aria-hidden>
        <HeroSheet />
        <HeroPhone />
      </div>
    </section>
  );
}
