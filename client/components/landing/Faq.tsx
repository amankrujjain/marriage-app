export const FAQ_ITEMS = [
  {
    q: 'Do I need an account?',
    a: 'You can design and preview without one. An account lets you keep your saved biodatas in My Designs.',
  },
  {
    q: 'Can I make it in Hindi?',
    a: 'Yes. On the download step you can choose the language for the title lines. Field labels stay in English. More languages are planned.',
  },
  {
    q: 'Can I create a biodata without a photo?',
    a: 'Yes. Skip the photo and the design shows a neutral placeholder. Fields you leave blank do not appear on the page.',
  },
  {
    q: 'Will it fit on one page?',
    a: 'Yes. The preview shows “Fits on 1 page” and scales the text gently when you write a lot. If it still cannot fit, you are told what to shorten.',
  },
  {
    q: 'Can I change details after downloading?',
    a: 'Yes. Open it from My Designs, edit and download again. With the Wedding Pass, re-downloads are free.',
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
