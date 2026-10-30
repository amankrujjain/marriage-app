import Link from 'next/link';

export function Pricing() {
  return (
    <section className="sec alt" id="pricing" aria-labelledby="pr-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Pricing</span>
          <h2 id="pr-h">Free to make. Pay only for the one you keep.</h2>
        </div>
        <div className="price-grid">
          <div className="price-card reveal">
            <h3>Free</h3>
            <div className="amt">₹0</div>
            <p className="note">Free designs, A4 PDF</p>
            <ul>
              <li>All free designs</li>
              <li>A4 PDF for print</li>
              <li>Small credit line on the page</li>
            </ul>
            <Link className="btn btn-ghost btn-block" href="/">
              Start free
            </Link>
          </div>
          <div className="price-card hot reveal">
            <span className="ribbon">Limited days</span>
            <h3>Wedding Pass</h3>
            <div className="amt">₹151</div>
            <p className="note">One-time, for a limited days only</p>
            <ul>
              <li>PDF + WhatsApp image</li>
              <li>No credit line</li>
              <li>Free re-downloads</li>
              <li>All premium designs</li>
            </ul>
            <Link className="btn btn-primary btn-block" href="/wedding-pass">
              Get the Wedding Pass
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
