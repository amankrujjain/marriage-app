'use client';

import { useCallback, useEffect, useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 3000);
    return () => window.clearTimeout(t);
  }, [message]);

  const toast = useCallback((m: string) => setMessage(m), []);

  return { message, toast };
}
