'use client';

import { useMemo, useRef } from 'react';
import { LanguageCode, getLanguageOption } from '@marriage/shared';
import { useAppSelector } from '@/store/hooks';
import { DemoA4Page } from '@/features/demo/DemoA4Page';
import { mapBiodataToDemo } from '@/features/demo/mapBiodataToDemo';
import { useFitScale } from '@/features/demo/useFitScale';
import { photoFitImgStyle } from '@/features/biodata/utils/photoFit';
import { applyTranslatedValuesToSections } from '@/features/translation/utils/applyTranslatedValuesToSections';
import { useDownloadLanguagePreview } from './useDownloadLanguagePreview';

export function DownloadPreviews() {
  const content = useAppSelector((state) => state.biodata.content);
  const translatedContent = useAppSelector(
    (state) => state.language.translatedContent,
  );
  const translatedExtras = useAppSelector(
    (state) => state.language.translatedExtras,
  );
  const translationStatus = useAppSelector((state) => state.language.status);
  const translationError = useAppSelector((state) => state.language.error);
  const translationProvider = useAppSelector((state) => state.language.provider);
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const pageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sections = useDownloadLanguagePreview();

  const previewContent = translatedContent ?? content;
  const langLabel =
    getLanguageOption(exportLanguage)?.name ?? exportLanguage;

  const demoState = useMemo(() => {
    const useTranslated =
      exportLanguage !== LanguageCode.EN && Boolean(translatedContent);

    const sectionInputs = useTranslated
      ? applyTranslatedValuesToSections(
          sections,
          translatedContent!,
          translatedExtras ?? {},
        )
      : sections.map((s) => ({
          title: s.title,
          fields: s.fields.map((f) => ({ label: f.label, value: f.value })),
        }));

    return mapBiodataToDemo(previewContent, templateId, {
      sections: sectionInputs,
    });
  }, [
    exportLanguage,
    previewContent,
    translatedContent,
    translatedExtras,
    templateId,
    sections,
  ]);

  const { fit, scale } = useFitScale(pageRef, stageRef, [demoState]);
  const name = demoState.name;
  const photo = demoState.photo;
  const previewUpdating = translationStatus === 'loading';
  const showTranslatedBadge =
    exportLanguage !== LanguageCode.EN && translationStatus === 'ready';
  const weakOffline =
    showTranslatedBadge && translationProvider === 'dictionary';

  return (
    <section className="dl-previews">
      <h1>Check it once more, then download</h1>

      {previewUpdating ? (
        <p className="dl-preview-status">
          Updating preview in {langLabel}…
        </p>
      ) : null}

      {translationError ? (
        <p className="dl-preview-status dl-preview-status--error">
          Could not translate preview: {translationError}
        </p>
      ) : null}

      {weakOffline ? (
        <p className="dl-preview-status">
          Offline dictionary has limited {langLabel} coverage. Set{' '}
          <code>AI_API_KEY</code> on the server for a full live preview.
        </p>
      ) : null}

      {showTranslatedBadge && !weakOffline ? (
        <p className="dl-preview-status dl-preview-status--ok">
          Preview values shown in {langLabel}. Labels stay in English.
        </p>
      ) : null}

      <div
        className={`dl-preview-row${previewUpdating ? ' is-updating' : ''}`}
      >
        <figure className="dl-figure dl-figure--a4">
          <div className="demo-stage dl-a4-stage" ref={stageRef}>
            <div className="demo-scaler" style={{ transform: `scale(${scale})` }}>
              <DemoA4Page ref={pageRef} state={demoState} fontSizePx={fit.fontSize} />
            </div>
          </div>
          <figcaption>
            <b>A4 PDF</b> · for printing and email
            <span className={`demo-chip demo-chip--${fit.kind} dl-fit-inline`}>{fit.label}</span>
            {showTranslatedBadge ? (
              <span className="dl-fit-inline dl-lang-chip">{langLabel}</span>
            ) : null}
          </figcaption>
        </figure>

        <figure className="dl-figure dl-figure--wa">
          <div className="dl-phone">
            <div className="dl-phone-screen">
              <span className="dl-phone-name">{name}</span>
              {photo ? (
                <span className="dl-phone-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" style={photoFitImgStyle(demoState.photoFit)} />
                </span>
              ) : (
                <span className="dl-phone-photo dl-phone-photo--empty" />
              )}
              <span className="dl-phone-line" style={{ width: '100%' }} />
              <span className="dl-phone-line" style={{ width: '86%' }} />
              <span className="dl-phone-line" style={{ width: '92%' }} />
              <span className="dl-phone-line" style={{ width: '74%' }} />
              <span className="dl-phone-line" style={{ width: '88%' }} />
            </div>
          </div>
          <figcaption>
            <b>WhatsApp image</b> · 1080 × 1920, large text
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
