import { OrnamentDivLotus } from './Ornaments';

const STEPS = [
  {
    n: '1',
    title: 'Choose a design',
    body: 'Pick from beautiful, respectful templates.',
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M38 8H16v48h32V18z" />
        <path d="M38 8v10h10" />
        <path d="M22 28h18M22 36h14M22 44h8" />
        <path d="M52 34l-14 14-2 8 8-2 14-14z" />
      </svg>
    ),
  },
  {
    n: '2',
    title: 'Add your details',
    body: 'Enter personal and family details in our simple form.',
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="10" y="8" width="34" height="46" rx="3" />
        <path d="M17 20h20M17 29h20M17 38h12" />
        <path d="M56 30l-16 16-3 9 9-3 16-16z" />
      </svg>
    ),
  },
  {
    n: '3',
    title: 'Download & share',
    body: 'Get your PDF and share via WhatsApp or print.',
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M32 6v28M21 24l11 11 11-11" />
        <path d="M8 38l6-6M56 38l-6-6" />
        <path d="M8 38v16h48V38H42l-4 6H26l-4-6z" />
      </svg>
    ),
  },
] as const;

export function HowItWorks() {
  return (
    <section className="sec alt" id="how" aria-labelledby="how-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="how-h">How it works</h2>
          <OrnamentDivLotus />
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step reveal" key={s.n}>
              <div className="step-ic">
                {s.icon}
                <span className="step-n">{s.n}</span>
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
