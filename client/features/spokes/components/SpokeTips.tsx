import type { SpokeTip } from '@/content/spokes/types';

export function SpokeTips({ tips }: { tips: SpokeTip[] }) {
  if (tips.length === 0) return null;

  return (
    <section className="sec" aria-labelledby="spoke-tips-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-tips-h">Tips</h2>
        </div>
        <div className="steps">
          {tips.map((tip, index) => (
            <div className="step reveal" key={`${tip.title}-${index}`}>
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
