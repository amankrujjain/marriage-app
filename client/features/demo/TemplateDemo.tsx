'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { DemoState } from './demoTypes';
import { DEMO_DRAFT_KEY } from './demoTypes';
import { INITIAL_DEMO_STATE } from './demoSample';
import { DemoFormPanel } from './DemoFormPanel';
import { DemoPreviewStage } from './DemoPreviewStage';

function loadDraft(): DemoState {
  try {
    const raw = localStorage.getItem(DEMO_DRAFT_KEY);
    if (!raw) return INITIAL_DEMO_STATE;
    const parsed = JSON.parse(raw) as DemoState;
    if (parsed?.sections) return { ...INITIAL_DEMO_STATE, ...parsed };
  } catch {
    /* ignore */
  }
  return INITIAL_DEMO_STATE;
}

export function TemplateDemo() {
  const [state, setState] = useState<DemoState>(INITIAL_DEMO_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(DEMO_DRAFT_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  return (
    <div className="demo">
      <div className="demo-wrap">
        <header className="demo-top">
          <div className="demo-brand">
            <div className="demo-tag">Demo template</div>
            <h1>Biodata Maker</h1>
            <p>
              Edit the details on the left. The A4 biodata on the right updates as you type, hides
              empty fields, and shrinks text to stay on one page.
            </p>
          </div>
          <div className="demo-top-links">
            <Link href="/marriage-biodata-maker">Open full editor</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/">Home</Link>
          </div>
        </header>

        <div className="demo-grid">
          <DemoFormPanel state={state} onChange={setState} />
          <DemoPreviewStage state={state} />
        </div>
      </div>
    </div>
  );
}
