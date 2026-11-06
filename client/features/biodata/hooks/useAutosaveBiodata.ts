'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useSaveBiodata } from './useSaveBiodata';

const DEBOUNCE_MS = 1500;

/**
 * When logged in, debounce-save after content / sections / design changes
 * so My Designs always has the latest draft (including template switches).
 */
export function useAutosaveBiodata(): void {
  const { save } = useSaveBiodata();
  const authStatus = useAppSelector((state) => state.auth.status);
  const content = useAppSelector((state) => state.biodata.content);
  const editorSections = useAppSelector((state) => state.biodata.editorSections);
  const designSlug = useAppSelector((state) => state.biodata.designSlug);
  const templateSlug = useAppSelector((state) => state.template.selectedDesignSlug);
  const skipFirst = useRef(true);
  const inFlight = useRef(false);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    if (authStatus !== 'authenticated') return;

    const timer = window.setTimeout(() => {
      if (inFlight.current) return;
      inFlight.current = true;
      void save().finally(() => {
        inFlight.current = false;
      });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [authStatus, content, editorSections, designSlug, templateSlug, save]);
}
