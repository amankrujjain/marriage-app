'use client';

import { useEffect, useRef, useState } from 'react';
import { LanguageCode } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadEditorSections } from '@/features/biodata/components/editor/loadEditorSections';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import { useTranslateBiodata } from '@/features/translation/hooks/useTranslateBiodata';
import { clearTranslation } from '@/features/translation/store/languageSlice';

/** Live-translate the download A4 preview whenever the selected language changes. */
export function useDownloadLanguagePreview(): EditorSectionDef[] {
  const dispatch = useAppDispatch();
  const { translate } = useTranslateBiodata();
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);
  const biodataId = useAppSelector((state) => state.biodata.biodataId);
  const [sections, setSections] = useState<EditorSectionDef[]>([]);
  const requestId = useRef(0);

  useEffect(() => {
    setSections(loadEditorSections(biodataId));
  }, [biodataId]);

  useEffect(() => {
    if (sections.length === 0) return;

    if (exportLanguage === LanguageCode.EN) {
      dispatch(clearTranslation());
      return;
    }

    const id = ++requestId.current;
    void translate(sections).then(() => {
      /* ignore stale responses */
      if (id !== requestId.current) return;
    });
  }, [dispatch, exportLanguage, sections, translate]);

  return sections;
}
