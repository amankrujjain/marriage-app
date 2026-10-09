import Link from 'next/link';
import { PREMIUM_AMOUNT_INR } from '@marriage/shared';

export function Pricing() {
  return (
    <section id="pricing" className="pricing">
      <h2 className="pricing-title">Free to make. Pay only for the one you keep.</h2>
      <div className="pricing-grid">
        <div className="price-card">
          <b>Free</b>
          <span className="price-amount">₹0</span>
          <span className="price-desc">
            2 simple designs · PDF with small footer credit · all fields and languages
          </span>
          <Link href="/marriage-biodata-maker" className="btn-outline btn-outline-block">
            Start free
          </Link>
        </div>
        <div className="price-card price-card--featured">
          <div className="price-card-top">
            <b>Premium design</b>
            <span className="price-badge">Most chosen</span>
          </div>
          <span className="price-amount">₹{PREMIUM_AMOUNT_INR}</span>
          <span className="price-desc">
            Any design · no credit line · PDF + WhatsApp image · free re-downloads after edits
          </span>
          <Link href="/marriage-biodata-maker" className="btn-primary btn-primary-block">
            Choose a design
          </Link>
        </div>
      </div>
    </section>
  );
}
