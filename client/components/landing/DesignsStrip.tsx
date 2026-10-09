import Link from 'next/link';

const DESIGNS = [
  {
    id: 'zari',
    name: 'Zari',
    category: 'Traditional',
    blessing: '॥ श्री गणेशाय नमः ॥',
    blessingColor: '#7A1F2B',
    nameColor: '#7A1F2B',
    photoRadius: '2px',
    lineBg: '#E8D8C2',
    previewClass: 'design-preview--zari',
  },
  {
    id: 'panna',
    name: 'Panna',
    category: 'Royal',
    blessing: '॥ ॐ नमः शिवाय ॥',
    blessingColor: '#0F4D36',
    nameColor: '#0F4D36',
    photoRadius: '27px 27px 2px 2px',
    lineBg: '#E2DCC7',
    previewClass: 'design-preview--panna',
  },
  {
    id: 'genda',
    name: 'Genda',
    category: 'Floral',
    blessing: '॥ जय श्री कृष्ण ॥',
    blessingColor: '#9A3412',
    nameColor: '#9A3412',
    photoRadius: '50%',
    lineBg: '#F1DDBE',
    previewClass: 'design-preview--genda',
  },
  {
    id: 'kagaz',
    name: 'Kagaz',
    category: 'Modern',
    blessing: '\u00A0',
    blessingColor: '#1F2226',
    nameColor: '#1F2226',
    photoRadius: '3px',
    lineBg: '#E8E4E1',
    previewClass: 'design-preview--kagaz',
  },
] as const;

const LINE_WIDTHS = ['90%', '80%', '86%', '70%'] as const;

export function DesignsStrip() {
  return (
    <section id="designs" className="designs">
      <div className="designs-head">
        <div className="designs-head-copy">
          <h2>Designs for every family</h2>
          <p>Traditional, royal, floral or modern. Your details appear on each one as you browse.</p>
        </div>
        <Link href="/templates" className="designs-all">
          View all designs →
        </Link>
      </div>
      <div className="designs-grid">
        {DESIGNS.map((design) => (
          <Link
            key={design.id}
            href="/marriage-biodata-maker"
            className="design-card"
          >
            <div className={`design-preview ${design.previewClass}`}>
              <span
                className="design-preview-blessing"
                style={{ color: design.blessingColor }}
              >
                {design.blessing}
              </span>
              <span
                className="design-preview-name"
                style={{ color: design.nameColor }}
              >
                Ananya Sharma
              </span>
              <span
                className="design-preview-photo"
                style={{ borderRadius: design.photoRadius }}
              />
              {LINE_WIDTHS.map((width) => (
                <span
                  key={width}
                  className="design-preview-line"
                  style={{ width, background: design.lineBg }}
                />
              ))}
            </div>
            <div className="design-meta">
              <b>{design.name}</b>
              <span>{design.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
