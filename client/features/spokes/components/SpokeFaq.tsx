import type { SpokeFaq as SpokeFaqItem } from '@/content/spokes/types';

export function SpokeFaq({ faqs }: { faqs: SpokeFaqItem[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="sec" id="faq" aria-labelledby="spoke-faq-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-faq-h">FAQs</h2>
        </div>
        <div className="faq reveal">
          {faqs.map((item) => (
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
