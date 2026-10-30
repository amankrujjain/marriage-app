'use client';

import { useEffect } from 'react';
import { setPageSlug } from '@/lib/analytics';

/** Sets GA4 page_slug for the templates gallery (does not claim origin path). */
export function TemplatesPageContext() {
  useEffect(() => {
    setPageSlug('templates');
  }, []);
  return null;
}
