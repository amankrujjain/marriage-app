'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LanguageCode, getLanguageOption } from '@marriage/shared';
import { useAppSelector } from '@/store/hooks';
import { loadVp } from '@/lib/vp/loadVp';
import {
  designFromSlug,
  slugFromTemplateId,
} from '@/features/biodata/components/editor/designMap';
import { mapBiodataToVp } from '@/features/biodata/components/editor/mapBiodataToVp';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import { applyTranslatedValuesToSections } from '@/features/translation/utils/applyTranslatedValuesToSections';
import { useDownloadLanguagePreview } from './useDownloadLanguagePreview';

type DownloadPreviewsProps = {
  credit: boolean;
};

const A4_PX_W = (210 * 96) / 25.4;

function sectionsFromTranslated(
  sections: EditorSectionDef[],
  translated: ReturnType<typeof applyTranslatedValuesToSections>,
): EditorSectionDef[] {
  return sections.map((section, si) => ({
    ...section,
    fields: section.fields.map((field, fi) => ({
      ...field,
      value: translated[si]?.fields[fi]?.value ?? field.value,
    })),
  }));
}

export function DownloadPreviews({ credit }: DownloadPreviewsProps) {
  const content = useAppSelector((state) => state.biodata.content);
  const translatedContent = useAppSelector((state) => state.language.translatedContent);
  const translatedExtras = useAppSelector((state) => state.language.translatedExtras);
  const translationStatus = useAppSelector((state) => state.language.status);
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const designSlug = useAppSelector(
    (state) =>
      state.template.selectedDesignSlug || slugFromTemplateId(state.template.selectedTemplateId),
  );
  const sections = useDownloadLanguagePreview();
  const a4Ref = useRef<HTMLDivElement>(null);
  const waRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const firstA4 = useRef(true);
  const [fitNote, setFitNote] = useState('');

  const previewContent =
    exportLanguage !== LanguageCode.EN && translatedContent
      ? translatedContent
      : content;

  const previewSections = useMemo(() => {
    if (exportLanguage !== LanguageCode.EN && translatedContent) {
      const mapped = applyTranslatedValuesToSections(
        sections,
        translatedContent,
        translatedExtras ?? {},
      );
      return sectionsFromTranslated(sections, mapped);
    }
    return sections;
  }, [exportLanguage, translatedContent, translatedExtras, sections]);

  const vpData = useMemo(
    () => mapBiodataToVp(previewContent, previewSections),
    [previewContent, previewSections],
  );

  const vpLang = exportLanguage === LanguageCode.HI ? 'hi' : 'en';
  const designName = designFromSlug(designSlug)?.name ?? slugFromTemplateId(templateId);
  const langLabel = getLanguageOption(exportLanguage)?.name ?? exportLanguage;

  useEffect(() => {
    const a4 = a4Ref.current;
    const wa = waRef.current;
    const printHost = printRef.current;
    if (!a4 || !wa || !printHost) return;
    let alive = true;

    void loadVp().then((VP) => {
      if (!alive || !a4Ref.current || !waRef.current || !printRef.current) return;
      const opts = { credit, lang: vpLang };
      const stage = a4Ref.current;
      let fit: { d: number; over: boolean };
      if (firstA4.current || !stage.querySelector('.bd')) {
        firstA4.current = false;
        stage.innerHTML = '';
        const bd = VP.thumb(stage, vpData, designSlug, opts);
        fit = { d: +(bd.dataset.d || 1), over: bd.dataset.fit === 'over' };
      } else {
        const r = VP.update(stage, vpData, designSlug, opts);
        fit = r.fit;
      }
      requestAnimationFrame(() => {
        if (!alive || !a4Ref.current) return;
        const bd = a4Ref.current.querySelector('.bd') as HTMLElement | null;
        if (bd) {
          VP.fit(bd);
          bd.style.transform = `scale(${(a4Ref.current.clientWidth || 200) / A4_PX_W})`;
          fit = {
            d: +(bd.dataset.d || fit.d),
            over: bd.dataset.fit === 'over' || fit.over,
          };
        }
        const fitText = fit.over
          ? 'Too long for one page. Shorten it in the editor.'
          : fit.d < 1
            ? `Fits on 1 page, text scaled to ${Math.round(fit.d * 100)}%`
            : 'Fits on 1 page';
        setFitNote(
          `${designName} · ${fitText}${credit ? ' · with credit line' : ' · no credit line'}`,
        );
      });

      waRef.current.innerHTML = '';
      waRef.current.appendChild(VP.waCard(vpData, designSlug, opts));

      printRef.current.innerHTML = '';
      const printBd = VP.make(vpData, designSlug, opts);
      printBd.setAttribute('data-biodata-preview', '');
      printRef.current.appendChild(printBd);
      VP.fit(printBd);
    });

    return () => {
      alive = false;
    };
  }, [vpData, designSlug, credit, vpLang, designName]);

  const name = String(vpData.name || 'Contact');

  return (
    <>
      <section aria-labelledby="a4h">
        <h2 className="cap" id="a4h">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />
          </svg>
          A4 PDF · for printing
        </h2>
        {translationStatus === 'loading' ? (
          <p className="note" style={{ textAlign: 'center' }}>
            Updating preview in {langLabel}…
          </p>
        ) : null}
        <div
          ref={a4Ref}
          className="thumb"
          role="img"
          aria-label="A4 PDF preview of your biodata"
        />
        <p className="note" style={{ textAlign: 'center', marginTop: 12 }}>
          {fitNote}
        </p>
        {/* Full-size A4 for export capture (off-screen). */}
        <div
          ref={printRef}
          id="print-sheet"
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: -10000,
            top: 0,
            width: '210mm',
            pointerEvents: 'none',
            opacity: 0,
          }}
        />
      </section>

      <section aria-labelledby="waH">
        <h2 className="cap" id="waH">
          WhatsApp phone preview
        </h2>
        <div className="phone2">
          <div className="phone-screen">
            <div className="wa-bar" style={{ paddingTop: 26 }}>
              <i />
              <div>
                {name}
                <small>online</small>
              </div>
            </div>
            <div className="wa-body" style={{ padding: '12px 9px' }}>
              <div className="today">Today</div>
              <div className="wa-card">
                <div ref={waRef} id="wa-pic" />
                <div className="time">11:30 AM ✓✓</div>
              </div>
            </div>
          </div>
        </div>
        <p className="note" style={{ textAlign: 'center', marginTop: 14 }}>
          The share image is a 4:5 card. Send it with your PDF.
        </p>
      </section>
    </>
  );
}
