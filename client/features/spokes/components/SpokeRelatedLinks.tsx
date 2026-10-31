import Link from 'next/link';
import type { SpokeHub, SpokePageConfig } from '@/content/spokes/types';
import { hubLinks, otherSpokes } from '@/content/spokes';

type SpokeRelatedLinksProps =
  | { variant?: 'related'; page: SpokePageConfig }
  | { variant: 'hub'; page?: undefined };

const HOME_AND_TEMPLATES: Array<{
  path: string;
  label: string;
  note: string;
}> = [
  { path: '/', label: 'Home', note: 'Free biodata maker' },
  { path: '/templates/', label: 'Designs', note: 'Browse all templates' },
];

function SpokeLinkCard({
  href,
  label,
  note,
  lang,
}: {
  href: string;
  label: string;
  note?: string;
  lang?: string;
}) {
  return (
    <Link
      href={href}
      className="spoke-link-card"
      lang={lang}
      aria-label={note ? `${label}: ${note}` : label}
    >
      <span className="spoke-link-card-label">{label}</span>
      {note ? <span className="spoke-link-card-note">{note}</span> : null}
      <span className="spoke-link-card-arrow" aria-hidden>
        →
      </span>
    </Link>
  );
}

export function SpokeRelatedLinks(props: SpokeRelatedLinksProps) {
  if (props.variant === 'hub') {
    const byHub = hubLinks();
    const hubs = Object.entries(byHub) as Array<[SpokeHub, SpokePageConfig[]]>;
    if (hubs.length === 0) return null;

    return (
      <section className="sec alt" aria-labelledby="spoke-hub-h">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Explore</span>
            <h2 id="spoke-hub-h">Biodata formats</h2>
            <p>Formats for every family, community and language.</p>
          </div>
          <div className="spoke-hub-grid reveal">
            {hubs.map(([hub, pages]) => (
              <div className="spoke-hub-col" key={hub}>
                <h3>{hub}</h3>
                <div className="spoke-link-grid">
                  {pages.map((page) => (
                    <SpokeLinkCard
                      key={page.id}
                      href={page.path}
                      label={page.breadcrumbName}
                      note={page.h1}
                      lang={page.language === 'en' ? undefined : page.language}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const related = otherSpokes(props.page);

  return (
    <section className="sec alt" aria-labelledby="spoke-related-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Keep exploring</span>
          <h2 id="spoke-related-h">Related formats</h2>
          <p>Other biodata pages on MarriageBio.</p>
        </div>
        <div className="spoke-link-grid reveal">
          {HOME_AND_TEMPLATES.map((item) => (
            <SpokeLinkCard
              key={item.path}
              href={item.path}
              label={item.label}
              note={item.note}
            />
          ))}
          {related.map((page) => (
            <SpokeLinkCard
              key={page.id}
              href={page.path}
              label={page.breadcrumbName}
              note={page.h1}
              lang={page.language === 'en' ? undefined : page.language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
