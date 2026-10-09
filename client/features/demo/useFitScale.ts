'use client';

import { useCallback, useEffect, useState } from 'react';

export type FitStatus = {
  kind: 'ok' | 'warn' | 'bad';
  label: string;
  fontSize: number;
};

const BASE_FS = 14;
const MIN_FS = 10.5;

export function useFitScale(
  pageRef: React.RefObject<HTMLDivElement | null>,
  stageRef: React.RefObject<HTMLDivElement | null>,
  deps: unknown[],
) {
  const [fit, setFit] = useState<FitStatus>({
    kind: 'ok',
    label: 'Fits on 1 page',
    fontSize: BASE_FS,
  });
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const page = pageRef.current;
    const stage = stageRef.current;
    if (!page || !stage) return;

    const content = page.querySelector('.demo-page-content') as HTMLElement | null;
    if (!content) return;

    let fs = BASE_FS;
    page.style.setProperty('--fs', `${fs}px`);
    while (content.scrollHeight > content.clientHeight + 1 && fs > MIN_FS) {
      fs -= 0.25;
      page.style.setProperty('--fs', `${fs}px`);
    }
    const overflow = content.scrollHeight > content.clientHeight + 1;
    setFit({
      fontSize: fs,
      kind: overflow ? 'bad' : fs < BASE_FS ? 'warn' : 'ok',
      label: overflow
        ? 'Too long for 1 page — remove a field or use the 2-page layout'
        : fs < BASE_FS
          ? `Fits on 1 page · text reduced to ${fs}px`
          : 'Fits on 1 page',
    });

    const k = stage.clientWidth / 794;
    setScale(k);
    stage.style.height = `${1123 * k}px`;
  }, [pageRef, stageRef]);

  useEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(stage);
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => measure());
    }
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  return { fit, scale, remasure: measure };
}
