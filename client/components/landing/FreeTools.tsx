'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Toast } from './Toast';
import { useToast } from './useToast';

const BUDGET_SPLIT: [string, number, string][] = [
  ['Venue and catering', 45, '#681421'],
  ['Attire and jewellery', 15, '#E3A21A'],
  ['Decor and flowers', 10, '#0F4D36'],
  ['Photo and video', 8, '#B4852C'],
  ['Travel and stay', 7, '#2A1517'],
  ['Music and entertainment', 5, '#a85a64'],
  ['Gifts and extras', 5, '#8a7a70'],
  ['Buffer', 5, '#d6c7b8'],
];

function clean(s: string) {
  return s
    .replace(/[^A-Za-z0-9\u00C0-\u024F ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function first(s: string) {
  return clean((s.trim().split(/\s+/)[0] || '') as string);
}

function num(v: string) {
  return Math.max(0, parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 0);
}

export function FreeTools() {
  const { message, toast } = useToast();
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [city, setCity] = useState('');
  const [total, setTotal] = useState('1500000');
  const [guests, setGuests] = useState('250');
  const [pname, setPname] = useState('');
  const [page, setPage] = useState('');
  const [pcity, setPcity] = useState('');
  const [pprof, setPprof] = useState('');

  const hashtags = useMemo(() => {
    const a = first(n1);
    const b = first(n2);
    const c = clean(city);
    if (!a || !b) return null;
    return [
      `#${a}Weds${b}`,
      `#${a}And${b}`,
      `#${a}Plus${b}`,
      `#${a}${b}KiShaadi`,
      `#${a[0]}${b[0]}Forever`,
      c ? `#${a}And${b}In${c}` : `#${a}${b}SaathPhere`,
    ];
  }, [n1, n2, city]);

  const fmt = useMemo(() => new Intl.NumberFormat('en-IN'), []);
  const t = num(total);
  const g = num(guests);
  const budgetNote =
    (t
      ? `Total ₹${fmt.format(t)}${
          g ? ` · about ₹${fmt.format(Math.round(t / g))} per guest` : ''
        }. `
      : 'Enter a total budget. ') + 'Typical split, edit later. An estimate, not financial advice.';

  const profileMeta = useMemo(() => {
    const parts: string[] = [];
    if (page.trim()) parts.push(`${num(page)} yrs`);
    if (pprof.trim()) parts.push(pprof.trim());
    if (pcity.trim()) parts.push(pcity.trim());
    return parts.length ? parts.join(' · ') : 'Age · Profession · City';
  }, [page, pprof, pcity]);

  async function copyTag(tag: string) {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(tag);
    } catch {
      /* ignore */
    }
    toast(`Copied ${tag}`);
  }

  return (
    <section className="sec alt tools-sec" id="tools" aria-labelledby="tools-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Free wedding tools</span>
          <h2 id="tools-h">A few free tools for the wedding ahead</h2>
          <p>
            Try each one right here. Results are examples and estimates to get you started. When you
            are ready, the biodata maker is one click away.
          </p>
        </div>
        <div className="tools">
          <article className="tool reveal">
            <div className="t-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 4L7 20M17 4l-2 16M4 9h17M3 15h17" />
              </svg>
            </div>
            <h3>Wedding hashtag generator</h3>
            <p>
              Turn your two names into hashtag ideas for invitations and photos. Tap one to copy.
            </p>
            <form
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
              style={{ display: 'grid', gap: 10 }}
            >
              <div className="row2">
                <label className="fld">
                  <span>Name 1</span>
                  <input value={n1} onChange={(e) => setN1(e.target.value)} placeholder="e.g. Ananya" />
                </label>
                <label className="fld">
                  <span>Name 2</span>
                  <input value={n2} onChange={(e) => setN2(e.target.value)} placeholder="e.g. Rohan" />
                </label>
              </div>
              <label className="fld">
                <span>City (optional)</span>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Jaipur" />
              </label>
              <ul className="chips" aria-live="polite">
                {hashtags ? (
                  hashtags.map((tag) => (
                    <li key={tag}>
                      <button type="button" title="Tap to copy" onClick={() => void copyTag(tag)}>
                        {tag}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="note">Enter two names to see 6 example hashtags.</li>
                )}
              </ul>
              <p className="note">
                Examples only. Check a hashtag is not already in use before you print it.
              </p>
            </form>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={() => toast('Hashtag generator page is a placeholder. It is not built yet.')}
            >
              Open hashtag generator
            </button>
          </article>

          <article className="tool reveal">
            <div className="t-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4" />
              </svg>
            </div>
            <h3>Wedding budget calculator</h3>
            <p>See how a total budget could be divided across the main wedding costs.</p>
            <form
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
              style={{ display: 'grid', gap: 10 }}
            >
              <div className="row2">
                <label className="fld">
                  <span>Total budget (₹)</span>
                  <input
                    inputMode="numeric"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                  />
                </label>
                <label className="fld">
                  <span>Guests</span>
                  <input
                    inputMode="numeric"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </label>
              </div>
              <div className="bar" role="img" aria-label="Budget split bar">
                {BUDGET_SPLIT.map(([label, pct, color]) => (
                  <i key={label} style={{ background: color, width: `${pct}%` }} title={label} />
                ))}
              </div>
              <ul className="split">
                {BUDGET_SPLIT.map(([label, pct, color]) => (
                  <li key={label} style={{ ['--c' as string]: color }}>
                    <span>
                      {label} · {pct}%
                    </span>
                    <b className="amt">₹{fmt.format(Math.round((t * pct) / 100))}</b>
                  </li>
                ))}
              </ul>
              <p className="note">{budgetNote}</p>
            </form>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={() => toast('Budget calculator page is a placeholder. It is not built yet.')}
            >
              Open budget calculator
            </button>
          </article>

          <article className="tool reveal">
            <div className="t-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1-5 4-7 8-7s7 2 8 7" />
              </svg>
            </div>
            <h3>Marriage profile maker</h3>
            <p>Put the basics into a short profile card, then carry on to the full biodata.</p>
            <form
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
              style={{ display: 'grid', gap: 10 }}
            >
              <label className="fld">
                <span>Name</span>
                <input
                  value={pname}
                  onChange={(e) => setPname(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                />
              </label>
              <div className="row2">
                <label className="fld">
                  <span>Age</span>
                  <input
                    inputMode="numeric"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    placeholder="e.g. 28"
                  />
                </label>
                <label className="fld">
                  <span>City</span>
                  <input
                    value={pcity}
                    onChange={(e) => setPcity(e.target.value)}
                    placeholder="e.g. Gaya"
                  />
                </label>
              </div>
              <label className="fld">
                <span>Profession</span>
                <input
                  value={pprof}
                  onChange={(e) => setPprof(e.target.value)}
                  placeholder="e.g. Asst. Professor"
                />
              </label>
              <div className="pcard" aria-live="polite">
                <span className="ex">Example</span>
                <div className="av" />
                <div>
                  <div className="pn" style={{ opacity: pname.trim() ? 1 : 0.4 }}>
                    {pname.trim() || 'Your name'}
                  </div>
                  <div className="pm" style={{ opacity: profileMeta.includes('·') && !page && !pprof && !pcity ? 0.45 : 1 }}>
                    {profileMeta}
                  </div>
                </div>
              </div>
            </form>
            <Link className="btn btn-primary btn-block" href="/marriage-biodata-maker">
              Continue to full biodata maker
            </Link>
          </article>
        </div>
      </div>
      <Toast message={message} />
    </section>
  );
}
