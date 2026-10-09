const ITEMS = [
  {
    q: 'Do I need to sign up?',
    a: 'No. Open the editor and start typing. Your draft is saved on your own device so you can come back later.',
  },
  {
    q: 'Can I make it in Hindi?',
    a: 'Yes. Switch the form language and all labels and headings change to Hindi. Names you type stay as you type them.',
  },
  {
    q: 'Can I create a biodata without a photo?',
    a: 'Yes. Every design has a no-photo layout that still looks complete.',
  },
  {
    q: 'Can I change details after downloading?',
    a: 'Yes. Edit your saved draft and download again. Premium downloads include free re-downloads.',
  },
] as const;

export function Faq() {
  return (
    <section className="faq">
      <div className="faq-inner">
        <h2 className="faq-title">Questions families ask</h2>
        {ITEMS.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
