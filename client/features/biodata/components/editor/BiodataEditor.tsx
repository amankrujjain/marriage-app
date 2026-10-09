'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { selectTemplate } from '@/features/templates/store/templateSlice';
import { EditorAppBar } from './EditorAppBar';
import { EditorForm } from './EditorForm';
import { EditorA4Preview } from './EditorA4Preview';
import { EditorDesignSwitcher } from './EditorDesignSwitcher';
import { templateFromDesignQuery } from './designMap';

export function BiodataEditor() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mapped = templateFromDesignQuery(searchParams.get('design'));
    if (mapped) dispatch(selectTemplate(mapped));
  }, [dispatch, searchParams]);

  return (
    <div className="editor">
      <EditorAppBar />
      <div className="editor-layout">
        <EditorForm />
        <aside className="editor-aside">
          <EditorA4Preview />
          <EditorDesignSwitcher />
          <Link href="/download" className="editor-download-cta">
            Preview &amp; download
          </Link>
          <Link href="/demo" className="editor-demo-link">
            Open interactive template demo →
          </Link>
        </aside>
      </div>
    </div>
  );
}
