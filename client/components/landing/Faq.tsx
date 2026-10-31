export const FAQ_ITEMS = [
  {
    q: 'Is it free to make a biodata here?',
    a: 'Yes. You can fill in your details, try every design and download a free design at no cost.',
  },
  {
    q: 'Do I need an account?',
    a: 'You can design and preview without one. An account lets you keep your saved biodatas in My Designs.',
  },
  {
    q: 'Can I make my biodata on my phone?',
    a: 'Yes. The maker works in any mobile browser, and the PDF saves straight to your phone for sharing on WhatsApp.',
  },
  {
    q: 'Can I create a biodata without a photo?',
    a: 'Yes. Skip the photo and the design shows a neutral placeholder. Fields you leave blank do not appear on the page.',
  },
  {
    q: 'Can I make it in Hindi?',
    a: 'Yes. On the download step you can choose the language for the title lines. Field labels stay in English. More languages are planned.',
  },
  {
    q: 'Can I change my biodata after downloading it?',
    a: 'Yes. Open your saved draft, make the change and download again.',
  },
] as const;

export function Faq() {
  return (
    <section className="sec" id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="faq-h">Questions families ask</h2>
        </div>
        <div className="faq reveal">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <div className="ans">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
