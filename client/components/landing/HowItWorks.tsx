const STEPS = [
  {
    n: '1',
    title: 'Fill in your details',
    body: 'Personal, family and contact sections are ready, with Rashi, Gotra and Nakshatra built in. Leave anything blank and it stays off the page.',
  },
  {
    n: '2',
    title: 'Try every design',
    body: 'Your details appear live on each design. Switch between traditional, royal and modern until one feels right.',
  },
  {
    n: '3',
    title: 'Download and share',
    body: 'Get a print-ready A4 PDF and a phone-sized image that reads clearly on WhatsApp without zooming.',
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="section-band">
      <div className="section-inner">
        <h2 className="section-title">Ready in three steps</h2>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <div key={step.n} className="step-card">
              <span className="step-num">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
