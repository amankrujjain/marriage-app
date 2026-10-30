import type { SpokeStep } from '@/content/spokes/types';

export function SpokeSteps({ steps }: { steps: SpokeStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="sec alt" aria-labelledby="spoke-steps-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-steps-h">How it works</h2>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <div className="step reveal" key={`${step.title}-${index}`}>
              <div className="step-ic">
                <span className="step-n">{index + 1}</span>
              </div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
