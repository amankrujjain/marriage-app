import Link from 'next/link';

export function DownloadAppBar() {
  return (
    <header className="dl-bar">
      <div className="dl-bar-inner">
        <Link href="/" className="dl-brand">
          Vivah Patra
        </Link>
        <ol className="dl-steps">
          <li className="dl-step is-done">
            <span className="dl-step-num is-done">✓</span>
            Your details
          </li>
          <li className="dl-step-rule" aria-hidden />
          <li className="dl-step is-done">
            <span className="dl-step-num is-done">✓</span>
            Design
          </li>
          <li className="dl-step-rule" aria-hidden />
          <li className="dl-step is-active">
            <span className="dl-step-num">3</span>
            Download
          </li>
        </ol>
        <Link href="/marriage-biodata-maker" className="dl-edit-link">
          ← Edit details
        </Link>
      </div>
    </header>
  );
}
