import Link from 'next/link';
import type { SpokeHub, SpokePageConfig } from '@/content/spokes/types';
import { hubLinks, relatedFor } from '@/content/spokes';

type SpokeRelatedLinksProps =
  | { variant?: 'related'; page: SpokePageConfig }
  | { variant: 'hub'; page?: undefined };

export function SpokeRelatedLinks(props: SpokeRelatedLinksProps) {
  if (props.variant === 'hub') {
    const byHub = hubLinks();
    const hubs = Object.entries(byHub) as Array<[SpokeHub, SpokePageConfig[]]>;
    if (hubs.length === 0) return null;

    return (
      <section className="sec alt" aria-labelledby="spoke-hub-h">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2 id="spoke-hub-h">Biodata formats</h2>
          </div>
          <div className="reveal" style={{ display: 'grid', gap: 16 }}>
            {hubs.map(([hub, pages]) => (
              <div key={hub}>
                <h3 style={{ marginBottom: 8 }}>{hub}</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {pages.map((page) => (
                    <li key={page.id}>
                      <Link href={page.path}>{page.breadcrumbName}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const related = relatedFor(props.page);
  if (related.length === 0) return null;

  return (
    <section className="sec alt" aria-labelledby="spoke-related-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-related-h">Related</h2>
        </div>
        <ul className="reveal" style={{ margin: 0, paddingLeft: 18 }}>
          {related.map((page) => (
            <li key={page.id}>
              <Link href={page.path}>{page.breadcrumbName}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
