import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import type { SpokeSection } from '@/content/spokes/types';
import { publicFileExists } from '@/features/spokes/sampleImages';
import {
  SpokeInline,
  hasOnlyUnpublishedLinks,
} from './SpokeInline';

const bodyStyle: CSSProperties = {
  maxWidth: 640,
  margin: '0 auto',
  color: 'var(--ink-2)',
};

function keepText(text: string, hideUnlinked: boolean | undefined): boolean {
  if (!hideUnlinked) return true;
  return !hasOnlyUnpublishedLinks(text);
}

function renderBlock(section: SpokeSection): ReactNode {
  const hide = section.hideUnlinked;
  const paras = (section.paras ?? []).filter((p) => keepText(p, hide));
  const list = (section.list ?? []).filter((item) => keepText(item, hide));
  const after = (section.after ?? []).filter((p) => keepText(p, hide));
  const hasTable = Boolean(section.table);
  const image =
    section.image && publicFileExists(section.image.src)
      ? section.image
      : null;
  const cta = section.cta;

  if (
    paras.length === 0 &&
    list.length === 0 &&
    !hasTable &&
    after.length === 0 &&
    !image &&
    !cta
  ) {
    return null;
  }

  const ListTag = section.ordered ? 'ol' : 'ul';
  const hId = `sec-${section.id}-h`;
  const listStyle: CSSProperties = section.checklist
    ? {
        ...bodyStyle,
        listStyle: 'none',
        paddingLeft: 0,
        display: 'grid',
        gap: 10,
        textAlign: 'left',
      }
    : {
        ...bodyStyle,
        paddingLeft: '1.35em',
        listStyleType: section.ordered ? 'decimal' : 'disc',
        display: 'grid',
        gap: 10,
        textAlign: 'left',
      };

  return (
    <section key={section.id} className="spoke-sec-block" aria-labelledby={hId}>
      <div className="sec-head reveal">
        <h2 id={hId}>{section.h2}</h2>
      </div>
      {paras.map((p) => (
        <p key={p} className="reveal" style={bodyStyle}>
          <SpokeInline text={p} />
        </p>
      ))}
      {list.length > 0 ? (
        <ListTag className="reveal" style={listStyle}>
          {list.map((item) => (
            <li key={item}>
              <SpokeInline text={item} />
            </li>
          ))}
        </ListTag>
      ) : null}
      {section.table ? (
        <div
          className="card reveal"
          style={{
            ...bodyStyle,
            maxWidth: 780,
            overflowX: 'auto',
            padding: 0,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {section.table.head.map((cell, i) => (
                  <th
                    key={`${cell}-${i}`}
                    scope="col"
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--line)',
                      textAlign: 'left',
                    }}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => {
                    const style = {
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--line)',
                      textAlign: 'left' as const,
                    };
                    if (i === 0) {
                      return (
                        <th key={cell} scope="row" style={style}>
                          <SpokeInline text={cell} />
                        </th>
                      );
                    }
                    return (
                      <td key={`${cell}-${i}`} style={style}>
                        <SpokeInline text={cell} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {after.map((p) => (
        <p key={p} className="reveal" style={{ ...bodyStyle, marginTop: 16 }}>
          <SpokeInline text={p} />
        </p>
      ))}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="reveal"
          style={{
            ...bodyStyle,
            maxWidth: 640,
            width: '100%',
            height: 'auto',
            display: 'block',
            marginTop: 20,
          }}
        />
      ) : null}
      {cta ? (
        <p className="reveal" style={{ marginTop: 20, textAlign: 'center' }}>
          <Link className="btn btn-primary" href={cta.href}>
            {cta.label}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

export function SpokeSections({ sections }: { sections: SpokeSection[] }) {
  if (sections.length === 0) return null;

  const nodes = sections.map(renderBlock).filter(Boolean);
  if (nodes.length === 0) return null;

  return (
    <section className="sec">
      <div className="wrap spoke-secs">{nodes}</div>
    </section>
  );
}
