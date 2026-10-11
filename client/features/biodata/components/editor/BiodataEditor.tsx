'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTemplate } from '@/features/templates/store/templateSlice';
import { fetchBiodata } from '../../services/biodataApi';
import { loadBiodata } from '../../store/biodataSlice';
import { EditorAppBar } from './EditorAppBar';
import { EditorForm } from './EditorForm';
import { EditorA4Preview } from './EditorA4Preview';
import { EditorDesignSwitcher } from './EditorDesignSwitcher';
import { templateFromDesignQuery, designKeyFromTemplate } from './designMap';
import { useEditorSections } from './useEditorSections';

type MobileTab = 'details' | 'preview';

export function BiodataEditor() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const sectionsApi = useEditorSections();
  const [mobileTab, setMobileTab] = useState<MobileTab>('details');
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const designName = designKeyFromTemplate(templateId);
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);
  const biodataId = useAppSelector((state) => state.biodata.biodataId);
  const authStatus = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    const mapped = templateFromDesignQuery(searchParams.get('design'));
    if (mapped) dispatch(selectTemplate(mapped));
  }, [dispatch, searchParams]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || authStatus !== 'authenticated') return;
    if (biodataId === id) return;
    let cancelled = false;
    void fetchBiodata(id)
      .then((record) => {
        if (cancelled) return;
        dispatch(
          loadBiodata({
            id: record.id,
            title: record.title,
            content: record.content,
          }),
        );
      })
      .catch(() => {
        /* keep current draft if fetch fails */
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams, authStatus, biodataId, dispatch]);

  const draftLabel =
    saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'saved'
        ? 'Draft saved on this phone'
        : 'Draft saved on this phone';

  return (
    <div className="editor">
      <SiteHeader variant="app" />

      <div className="editor-desktop-chrome">
        <EditorAppBar />
      </div>

      <header className="editor-mobile-bar">
        <div className="editor-mobile-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'details'}
            className={mobileTab === 'details' ? 'is-active' : ''}
            onClick={() => setMobileTab('details')}
          >
            Details
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'preview'}
            className={mobileTab === 'preview' ? 'is-active' : ''}
            onClick={() => setMobileTab('preview')}
          >
            Preview
          </button>
        </div>
        <div className="editor-mobile-progress">
          <div className="editor-mobile-progress-track">
            <div
              className="editor-mobile-progress-fill"
              style={{ width: `${sectionsApi.progressPct}%` }}
            />
          </div>
          <span>{sectionsApi.progressLabel}</span>
        </div>
      </header>

      <div className="editor-layout">
        <div
          className={`editor-form-pane ${mobileTab === 'details' ? 'is-mobile-visible' : ''}`}
        >
          <EditorForm sectionsApi={sectionsApi} />
        </div>
        <aside
          className={`editor-aside ${mobileTab === 'preview' ? 'is-mobile-visible' : ''}`}
        >
          <EditorA4Preview sections={sectionsApi.sections} />
          <EditorDesignSwitcher />
          <Link href="/download" className="editor-download-cta hide-on-mobile">
            Preview &amp; download
          </Link>
        </aside>
      </div>

      <footer className="editor-mobile-footer">
        <div className="editor-mobile-thumb" aria-hidden />
        <div className="editor-mobile-footer-copy">
          <b>
            {designName.charAt(0).toUpperCase() + designName.slice(1)} · fits on 1 page
          </b>
          <span>{draftLabel}</span>
        </div>
        <Link href="/download" className="editor-mobile-preview-btn">
          Preview
        </Link>
      </footer>
    </div>
  );
}
