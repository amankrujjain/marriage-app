import type { SpokeSampleDownload } from '@/content/spokes/types';
import { publicFileExists } from '@/features/spokes/sampleImages';

type SpokeDownloadsProps = {
  heading: string;
  items: SpokeSampleDownload[];
};

export function SpokeDownloads({ heading, items }: SpokeDownloadsProps) {
  if (items.length === 0) return null;

  return (
    <section className="sec" aria-labelledby="spoke-downloads-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-downloads-h">{heading}</h2>
        </div>
        <div className="spoke-dl-grid reveal">
          {items.map((item) => {
            const showPreview =
              item.previewSrc && publicFileExists(item.previewSrc);
            return (
              <div className="card spoke-dl-card" key={item.href}>
                {showPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewSrc}
                    alt={item.previewAlt ?? item.label}
                    className="spoke-dl-preview"
                  />
                ) : null}
                <b className="spoke-dl-label">{item.label}</b>
                {item.holds ? <p className="spoke-dl-holds">{item.holds}</p> : null}
                <a className="btn btn-primary" href={item.href} download>
                  {item.buttonLabel ?? 'Download'}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
