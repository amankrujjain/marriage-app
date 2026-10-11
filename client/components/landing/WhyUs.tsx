const ITEMS = [
  {
    title: 'Right on paper',
    body: 'One A4 page, with exact colours in print. Long details scale down so everything stays on a single sheet.',
    icon: (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 12V5h14v7M9 23H5v-9h22v9h-4M9 19h14v8H9z" />
      </svg>
    ),
  },
  {
    title: 'Right on WhatsApp',
    body: 'A tidy 4:5 card with your photo and key lines, ready to send with the full PDF.',
    icon: (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 26l2-6a11 11 0 1 1 4 4z" />
        <path d="M12 12c0 5 4 9 8 9l2-2-3-2-1.5 1c-1-.5-2.5-2-3-3l1-1.5-2-3z" />
      </svg>
    ),
  },
  {
    title: 'Respectful by default',
    body: 'Dignified designs, plain wording and no clutter. Your draft stays on this device until you save it.',
    icon: (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 4l10 4v8c0 6-4 10-10 12C10 26 6 22 6 16V8z" />
        <path d="M11 16l4 4 6-8" />
      </svg>
    ),
  },
] as const;

export function WhyUs() {
  return (
    <section className="sec" aria-labelledby="why-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Why families choose it</span>
          <h2 id="why-h">Built the way families actually share biodatas</h2>
        </div>
        <div className="why-grid">
          {ITEMS.map((item) => (
            <div className="why-card reveal" key={item.title}>
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
