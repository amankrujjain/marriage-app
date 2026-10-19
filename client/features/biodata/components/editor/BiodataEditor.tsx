'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectDesign } from '@/features/templates/store/templateSlice';
import { fetchBiodata } from '../../services/biodataApi';
import {
  loadBiodata,
  resetBiodataDraft,
  setDesignSlug,
} from '../../store/biodataSlice';
import { useSaveBiodata } from '../../hooks/useSaveBiodata';
import { EditorAppBar } from './EditorAppBar';
import { EditorForm } from './EditorForm';
import { EditorA4Preview } from './EditorA4Preview';
import { EditorDesignSwitcher } from './EditorDesignSwitcher';
import { designFromSlug, templateFromDesignQuery } from './designMap';
import { useEditorSections } from './useEditorSections';

type MobileTab = 'details' | 'preview';

export function BiodataEditor() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionsApi = useEditorSections();
  const { save } = useSaveBiodata();
  const [mobileTab, setMobileTab] = useState<MobileTab>('details');
  const [savingMd, setSavingMd] = useState(false);
  const authStatus = useAppSelector((state) => state.auth.status);
  const biodataId = useAppSelector((state) => state.biodata.biodataId);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      dispatch(resetBiodataDraft());
      const mapped = templateFromDesignQuery(searchParams.get('design'));
      if (mapped) {
        dispatch(selectDesign(mapped));
        dispatch(setDesignSlug(mapped.slug));
      }
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    const mapped = templateFromDesignQuery(searchParams.get('design'));
    if (mapped) {
      dispatch(selectDesign(mapped));
      dispatch(setDesignSlug(mapped.slug));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || authStatus !== 'authenticated') return;
    if (biodataId === id) return;
    let cancelled = false;
    void fetchBiodata(id)
      .then((record) => {
        if (cancelled) return;
        const slug =
          record.designSlug ||
          record.content?.designSlug ||
          searchParams.get('design') ||
          undefined;
        dispatch(
          loadBiodata({
            id: record.id,
            title: record.title,
            content: {
              ...record.content,
              ...(slug ? { designSlug: slug } : {}),
            },
            designSlug: slug,
            editorSections: record.editorSections,
          }),
        );
        const fromRecord = designFromSlug(slug);
        if (fromRecord) {
          dispatch(
            selectDesign({ templateId: fromRecord.templateId, slug: fromRecord.slug }),
          );
          dispatch(setDesignSlug(fromRecord.slug));
          return;
        }
        const fromQuery = templateFromDesignQuery(searchParams.get('design'));
        if (fromQuery) {
          dispatch(selectDesign(fromQuery));
          dispatch(setDesignSlug(fromQuery.slug));
        }
      })
      .catch(() => {
        /* keep current draft if fetch fails */
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams, authStatus, biodataId, dispatch]);

  async function onSaveMyDesigns() {
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/my-designs');
      return;
    }
    setSavingMd(true);
    try {
      await save();
      router.push('/my-designs');
    } finally {
      setSavingMd(false);
    }
  }

  return (
    <div className="landing editor-page">
      <SiteHeader variant="editor" />
      <EditorAppBar />

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
      </header>

      <main id="main" className="ed">
        <div
          id="form"
          className={mobileTab === 'details' ? 'is-mobile-visible' : 'hide-on-mobile-tab'}
        >
          <EditorForm sectionsApi={sectionsApi} />
        </div>

        <aside
          className={`prev${mobileTab === 'preview' ? ' is-mobile-visible' : ' hide-on-mobile-tab'}`}
          aria-label="Live preview"
        >
          <EditorA4Preview sections={sectionsApi.sections} />
          <EditorDesignSwitcher />
          <div className="ed-foot">
            <Link className="btn btn-line" href="/templates">
              Browse all designs
            </Link>
            <button
              className="btn btn-line"
              type="button"
              disabled={savingMd}
              onClick={() => void onSaveMyDesigns()}
            >
              {savingMd ? 'Saving…' : 'Save to My Designs'}
            </button>
            <Link className="btn btn-primary" href="/download">
              Continue to download{' '}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </aside>
      </main>

      <footer className="editor-mobile-footer">
        <Link href="/download" className="editor-mobile-preview-btn">
          Continue to download
        </Link>
      </footer>

      <SiteFooter slim />
    </div>
  );
}
