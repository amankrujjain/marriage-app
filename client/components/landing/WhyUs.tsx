const POINTS = [
  {
    title: 'Your details stay with you',
    body: 'The form and the PDF are built in your browser. No account, no OTP, nothing stored on our servers.',
  },
  {
    title: 'Made for WhatsApp',
    body: 'Besides the A4 PDF you get a phone-sized image, so elders can read it without pinching and zooming.',
  },
  {
    title: 'Fits one page, every time',
    body: 'Text resizes to stay on one page. If it truly needs more room, switch to the two-page design with a photo cover.',
  },
  {
    title: 'Your family, your fields',
    body: 'Rename, reorder or remove any field. Complexion and caste are optional and never required.',
  },
] as const;

export function WhyUs() {
  return (
    <section className="why">
      <div className="why-inner">
        <h2 className="why-title">Built the way families actually share biodatas</h2>
        <div className="why-grid">
          {POINTS.map((point) => (
            <div key={point.title} className="why-item">
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
