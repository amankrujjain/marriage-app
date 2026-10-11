import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="final" aria-labelledby="fin-h">
      <div className="mandala" aria-hidden="true" />
      <div className="wrap reveal">
        <h2 id="fin-h">A biodata your family will be proud to send</h2>
        <p>Fill in your details once, try every design, and download your PDF and WhatsApp image.</p>
        <Link className="btn btn-primary" href="/marriage-biodata-maker">
          Create my biodata
        </Link>
      </div>
    </section>
  );
}
