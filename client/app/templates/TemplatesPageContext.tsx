'use client';

import { useEffect } from 'react';
import { setPageContext } from '@/lib/analytics';

/** Sets GA4 page_slug / origin for the templates gallery session. */
export function TemplatesPageContext() {
  useEffect(() => {
    setPageContext('templates', '/templates/');
  }, []);
  return null;
}
