'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  getDesignShortcuts,
  getFormatsNavHubs,
  type FormatsNavHub,
} from '@/content/nav/formatsNav';
import { MegaDesignThumb } from './MegaDesignThumb';
import { ArrowIcon, pathMatches } from './navIcons';

type HeaderMegaMenuProps = {
  open: boolean;
  pathname: string;
  showPassCard: boolean;
  onClose: () => void;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

function MegaCol({
  hub,
  pathname,
}: {
  hub: FormatsNavHub;
  pathname: string;
}) {
  const headingId = `mh-${hub.id}`;
  return (
    <div className="mega-col">
      <h3 id={headingId}>{hub.label}</h3>
      <ul aria-labelledby={headingId}>
        {hub.links.map((link) => (
          <li key={link.href}>
            <Link
              className="mega-link"
              href={link.href}
              aria-current={pathMatches(pathname, link.href) ? 'page' : undefined}
            >
              <b lang={link.lang}>{link.label}</b>
              <span lang={link.descLang}>{link.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeaderMegaMenu({
  open,
  pathname,
  showPassCard,
  onClose,
  onHoverEnter,
  onHoverLeave,
  triggerRef,
}: HeaderMegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { isLaunch, hubs } = getFormatsNavHubs();
  const shortcuts = getDesignShortcuts();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, triggerRef]);

  return (
    <>
      <div
        ref={panelRef}
        className={`mega-panel${open ? ' open' : ''}`}
        id="mega-formats"
        aria-label="Biodata formats"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (
            panelRef.current?.contains(next) ||
            triggerRef.current === next
          ) {
            return;
          }
          onClose();
        }}
      >
        <div className={`wrap mega-inner${isLaunch ? ' is-launch' : ''}`}>
          <div
            className="mega-hubs"
            style={
              isLaunch
                ? { gridTemplateColumns: '1fr', gap: 18 }
                : undefined
            }
          >
            {hubs.map((hub) => (
              <MegaCol key={hub.id} hub={hub} pathname={pathname} />
            ))}
          </div>

          {isLaunch ? (
            <div className="mega-shortcuts">
              <div className="mega-shortcuts-head">
                <h3 id="mh-designs">Designs</h3>
                <Link href="/templates/">See all designs and filter</Link>
              </div>
              <ul className="mega-designs" aria-labelledby="mh-designs">
                {shortcuts.map((d) => (
                  <li key={d.slug}>
                    <Link className="mega-design" href={`/?design=${d.slug}`}>
                      <MegaDesignThumb slug={d.slug} />
                      <span className="mega-design-meta">
                        <b>{d.name}</b>
                        <span
                          className={`mega-badge${d.tier === 'Premium' ? ' prem' : ''}`}
                        >
                          {d.tier}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <aside className="mega-rail" aria-label="Start a biodata">
            <Link className="btn btn-primary" href="/">
              Create my biodata <ArrowIcon />
            </Link>
            <Link className="mega-sub" href="/templates/">
              Browse designs
            </Link>
            {showPassCard ? (
              <div className="mega-pass">
                <p className="eyebrow">Wedding Pass</p>
                <strong>
                  ₹151 <span className="mega-pass-term">for 30 days</span>
                </strong>
                <p>One-time · All premium designs · No credit line</p>
                <Link href="/wedding-pass/">
                  Get Wedding Pass <ArrowIcon />
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
      <div
        className={`mega-scrim${open ? ' open' : ''}`}
        aria-hidden
        onClick={onClose}
      />
    </>
  );
}
